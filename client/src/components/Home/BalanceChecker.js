import { useState } from "react";
import styled from "styled-components";

const BalanceCheckerStyle = styled.section`
  position: fixed;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 10;
  .container {
    display: flex;
    flex-direction: column;
    background-color: white;
    width: 400px;
    height: 550px;
    #close__btn {
      align-self: flex-end;
      width: 50px;
      height: 30px;
      background: none;
      font-weight: bold;
      color: rgb(241, 43, 69);
      border: none;
      cursor: pointer;
    }
  }
`;

const BalanceChecker = () => {
  const [open, setOpen] = useState(true);

  return (
    <BalanceCheckerStyle>
      <div className="container">
        <button id="close__btn" onClick={() => setOpen(false)}>
          닫기
        </button>
        <div id="balance">
          <p>현재 보유 토큰</p>
          <p>120</p>
        </div>
        <div id=""></div>
      </div>
    </BalanceCheckerStyle>
  );
};

export default BalanceChecker;
