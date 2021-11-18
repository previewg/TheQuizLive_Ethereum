import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { signOutSuccess, signOutFailure } from "../../actions/auth";

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
  z-index: 1;

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
    display: flex;
    #username {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100px;
    }
    .sign__out__btn {
      justify-self: center;
      cursor: pointer;
      background: none;
      font-size: 1rem;
      transition: 0.2s ease-in-out;
      width: 80px;
      height: 40px;
      border-radius: 5px;
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
  const dispatch = useDispatch();
  const isSignedIn = useSelector((state) => state.auth.status.signIn);
  const unn = useSelector((state) => state.auth.user.unn);

  const signOutHandler = async (e) => {
    const res = await axios.post("/auth/signOut");
    if (res.data.success === 1) dispatch(signOutSuccess());
    else if (res.data.success === 2) dispatch(signOutFailure());
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
      {isSignedIn === "SUCCESS" ? (
        <div className="sign__out">
          <span id="username">{unn}님</span>
          <button onClick={signOutHandler} className="sign__out__btn">
            로그아웃
          </button>
        </div>
      ) : (
        <Link to="/signIn" className="sign__in">
          로그인
        </Link>
      )}
    </NavBarStyle>
  );
}

export default NavBar;
