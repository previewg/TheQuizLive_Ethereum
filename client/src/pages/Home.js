import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {BalanceCheck} from "components";
import styled from "styled-components";

const HomeStyle = styled.section`
  width: 100%;
  height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  justify-content: center;
  align-items: center;

  .live__img {
    width: 100%;
    height: 100%;
    background-position: center;
    background-repeat: no-repeat;
    background-size: 80%;
    z-index: ${(props) => (props.isValid ? 0 : -1)};
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.3);
  }

  .time {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;

    .title {
      font-size: 2rem;
    }

    .now {
      margin-top: 20px;
      font-size: 5rem;
    }

    .question__btn {
      width: 300px;
      height: 50px;
      color: ${(props) => (props.isValid ? "white" : "lightgray")};
      border: 0.1px lightgray solid;
      border-radius: 5px;
      background: ${(props) =>
              props.isValid ? "rgba(241, 43, 69, 0.747)" : "transparent"};
      font-size: 1.5rem;
      cursor: ${(props) => (props.isValid ? "pointer" : "not-allowed")};
    }
  }

  .background__black {
    position: absolute;
    width: 50%;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: -1;
  }
`;

const Home = (props) => {
    const isSignedIn = useSelector((state) => state.auth.status.signIn);
    const isPaid = useSelector((state) => state.quiz.status.isPaid);
    const [open, setOpen] = useState(false);
    const [now] = useState(new Date())
    // const [dDay,setDDay] = useState(Math.abs(now.getTime() - new Date(`${now.getFullYear()}/${now.getMonth()+1}/${now.getDate()}/19:25:00`))/1000 > 600 ? new Date(`${now.getFullYear()}/${now.getMonth()+1}/${now.getDate()+1}/12:00:00`) :now);
    const [dDay] = useState(Math.abs(now.getTime() - new Date(`${now.getFullYear()}/${now.getMonth()+1}/${now.getDate()}/12:00:00`))/1000 > 600 ? new Date(`${now.getFullYear()}/${now.getMonth()+1}/${now.getDate()+1}/12:00:00`) :now);
    const [date, setDate] = useState({
        hours: "0",
        minutes: "0",
        seconds: "0",
        isValid: false,
    });

    const quizStart = () => {
        if (isPaid === "SUCCESS") props.history.push("/quiz");
        if (isSignedIn === "SUCCESS") setOpen(true);
        else props.history.push("/signIn");
    };

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
            if (amount <= 0 && amount >= -600) {
                setDate({
                    hours: "00",
                    minutes: "00",
                    seconds: "00",
                    isValid: true,
                });
            }
            else {
                setDate({
                    ...{date},
                    hours: _hours,
                    minutes: _minutes,
                    seconds: _seconds,
                    isValid: false
                });
            }
        }, 1000);
        return () => clearInterval(intervalId);
    }, [date]);

    return (
        <HomeStyle isValid={date.isValid}>
            <div
                className="live__img"
                style={{backgroundImage: `url("TheQuizLive.png")`}}
            />
            {!date.isValid ? (
                <div className="time">
                    <p className="title">다음 퀴즈까지</p>
                    <p className="now">
                        {date.hours}:{date.minutes}:{date.seconds}
                    </p>
                    <button className="question__btn" disabled={true}>
                        잠시 기다려 주세요!
                    </button>
                </div>
            ) : (
                <div className="time">
                    <p className="title">지금 바로 참여하세요!</p>
                    <button className="question__btn" onClick={quizStart}>
                        퀴즈풀기!
                    </button>
                </div>
            )}
            <div className="background__black"/>
            {open && <BalanceCheck setOpen={setOpen} {...props} />}
        </HomeStyle>
    );
};

export default Home;
