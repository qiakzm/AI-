from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
from langchain.chains import LLMChain
from langchain.chat_models import ChatOpenAI
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.memory import ConversationBufferWindowMemory
from langchain.prompts import PromptTemplate
from langchain.vectorstores import FAISS
import warnings
from openai import OpenAI

import os

warnings.filterwarnings("ignore", category=DeprecationWarning)
client = OpenAI(
    # defaults to os.environ.get("OPENAI_API_KEY")
    api_key='',
)
# Load environment variables
openai.api_key = ''

# Load your data and create embeddings
embeddings = OpenAIEmbeddings(openai_api_key=openai.api_key)
docsearch = FAISS.load_local("./vec", embeddings, allow_dangerous_deserialization=True)

# Define the prompt template
template = """
당신의 임무는 제공된 데이터를 바탕으로 국어와 영어 수능 문제 해설 및 정답을 제공하는 것입니다. 사용자에게 이해하기 쉽게 작성해줘야 합니다. 지문과 연관된 질문에 대한 대답을 해주셔야 합니다. 내용은 한국어로 작성하며 약 3줄 내외의 길이로 정리해주세요.

지문 : {context}
대화내역 : {history}
질문: {question}
답변: 
"""

prompt = PromptTemplate(input_variables=["context", "question", "history"], template=template)

llm = ChatOpenAI(model='gpt-4o', temperature=0, openai_api_key=openai.api_key, max_tokens=400)

retriever = docsearch.as_retriever(search_kwargs=dict(k=1))

def initialize_chain():
    global qa_chain, memory
    # Initialize memory
    memory = ConversationBufferWindowMemory(k=3, memory_key="history", input_key="question")
    
    # Initialize LLMChain
    qa_chain = LLMChain(
        llm=llm,
        prompt=prompt,
        verbose=True,
        memory=memory
    )

# Initialize chain when the server starts
initialize_chain()

app = Flask(__name__)
CORS(app)

@app.route('/ask', methods=['POST'])
def ask_question():
    data = request.json
    question = data.get('question')
    passage = data.get('passage')
    
    if not question or not passage:
        return jsonify({'error': 'Both question and passage are required'}), 400
    
    print(f"Received question: {question}, passage: {passage}")
    
    try:
        # Use the retriever to get relevant context
        docs = retriever.get_relevant_documents(question)
        context = docs[0].page_content if docs else ""
        
        # Log the relevant documents
        print(f"Relevant documents: {docs}")
        
        # Get the response from the chain
        result = qa_chain.predict(question=question, context=passage + "\n" + context)
        
        print(f"Response from qa_chain: {result}")
        return jsonify({'answer': result, 'relevant_documents': [doc.page_content for doc in docs]})
    except Exception as e:
        print(f"Exception: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/times/record', methods=['POST'])
def record_time():
    data = request.get_json()
    user_id = data.get('userId')
    question_id = data.get('questionId')
    time_taken = data.get('timeTaken')
    
    # 여기서 데이터를 저장하거나 추가 로직을 수행할 수 있습니다.
    print(f"User {user_id} took {time_taken}ms to solve question {question_id}")
    
    return jsonify({'status': 'Time recorded successfully'})

@app.route('/analyze_time', methods=['POST'])
def analyze_time():
    data = request.get_json()
    time_taken = data['time_taken']
    
    feedback_prompt = f"""
    학생이 이 문제를 푸는 데 {time_taken // 1000}초가 걸렸습니다.
    학생에게 시간 관리 및 문제 풀이 전략에 대한 피드백을 주세요.
    보통 문제 당 풀이 시간은 3분 입니다.
    200자 이내로 해주셔야 합니다.
    """

    response =  client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": feedback_prompt}
        ],
        max_tokens=200,
        temperature=0.2
    )

    feedback = response.choices[0].message.content.strip()

    return jsonify({"feedback": feedback})
        
@app.route('/analyze', methods=['POST'])
def analyze_answers():
    data = request.json
    correct_answers = data.get('correctAnswers', [])
    incorrect_answers = data.get('incorrectAnswers', [])

    analysis_prompt = f"""
    맞은 문제 목록: {correct_answers}
    틀린 문제 목록: {incorrect_answers}
    위의 정보를 바탕으로 학생의 성적 분석 및 피드백을 200자 이내로 작성해주세요.
    문제 1~5는 문법 문제, 문제 6~12는 독해문제, 문제 13~20은 화법 문제, 문제 21~30은 작문 문제, 문제 31~45는 종합문제 입니다.
    필요한 경우 각 문제의 유형이나 영역에 대한 정보도 검색하여 반영해 주세요.
    """

    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": analysis_prompt}
            ],
            max_tokens=200,
            temperature=0.2
        )

        analysis = response.choices[0].message.content.strip()

        return jsonify({'analysis': analysis})
    except Exception as e:
        print(f"Exception: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/generate_summary', methods=['POST'])
def generate_summary():
    data = request.json
    analyses = data.get('analyses', [])

    summary_prompt = f"""
    다음은 한 학생의 성적 분석 내용입니다: {analyses}
    이 학생의 성적추이와 분석내용을 종합해 내용을 한 줄 요약을 작성해 주세요.
    """

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": summary_prompt}
            ],
            max_tokens=200,
            temperature=0.2
        )

        summary = response.choices[0].message.content.strip()

        return jsonify({'summary': summary})
    except Exception as e:
        print(f"Exception: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000)
