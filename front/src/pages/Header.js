import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/Header.css';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import lpimage from '../images/Believe-in-Yourself.jpg';
import { useState, useEffect } from 'react';
import { Cookies } from 'react-cookie';

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const cookies = new Cookies();
  const jwtToken = cookies.get('jwtToken');

  useEffect(() => {
    if (jwtToken) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [jwtToken, isLoggedIn]);

  const handleClick = (e) => {
    console.log(jwtToken);
    console.log(isLoggedIn);
  };

  const onLogout = (e) => {
    cookies.remove('jwtToken');
    window.location.reload();
  };

  return (
    <Navbar bg="light" expand="lg">
      <Container fluid>
        <Navbar.Brand href="/home">DiscoLP</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
            <Nav.Link href="#action2">Link</Nav.Link>
            <NavDropdown title="게시판" id="navbarScrollingDropdown">
              <NavDropdown.Item href="/Board?page=1">
                자유게시판
              </NavDropdown.Item>
              <NavDropdown.Item href="#action4">칼럼</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action5">
                Something else here
              </NavDropdown.Item>
            </NavDropdown>
            <Nav.Link href="#" disabled>
              Link
            </Nav.Link>
          </Nav>

          {!isLoggedIn ? (
            <div className="userfunction">
              <Nav.Link className="login" href="/login">
                로그인
              </Nav.Link>
              <Nav.Link className="register" href="/Register">
                회원가입
              </Nav.Link>
            </div>
          ) : (
            <div className="userfunction">
              <Nav.Link className="login" href="/MyPage">
                마이페이지
              </Nav.Link>
              <Nav className="logout" onClick={onLogout}>
                로그아웃
              </Nav>
            </div>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
