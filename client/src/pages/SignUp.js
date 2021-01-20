import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

const SignUpStyle = styled.section`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  .layout {
    width: 20%;

    p {
      margin-bottom: 10px;
    }

    strong {
      color: rgb(241, 43, 69);
    }

    input {
      width: 100%;
      height: 40px;
      border: none;
      border-bottom: 0.1px solid lightgray;
      padding: 0;
      margin-bottom: 25px;
      transition: all 0.3s ease-in-out;
    }

    .id__input {
      width: 100%;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;

      input {
        width: 70%;
      }

      button {
        cursor: pointer;
        width: 80px;
        height: 40px;
        background: none;
        color: rgb(241, 43, 69);
        border: solid 0.1px rgb(241, 43, 69);
        border-radius: 5px;
      }
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
  "이메일을 입력 바랍니다",
  "비밀번호를 입력 바랍니다",
  "아이디 혹은 비밀번호가 일치하지 않습니다",
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
        <p>
          <strong>▶ </strong>아이디
        </p>
        <div className="id__input">
          <input
            id="id"
            onChange={onChangeHandler}
            value={user.id}
            placeholder="아이디를 입력하세요"
          />
          <button>중복확인</button>
        </div>
        <p>
          <strong>▶ </strong>비밀번호<span id="true">일치</span>
          <span id="false">불일치</span>
        </p>
        <input
          id="password"
          onChange={onChangeHandler}
          value={user.password}
          placeholder="비밀번호를 입력하세요"
          type="password"
        />
        <p>
          <strong>▶ </strong>비밀번호확인<span id="true">일치</span>
          <span id="false">불일치</span>
        </p>
        <input
          id="passwordCheck"
          onChange={onChangeHandler}
          value={user.passwordCheck}
          placeholder="비밀번호를 다시 한 번 입력하세요"
          type="password"
        />
        <div className="buttons">
          <button>가입하기</button>
          <button onClick={cancel}>취소</button>
        </div>
      </div>
    </SignUpStyle>
  );
};

export default SignUp;
