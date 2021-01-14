import React, { useState, useEffect } from "react";
import styled from "styled-components";

const HomeStyle = styled.section`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .time {
    text-align: center;
    width: 100%;
    .title {
      font-size: 2rem;
    }
    .now {
      font-size: 5rem;
    }
  }

  .question__btn {
    width: 400px;
    height: 50px;
    border: none;
    font-size: 1.5rem;
    cursor: ${(props) => (props.isvalid ? "pointer" : "not-allowed")};
  }
`;

const Home = (props) => {
  const [dDay, setDDay] = useState(new Date("2021/01/14/16:12:40"));
  const [date, setDate] = useState({
    hours: "0",
    minutes: "0",
    seconds: "0",
    isValid: false,
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      let amount = Math.floor((dDay.getTime() - now.getTime()) / 1000);
      let _hours = Math.floor(amount / 3600);
      _hours = _hours < 10 ? "0" + _hours : _hours;
      let _minutes = Math.floor(amount / 60) % 60;
      _minutes = _minutes < 10 ? "0" + _minutes : _minutes;
      let _seconds = Math.floor(amount % 60);
      _seconds = _seconds < 10 ? "0" + _seconds : _seconds;
      if (amount <= 0) {
        setDate({
          hours: "00",
          minutes: "00",
          seconds: "00",
          isValid: true,
        });
      } else {
        setDate({
          ...{ date },
          hours: _hours,
          minutes: _minutes,
          seconds: _seconds,
        });
      }
    }, 1000);
    return () => clearInterval(intervalId);
  }, [date]);

  return (
    <HomeStyle valid={date.isValid}>
      {!date.isValid ? (
        <div className="time">
          <p className="time title">다음 퀴즈까지</p>
          <p className="time now">
            {date.hours}:{date.minutes}:{date.seconds}
          </p>
          <button className="question__btn" disabled={true}>
            기다려 주세요!
          </button>
        </div>
      ) : (
        <div className="time">
          <p className="time title">지금 바로 참여하세요!</p>
          <button
            className="question__btn"
            onClick={() => props.history.push("/quiz/random")}
          >
            퀴즈풀기!
          </button>
        </div>
      )}

      <p style={{ marginTop: "100px", fontSize: "20px" }}>
        🤔정답 제출 시, 10토큰이 차감되니 신중하게 선택해주세요!🥰
      </p>
    </HomeStyle>
  );
};

export default Home;
