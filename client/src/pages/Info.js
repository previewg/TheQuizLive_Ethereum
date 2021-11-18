import React, {useEffect, useState} from "react";
import styled from "styled-components";
import axios from "axios";

const InfoStyle = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .layout {
    margin-top: 120px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    #balance {
      width: 40%;
      display: flex;
      align-items: center;
      box-shadow: 2px 2px 10px 1px rgba(0, 0, 0, 0.2);
      border-radius: 10px;
      background-color: rgba(241, 43, 69, 0.5);

      p {
        width: 50%;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 10px;
        margin: 0;
      }

      p:nth-child(1) {
        background-color: white;
        padding: 10px;
        box-shadow: 5px 0 10px 0 rgba(0, 0, 0, 0.2);
      }

      p:nth-child(2) {
        font-weight: bold;
        color: white;
      }
    }

    #history {
      margin-top: 50px;
      width: 60%;

      #history__title {
        font-size: 1.5rem;
      }
    }
  }
`;

const Info = (props) => {
    const [balance, setBalance] = useState(0)

    useEffect(async () => {
        const balanceReq = await axios.get("/quiz/check");
        if (balanceReq.data.success === 1) {
            setBalance(balanceReq.data.balance);
        }
        const historyReq = await axios.get("/quiz/history");
        if (balanceReq.data.success === 1) {
            setBalance(historyReq.data.balance);
        }
    }, [])

    return (
        <InfoStyle>
            <div className="layout">
                <div id="balance">
                    <p>보유 토큰</p>
                    <p>{balance}</p>
                </div>
                <div id="history">
                    <p id="history__title">참여 기록</p>
                </div>
            </div>
        </InfoStyle>
    );
};

export default Info;
