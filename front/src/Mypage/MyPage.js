import '../css/MyPage.css';
import {
  AiOutlineUser,
  AiOutlineUnorderedList,
  AiOutlineShopping,
  AiOutlineLike,
  AiOutlineComment,
  AiOutlineStar,
  AiOutlineQuestionCircle,
} from 'react-icons/ai';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { GrNote } from 'react-icons/gr';
import { Cookies } from 'react-cookie';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function MyPage() {
  //유저 확인용
  const [checkusername, setcheckusername] = useState('');
  const cookies = new Cookies();
  const jwtToken = cookies.get('jwtToken');

  //페이지 이동(새로고침x)
  const movePage = useNavigate();

  const onClickMyPageBoard = () => {
    movePage(`/MyPage/Board`);
  };

  useEffect(() => {
    if (jwtToken) {
      axios
        .get(`http://localhost:8080/Get/Username`, {
          headers: {
            Authorization: jwtToken,
          },
        })
        .then((response) => {
          setcheckusername(response.data);
        })
        .catch((error) => {
          console.error(error);
          setcheckusername('');
        });
    } else {
      setcheckusername('');
    }
  }, []);

  return (
    <div className="MainMyPage">
      <div className="MyPageProfilepic">
        <div className="MyPageProfileCircle">
          <div className="MyPageProfileCircle2">
            <AiOutlineUser size={40} />
          </div>
        </div>
      </div>
      <div className="MyPageProfilename">
        <div className="Profiledetail">
          <div></div>
          <div className="Profilename">
            <span>{checkusername} 님</span>
          </div>

          <div className="Profilechange">
            <span>회원정보변경</span>
          </div>
          <div className="arrow">
            <MdKeyboardArrowRight size={20} color="#0d6efd" />
          </div>
        </div>
      </div>
      <div className="MyPageblankspace"></div>
      <div className="MyPagefunction">
        <div className="MyPageOrder">
          <a className="MyPageIcon">
            <div className="Iconfont">
              <AiOutlineUnorderedList size={20} color="black" />
            </div>
            <div className="Orderdetail">
              <span>주문목록</span>
            </div>
            <div className="arrow">
              <MdKeyboardArrowRight size={20} />
            </div>
          </a>
        </div>
        <div className="MyPageWishList">
          <a className="MyPageIcon">
            <div className="Iconfont">
              <AiOutlineShopping size={20} color="black" />
            </div>
            <div className="Orderdetail">
              <span>장바구니</span>
            </div>
            <div className="arrow">
              <MdKeyboardArrowRight size={20} />
            </div>
          </a>
        </div>
        <div className="MyPageBoardlink">
          <a className="MyPageIcon" href="/MyPage/Board">
            <div className="Iconfont">
              <GrNote size={20} color="black" />
            </div>
            <div className="Orderdetail">
              <span>내가 작성한 게시글</span>
            </div>
            <div className="arrow">
              <MdKeyboardArrowRight size={20} />
            </div>
          </a>
        </div>
        <div className="MyPageComment">
          <a className="MyPageIcon" href="/MyPage/Comment">
            <div className="Iconfont">
              <AiOutlineComment size={20} color="black" />
            </div>
            <div className="Orderdetail">
              <span>내가 작성한 댓글</span>
            </div>
            <div className="arrow">
              <MdKeyboardArrowRight size={20} />
            </div>
          </a>
        </div>
        <div className="MyPageLike">
          <a className="MyPageIcon" href="/MyPage/Like">
            <div className="Iconfont">
              <AiOutlineLike size={20} color="black" />
            </div>
            <div className="Orderdetail">
              <span>좋아요</span>
            </div>
            <div className="arrow">
              <MdKeyboardArrowRight size={20} />
            </div>
          </a>
        </div>
        <div className="MyPageReview">
          <a className="MyPageIcon">
            <div className="Iconfont">
              <AiOutlineStar size={20} color="black" />
            </div>
            <div className="Orderdetail">
              <span>리뷰 작성 목록</span>
            </div>
            <div className="arrow">
              <MdKeyboardArrowRight size={20} />
            </div>
          </a>
        </div>
        <div className="MyPageReview">
          <a className="MyPageIcon">
            <div className="Iconfont">
              <AiOutlineQuestionCircle size={20} color="black" />
            </div>
            <div className="Orderdetail">
              <span>고객센터</span>
            </div>
            <div className="arrow">
              <MdKeyboardArrowRight size={20} />
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}

export default MyPage;
