import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

const SignUpStyle = styled.section`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  .layout {
    width: 400px;

    p {
      margin-bottom: 10px;
    }

    input {
      width: 368px;
      height: 56px;
      font-size: 1rem;
      border: 0.1px solid lightgray;
      border-radius: 10px;
      padding-left: 16px;
      padding-right: 16px;
      outline-color: rgba(241, 43, 69, 0.5);
    }

    #true {
      margin-left: 20px;
      font-size: 0.9rem;
      display: ${(props) =>
        props.password && props.password === props.passwordCheck
          ? "inline-block"
          : "none"};
      color: #01a6ff;
    }

    #false {
      margin-left: 20px;
      font-size: 0.9rem;
      display: ${(props) =>
        props.password &&
        props.passwordCheck &&
        props.password !== props.passwordCheck
          ? "inline-block"
          : "none"};
      color: red;
    }

    .buttons {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 50px;

      button {
        width: 45%;
        height: 45px;
        font-size: 1rem;
        background-color: rgba(241, 43, 69, 0.5);
        border: none;
        border-radius: 5px;
        color: white;
        cursor: pointer;
      }
    }
  }
`;

const errorMsg = [
  "",
  "아이디가 누락되었습니다",
  "암호가 누락되었습니다",
  "아이디가 이미 존재합니다",
  "암호는 특수문자 포함, 8자리 이상입니다",
  "암호와 일치하지 않습니다.",
];

const SignUp = (props) => {
  const [user, setUser] = useState({
    id: "",
    password: "",
    passwordCheck: "",
  });

  const id = useRef();
  const password = useRef();
  const passwordCheck = useRef();

  const [errorCode, setErrorCode] = useState(0);

  const onChangeHandler = (e) => {
    setUser({
      ...user,
      [e.target.id]: e.target.value,
    });
    setErrorCode(0);
    if (e.key === "Enter") {
      signInHandler();
    }
  };

  const errorHandler = () => () => {
    if (!user.id) {
      setErrorCode(1);
      id.current.focus();
      return false;
    } else if (!user.password) {
      setErrorCode(2);
      password.current.focus();
      return false;
    } else if (!user.passwordCheck) {
      setErrorCode(3);
      passwordCheck.current.focus();
      return false;
    }
    return true;
  };

  const signInHandler = () => {
    if (errorHandler) {
    }
  };

  const cancel = () => {
    setUser({
      id: "",
      password: "",
      passwordCheck: "",
    });
  };

  return (
    <SignUpStyle password={user.password} passwordCheck={user.passwordCheck}>
      <div className="layout">
        <input
          id="id"
          onChange={onChangeHandler}
          value={user.id}
          placeholder="아이디"
        />
        <p className="id__err">{errorMsg[1]}</p>
        <input
          id="password"
          onChange={onChangeHandler}
          value={user.password}
          placeholder="암호"
          type="password"
        />
        <p className="pw__err">{errorMsg[2]}</p>
        <input
          id="passwordCheck"
          onChange={onChangeHandler}
          value={user.passwordCheck}
          placeholder="암호확인"
          type="password"
        />
        <p className="pwCheck__err">{errorMsg[3]}</p>
        <div className="buttons">
          <button>가입하기</button>
          <button onClick={cancel}>취소</button>
        </div>
      </div>
    </SignUpStyle>
  );
};

export default SignUp;
