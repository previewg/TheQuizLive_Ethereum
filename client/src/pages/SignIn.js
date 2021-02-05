import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { signInFailure, signInSuccess } from "../actions/auth";

const SignInStyle = styled.section`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  .layout {
    width: 400px;

    strong {
      display: block;
      font-size: 2rem;
      margin-bottom: 60px;
    }

    input {
      width: 368px;
      height: 56px;
      font-size: 1rem;
      border: 0.1px solid lightgray;
      border-radius: 10px;
      padding-left: 16px;
      padding-right: 16px;
    }

    #uid {
      margin-bottom: ${(props) =>
        props.error.uid__empty || props.error.uid__err ? "0px" : "20px"};
    }
    #upw {
      margin-bottom: ${(props) =>
        props.error.upw__empty || props.error.upw__err ? "0px" : "20px"};
    }

    .uid__empty {
      display: ${(props) => (props.error.uid__empty ? "block" : "none")};
      color: red;
      padding-left: 16px;
      font-size: 0.8rem;
    }

    .uid__err {
      display: ${(props) => (props.error.uid__err ? "block" : "none")};
      color: red;
      padding-left: 16px;
      font-size: 0.8rem;
    }

    .upw__empty {
      display: ${(props) => (props.error.upw__empty ? "block" : "none")};
      color: red;
      padding-left: 16px;
      font-size: 0.8rem;
    }

    .upw__err {
      display: ${(props) => (props.error.upw__err ? "block" : "none")};
      color: red;
      padding-left: 16px;
      font-size: 0.8rem;
    }

    button {
      width: 100%;
      height: 60px;
      font-size: 1rem;
      background-color: rgba(241, 43, 69, 0.5);
      border: none;
      border-radius: 5px;
      color: white;
      cursor: pointer;
      margin-top: 30px;
    }

    .suggestion {
      margin-top: 20px;
      height: 60px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: gray;
      span {
        color: rgb(241, 43, 69);
      }
    }
  }
`;

const errorMsg = {
  uid__empty: "아이디가 누락되었습니다",
  upw__empty: "암호가 누락되었습니다",
  uid__err: "아이디가 존재하지 않습니다",
  upw__err: "암호가 일치하지 않습니다",
};

const SignIn = ({ push }) => {
  const [user, setUser] = useState({
    uid: "",
    upw: "",
  });

  const [error, setError] = useState({
    uid__empty: false,
    upw__empty: false,
    uid__err: false,
    upw__err: false,
  });

  const uid = useRef();
  const upw = useRef();

  const dispatch = useDispatch();

  const onChangeHandler = (e) => {
    setUser({
      ...user,
      [e.target.id]: e.target.value,
    });

    if (e.target.id === "uid")
      setError({ ...error, uid__empty: false, uid__err: false });
    else {
      setError({
        ...error,
        upw__empty: false,
        upw__err: false,
      });
    }

    if (e.key === "Enter") {
      signInHandler();
    }
  };

  const errorHandler = () => {
    let errorCaused = [];
    let errorChanged = {};

    if (!user.uid) {
      errorChanged = { ...errorChanged, uid__empty: true };
      errorCaused.push(1);
    }

    if (!user.upw) {
      errorChanged = { ...errorChanged, upw__empty: true };
      errorCaused.push(2);
    }

    setError({ ...error, ...errorChanged });
    if (errorCaused.length !== 0) {
      if (errorCaused.includes(1)) uid.current.focus();
      else if (errorCaused.includes(2)) upw.current.focus();
      return false;
    }
    return true;
  };

  const signInHandler = async () => {
    if (errorHandler()) {
      const res = await axios.post("/auth/signIn", { ...user });
      if (res.data.success === 1) {
        dispatch(signInSuccess(res.data));
        push("/");
      } else if (res.data.success === 3) {
        if (res.data.code === 1) {
          setError({
            ...error,
            uid__err: true,
          });
        } else {
          setError({
            ...error,
            upw__err: true,
          });
        }
        dispatch(signInFailure());
      }
    }
  };
  return (
    <SignInStyle error={error}>
      <div className="layout">
        <strong>로그인.</strong>
        <input
          id="uid"
          ref={uid}
          onChange={onChangeHandler}
          value={user.uid}
          placeholder="아이디"
        />
        <p className="uid__empty">{errorMsg.uid__empty}</p>
        <p className="uid__err">{errorMsg.uid__err}</p>
        <input
          id="upw"
          ref={upw}
          onChange={onChangeHandler}
          value={user.upw}
          placeholder="암호"
          type="password"
        />
        <p className="upw__empty">{errorMsg.upw__empty}</p>
        <p className="upw__err">{errorMsg.upw__err}</p>
        <button onClick={signInHandler}>로그인</button>
        <Link to="/signUp" className="suggestion">
          아이디가 없으신가요?<span> 지금 생성.</span>
        </Link>
      </div>
    </SignInStyle>
  );
};

export default SignIn;
