import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const NavBarStyle = styled.nav`
  .navbar {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    padding: 20px;
    background-color: white;
    position: sticky;
    top: 0;
    border-bottom: solid 0.2mm gray;
  }
  .navbar__title {
    font-size: 35px;
    background: -webkit-linear-gradient(180deg, #fcb5b5, rgb(241, 43, 69));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .navbar__menu {
    display: flex;
    justify-content: space-around;
    width: 70%;
    padding-left: 0;
  }
  .navbar__menu div {
    text-decoration: none;
    padding: 8px;
    font-size: 20px;
    transition: ease-in-out 250ms;
  }
  .navbar__menu div a {
    color: black;
  }

  .navbar__menu div:hover {
    transform: scale(1.3);
  }

  .navbar__signIn {
    font-size: 20px;
    transition: ease-in-out 400ms;
    width: 80px;
    height: 40px;
    border-radius: 10%;
    display: flex;
    justify-content: center;
    align-items: center;
    border: solid 0.1mm rgb(241, 43, 69);
    color: rgb(241, 43, 69);
  }

  .navbar__signIn:hover {
    background-color: rgba(241, 43, 69, 0.747);
    color: white;
  }

  .curtime {
    background-color: white;
    width: 100%;
    display: flex;
    justify-content: center;
    font-size: 30px;
    position: fixed;
    top: 20px;
    padding: 20px;
  }

  @media screen and (max-width: 620px) {
    .navbar {
      margin-top: 8px;
      padding: 8px 12px;
      flex-direction: column;
      align-items: flex-start;
    }

    .navbar__menu {
      flex-direction: column;
      width: 100%;
      align-items: center;
      overflow: hidden;
    }

    .navbar__menu div {
      width: 100%;
      text-align: center;
      padding: 8px 24px;
    }
    .navbar__signIn {
      width: 100%;
      text-align: center;
      border-radius: 1mm;
    }
  }
`;

function NavBar() {
  const [isSigned, setIsSigned] = useState(false);

  const onClickHandler = (e) => {
    e.preventDefault();
    // dispatch(signOut()).then((response) => {
    //   if (response.payload.success) {
    //     setIsSigned(false);
    //     document.cookie =
    //       "x_auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    //     alert("로그아웃이 완료되었습니다.");
    //   } else {
    //     alert("로그아웃에 실패했습니다");
    //   }
    // });
  };

  return (
    <NavBarStyle>
      <div className="navbar__logo">
        <Link to="/" className="navbar__title">
          The Live Quiz
        </Link>
      </div>
      <div className="navbar__menu">
        <div>
          <Link to="/">HOME</Link>
        </div>
        <div>
          <Link to="/about"> ABOUT</Link>
        </div>
        <div>
          <Link to="/info"> INFO</Link>
        </div>
      </div>
      <Link to="/signIn" className="navbar__signIn">
        SignIn
      </Link>

      <Link onClick={onClickHandler} to="#" className="navbar__signIn">
        SignOut
      </Link>
    </NavBarStyle>
  );
}

export default NavBar;
