import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

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

    #id {
      border: 0.1px solid
        ${(props) =>
          props.errorCode == 1 || props.errorCode == 2
            ? "rgb(241, 43, 69)"
            : "lightgray"};
      ::placeholder {
        color: ${(props) =>
          props.errorCode == 1 || props.errorCode == 2
            ? "rgb(241, 43, 69)"
            : "gray"};
      }
    }

    #pw {
      border: 0.1px solid
        ${(props) =>
          props.errorCode == 1 || props.errorCode == 3
            ? "rgb(241, 43, 69)"
            : "lightgray"};
      ::placeholder {
        color: ${(props) =>
          props.errorCode == 1 || props.errorCode == 3
            ? "rgb(241, 43, 69)"
            : "gray"};
      }
    }

    .id__err {
      visibility: ${(props) =>
        props.errorCode == 1 || props.errorCode == 2 ? "visible" : "hidden"};
      color: red;
      padding-left: 16px;
      font-size: 0.8rem;
    }

    .pw__err {
      visibility: ${(props) =>
        props.errorCode == 1 || props.errorCode == 3 ? "visible" : "hidden"};
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

const errorMsg = [
  "",
  "아이디가 누락되었습니다",
  "암호가 누락되었습니다",
  "아이디 혹은 비밀번호가 일치하지 않습니다",
];

const SignIn = (props) => {
  const [user, setUser] = useState({
    id: "",
    pw: "",
  });

  const id = useRef();
  const pw = useRef();

  const [errorCode, setErrorCode] = useState(0);

  const onChangeHandler = (e) => {
    setUser({
      ...user,
      [e.target.id]: e.target.value,
    });
    if (errorCode === 1) {
      if (e.target.id === "id") setErrorCode(3);
      else setErrorCode(2);
    } else if (errorCode === 2) {
      if (e.target.id === "id") setErrorCode(0);
    } else {
      if (e.target.id === "pw") setErrorCode(0);
    }
    if (e.key === "Enter") {
      signInHandler();
    }
  };

  const errorHandler = () => {
    if (!user.id && !user.pw) {
      setErrorCode(1);
      id.current.focus();
    } else if (!user.id) {
      setErrorCode(2);
      id.current.focus();
      return false;
    } else if (!user.pw) {
      setErrorCode(3);
      pw.current.focus();
      return false;
    }
    return true;
  };

  const signInHandler = () => {
    if (errorHandler()) {
    }
  };

  return (
    <SignInStyle errorCode={errorCode}>
      <div className="layout">
        <strong>로그인.</strong>
        <input
          id="id"
          ref={id}
          onChange={onChangeHandler}
          value={user.id}
          placeholder="아이디"
        />
        <p className="id__err">{errorMsg[1]}</p>
        <input
          id="pw"
          ref={pw}
          onChange={onChangeHandler}
          value={user.pw}
          placeholder="암호"
          type="password"
        />
        <p className="pw__err">{errorMsg[2]}</p>
        <button onClick={signInHandler}>로그인</button>
        <Link to="/signUp" className="suggestion">
          아이디가 없으신가요?<span> 지금 생성.</span>
        </Link>
      </div>
    </SignInStyle>
  );
};

export default SignIn;
