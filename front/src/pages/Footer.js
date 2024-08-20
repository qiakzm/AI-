import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaTwitter, FaFacebookF } from 'react-icons/fa';
import '../css/Footer.css';

function Footerpage() {
  return (
    <div className="main">
      <footer className="mainfooter">
        <nav className="footernav">
          <div className="firstdiv">
            <h2>
              <Link className="Linkpage" to="/home">
                DiscoLP
              </Link>
            </h2>
          </div>
          <div className="seconddiv">
            <dl className="firstdl">
              <dt>회사</dt>
              <a className="check">상세정보</a>
              <a className="check">채용정보</a>
              <a className="check">안내</a>
            </dl>
            <dl className="firstdl">
              <dt>커뮤니티</dt>
              <a className="check">아티스트</a>
              <a className="check">개발자</a>
              <a className="check">투자자</a>
              <a className="check">공급업체</a>
            </dl>
            <dl className="thirddl">
              <dt>유용한 링크</dt>
              <a className="check">공지사황</a>
              <a className="check">이용약관</a>
            </dl>
          </div>
          <div className="thirddiv">
            <ul className="thirdul">
              <li className="circle">
                <span className="circlespan">
                  <FaInstagram className="icon" size="27" />
                </span>
              </li>
              <li className="circle">
                <span className="circlespan">
                  <FaTwitter className="icon" size="27" />
                </span>
              </li>
              <li className="circle">
                <span className="circlespan">
                  <FaFacebookF className="icon" size="27" />
                </span>
              </li>
            </ul>
          </div>
          <div className="fourthdiv"></div>
          <div className="fifthdiv">
            <ul className="fifthul">
              <a>법률정보</a>
              <a>개인정보 보호 센터</a>
              <a>개인정보 처리방침</a>
            </ul>
            <span className="fifthspan">© 2023 DiscoLP</span>
          </div>
        </nav>
      </footer>
    </div>
  );
}

export default Footerpage;
