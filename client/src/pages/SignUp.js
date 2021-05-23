import React, { useState, useEffect, useRef, useCallback } from "react";
import styled from "styled-components";
import axios from "axios";

const SignUpStyle = styled.section`
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
    }

    #uid {
      margin-bottom: ${(props) =>
        props.error.uid__empty || props.error.uid__err ? "0px" : "20px"};
    }
    #unn {
      margin-bottom: ${(props) => (props.error.unn__empty ? "0px" : "20px")};
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

    .unn__empty {
      display: ${(props) => (props.error.unn__empty ? "block" : "none")};
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

    .upw__diff {
      display: ${(props) => (props.error.upw__diff ? "block" : "none")};
      color: red;
      padding-left: 16px;
      font-size: 0.8rem;
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

const errorMsg = {
  uid__empty: "아이디가 누락되었습니다",
  unn__empty: "닉네임이 누락되었습니다",
  upw__empty: "암호가 누락되었습니다",
  upw__diff: "암호와 일치하지 않습니다.",
  uid__err: "아이디가 이미 존재합니다",
  upw__err: "암호는 숫자,특수문자 포함하여 8자리 이상입니다",
};

const SignUp = ({ push }) => {
  const [user, setUser] = useState({
    uid: "",
    unn: "",
    upw: "",
    upw__check: "",
  });

  const [error, setError] = useState({
    uid__empty: false,
    unn__empty: false,
    upw__empty: false,
    upw__diff: false,
    uid__err: false,
    upw__err: false,
  });

  const uid = useRef();
  const unn = useRef();
  const upw = useRef();
  const upw__check = useRef();

  const onChangeHandler = (e) => {
    setUser({
      ...user,
      [e.target.id]: e.target.value,
    });

    if (e.target.id === "uid")
      setError({ ...error, uid__empty: false, uid__err: false });
    else if (e.target.id === "unn") setError({ ...error, unn__empty: false });
    else if (e.target.id === "upw") {
      if (e.target.value === user.upw)
        setError({
          ...error,
          upw__empty: false,
          upw__err: false,
          upw__diff: false,
        });
      else
        setError({
          ...error,
          upw__empty: false,
          upw__err: false,
          upw__diff: true,
        });
    } else if (e.target.id === "upw__check") {
      if (e.target.value === user.upw) setError({ ...error, upw__diff: false });
      else setError({ ...error, upw__diff: true });
    }

    if (e.key === "Enter") {
      signUpHandler();
    }
  };

  const errorHandler = () => {
    let errorCaused = [];
    let errorChanged = {};

    if (!user.uid) {
      errorChanged = { ...errorChanged, uid__empty: true };
      errorCaused.push(1);
    }
    if (!user.unn) {
      errorChanged = { ...errorChanged, unn__empty: true };
      errorCaused.push(2);
    }
    if (!user.upw) {
      errorChanged = { ...errorChanged, upw__empty: true };
      errorCaused.push(3);
    }
    if (!user.upw__check) {
      errorChanged = { ...errorChanged, upw__diff: true };
      errorCaused.push(4);
    }
    setError({ ...error, ...errorChanged });
    if (errorCaused.length !== 0) {
      if (errorCaused.includes(1)) uid.current.focus();
      else if (errorCaused.includes(2)) unn.current.focus();
      else if (errorCaused.includes(3)) upw.current.focus();
      else if (errorCaused.includes(4)) upw__check.current.focus();
      return false;
    }
    return true;
  };

  const signUpHandler = useCallback(async () => {
    if (errorHandler()) {
      const res = await axios.post("/auth/signUp", { ...user });
      if (res.data.success === 1) {
        alert("회원가입이 완료되었습니다.");
        push("/signIn");
      } else if (res.data.success === 2) {
        switch (res.data.code) {
          case 1:
            setError({ ...error, uid__err: true });
            break;
          case 2:
            setError({ ...error, upw__err: true });
        }
      }
    }
  }, [error]);

  const cancel = useCallback(() => {
    setUser({
      uid: "",
      unn: "",
      upw: "",
      upw__check: "",
    });
  }, []);

  return (
    <SignUpStyle error={error}>
      <div className="layout">
        <strong>회원가입.</strong>
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
          id="unn"
          ref={unn}
          onChange={onChangeHandler}
          value={user.unn}
          placeholder="닉네임"
        />
        <p className="unn__empty">{errorMsg.unn__empty}</p>
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
        <input
          id="upw__check"
          ref={upw__check}
          onChange={onChangeHandler}
          value={user.upw__check}
          placeholder="암호확인"
          type="password"
        />
        <p className="upw__diff">{errorMsg.upw__diff}</p>
        <div className="buttons">
          <button onClick={signUpHandler}>가입하기</button>
          <button onClick={cancel}>취소</button>
        </div>
      </div>
    </SignUpStyle>
  );
};

export default SignUp;
