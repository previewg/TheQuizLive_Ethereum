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

      #history__table {
        padding: 0;

        li {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1fr;
          list-style: none;

          .pending {
            color: rgba(0, 0, 0, 0.5);
          }

          p,strong {
            display: flex;
            justify-content: center;
            align-items: center;
          }

          p:nth-child(1) {
            padding-left: 5px;
            justify-self: flex-start;
          }
        }

        li:nth-child(1) {
          border-bottom: solid 1px rgba(241, 43, 69, 0.5);
        }

      }
    }
  }
`;
const Correct = styled.strong`
    color:${(props) => (props.correct ? '#3c98f6' : 'red')};
`

const getCreatedTime = (date) => {
    let givenDate = new Date(Date.parse(date))
    return givenDate.getMonth() + 1 + '월 ' + givenDate.getDate() + '일'
};

const Info = (props) => {
    const [balance, setBalance] = useState(0)
    const [history, setHistory] = useState([])

    useEffect(() => {
        async function check() {
            const balanceReq = await axios.get("/quiz/check");
            if (balanceReq.data.success === 1) {
                setBalance(balanceReq.data.balance);
            }
            const historyReq = await axios.get("/quiz/history");
            if (balanceReq.data.success === 1) {
                setHistory(historyReq.data.history);
                console.log(historyReq.data.history)
            }
        };
        check();

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
                    <ul id="history__table">
                        <li>
                            <p>날짜</p>
                            <p>정답유무</p>
                            <p>정답자</p>
                            <p>보상</p>
                        </li>
                        {history.map((data, key) => {
                            if (!data.total){
                                return (
                                    <li key={key}>
                                        <p>{getCreatedTime(data.createdAt)}</p>
                                        <p>{data.correct ? '정답' : '오답'}</p>
                                        <p className='pending'>진행중</p>
                                        <p className='pending'>진행중</p>
                                    </li>
                                )
                            }else{
                                return (
                                    <li key={key}>
                                        <p>{getCreatedTime(data.createdAt)}</p>
                                        <Correct correct={data.correct}>{data.correct ? '정답' : '오답'}</Correct>
                                        <p>{data.totalCorrect}/{data.total}</p>
                                        <Correct correct={data.correct}>{data.reward}</Correct>
                                    </li>
                                )
                            }
                        })}
                    </ul>
                </div>
            </div>
        </InfoStyle>
    );
};

export default Info;
