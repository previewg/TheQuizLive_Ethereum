import { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { useDispatch } from "react-redux";
import {
  balanceCheckFailure,
  balanceCheckSuccess,
  entranceFeeFailure,
  entranceFeeSuccess,
} from "actions/quiz";

const BalanceCheckStyle = styled.section`
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
    align-items: center;
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
    #balance {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 65%;
      p {
        font-size: 2rem;
      }
    }

    #start__btn {
      width: 70%;
      height: 50px;
      margin: 20px;
      background: none;
      color: rgb(241, 43, 69);
      border: rgb(241, 43, 69) 0.1px solid;
      border-radius: 5px;
      cursor: pointer;
      font-size: 1.2rem;
      font-weight: bolder;
    }
  }
`;

const BalanceCheck = ({ setOpen, ...props }) => {
  const dispatch = useDispatch();
  const [balance, setBalance] = useState(0);

  const pay = async () => {
    const res = await axios.post("/quiz/pay");
    if (res.data.success === 1) {
      dispatch(entranceFeeSuccess());
      props.history.push("/quiz");
    } else dispatch(entranceFeeFailure());
  };

  useEffect(async () => {
    const res = await axios.get("/quiz/check");
    if (res.data.success === 1) {
      setBalance(res.data.balance);
      dispatch(balanceCheckSuccess());
    } else dispatch(balanceCheckFailure());
  }, []);

  return (
    <BalanceCheckStyle>
      <div className="container">
        <button id="close__btn" onClick={() => setOpen(false)}>
          닫기
        </button>
        <div id="balance">
          <p>현재 보유 토큰</p>
          <p>{balance}</p>
        </div>
        <p id="caution">
          🔥도전시, <strong>10토큰</strong>이 소모됩니다🔥
        </p>
        <button id="start__btn" onClick={pay}>
          도전
        </button>
      </div>
    </BalanceCheckStyle>
  );
};

export default BalanceCheck;
