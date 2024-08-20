import { useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import '../css/Home.css';
import Button from 'react-bootstrap/Button';

function Home() {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  return (
    <div className="carouselbottom">
      <Carousel
        activeIndex={index}
        onSelect={handleSelect}
        slide={false}
        pause={'hover'}
        interval={80000}
      >
        <Carousel.Item>
          <img className="first" src="/20230216034059.jpg" alt="First slide" />
          <Carousel.Caption>
            <h3 className="title">나일 호란 3집 The Show</h3>
            <p>6월 9일 발매</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="first"
            src="/FskH1edWAAo3maQ.jpg"
            alt="Second slide"
          />

          <Carousel.Caption>
            <h3 className="title">Lavender Haze 어쿠스틱 버전 발매!</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="first"
            src="/crimson-rosella-g81cd8f0b5_1280.jpg"
            alt="Third slide"
          />

          <Carousel.Caption>
            <h3 className="title">귀여운 앵무새 한번 넣어봤음</h3>
            <p>귀엽징</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
      <div className="outercontainer">
        <div className="innercontainer">
          <div className="blankspace"></div>
          <h2 className="discoverh2">More Ways to Discover</h2>
          <div className="blankspace-2"></div>
          <div className="column">
            <div className="columndetail">
              <div>
                <img src="/interior.jpg"></img>
              </div>
              <div className="blankspace-2"></div>
              <h3>Stories</h3>
              <p className="detail">
                Find out more about the impact of brick-and-mortar shops on
                vinyl culture.
              </p>
              <div></div>
            </div>
            <div className="columndetail">
              <div className="imagedetail">
                <img src="/vinyl.jpg"></img>
              </div>
              <div className="blankspace-2"></div>
              <h3>City Guides</h3>
              <p className="detail">
                Take a stroll through curated lists of exceptional record stores
                around the world.
              </p>
              <div></div>
            </div>
            <div className="columndetail">
              <div>
                <img src="/audio.jpg"></img>
              </div>
              <div className="blankspace-2"></div>
              <h3>Music Discovery</h3>
              <p className="detail">
                Listen to music recommended by stores and based on your favorite
                albums.
              </p>
              <div></div>
            </div>
          </div>
        </div>
      </div>
      <div className="Lpbuy">
        <img className="lpbuypic" src="/lpbuy.jpg"></img>
        <div className="lpdiv">
          <div className="innerlpdiv">
            <div className="blankspace"></div>
            <h2 className="innerlph2">LP 구매하기</h2>
            <p className="innerlpp">
              DiscoLP Marketplace를 사용하면 온라인으로 LP를 더 쉽게 구매할수
              있습니다. 인증된 독립 레코드를 가진 판매자는 온라인 상점을 실제
              레코드 저장소에 연결할 수 있습니다. <br />
              굉장히 멀리 떨어 져있어도 쉽게 찾을수 있습니다
            </p>
            <div>
              <button className="tradebutton">Market 으로 이동</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
