import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const NavBarStyle = styled.nav`
  width: 100%;
  height: 60px;
  display: grid;
  grid-template-columns: 1fr 3fr 1fr;
  justify-content: space-around;
  align-items: center;
  background-color: white;
  position: fixed;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
  top: 0;
  left: 0;

  .title {
    font-family: Kcc !important;
    text-align: center;
    font-size: 2.5rem;
    font-weight: 600;
    color: rgba(241, 43, 69, 0.747);
    cursor: pointer;
    min-width: 200px;
  }

  .menu {
    display: flex;
    justify-self: center;
    justify-content: space-around;
    width: 70%;
  }

  .sign__in {
    justify-self: center;
    font-size: 1rem;
    transition: ease-in-out 400ms;
    width: 80px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    color: white;
    background-color: rgba(241, 43, 69, 0.747);
  }

  .sign__out {
    justify-self: center;
    font-size: 1rem;
    transition: 0.2s ease-in-out;
    width: 80px;
    height: 40px;
    border-radius: 10%;
    display: flex;
    justify-content: center;
    align-items: center;
    border: solid 0.1mm rgb(241, 43, 69);
    color: rgb(241, 43, 69);

    :hover {
      background-color: rgba(241, 43, 69, 0.747);
      color: white;
    }
  }

  //@media screen and (max-width: 620px) {
  //  .navbar {
  //    margin-top: 8px;
  //    padding: 8px 12px;
  //    flex-direction: column;
  //    align-items: flex-start;
  //  }
  //
  //  .navbar__menu {
  //    flex-direction: column;
  //    width: 100%;
  //    align-items: center;
  //    overflow: hidden;
  //  }
  //
  //  .navbar__menu div {
  //    width: 100%;
  //    text-align: center;
  //    padding: 8px 24px;
  //  }
  //  .navbar__signIn {
  //    width: 100%;
  //    text-align: center;
  //    border-radius: 1mm;
  //  }
  //}
`;

function NavBar() {
  const [isSignedIn, setIsSignedIn] = useState(false);

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
      <Link to="/" className="title">
        The Quiz Live
      </Link>
      <div className="menu">
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
      {isSignedIn ? (
        <Link onClick={onClickHandler} to="#" className="sign__out">
          로그아웃
        </Link>
      ) : (
        <Link to="/signIn" className="sign__in">
          로그인
        </Link>
      )}
    </NavBarStyle>
  );
}

export default NavBar;
