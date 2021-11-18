import React, {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import {balanceCheckInit, entranceFeeInit} from "../actions/quiz";

const QuizStyle = styled.section`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  .container {
    width: 40%;
    min-width: 350px;
    display: flex;
    flex-direction: column;

    #category {
      margin: 0;
      text-align: right;
      color: gray;
    }

    #question {
      font-size: 1.7rem;
    }

    .choices {
      display: flex;
      flex-direction: column;

      button {
        height: 50px;
        background: none;
        border: 0.1px lightgray solid;
        border-radius: 5px;
        font-size: 1rem;
        cursor: pointer;
        text-align: left;
        padding-left: 20px;
        margin-bottom: 10px;
        outline-color: rgba(241, 43, 69, 0.5);

        :nth-child(${(props) => props.answer}) {
          background: rgba(241, 43, 69, 0.1);
        }
      }
    }
  }
`;

const TimerStyle = styled.div`
  position: absolute;
  top: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;

  .timerBar {
    width: 100%;

    div {
      height: 10px;
      background: linear-gradient(90deg, #cc5285, #ecafb5);
      width: ${(props) => props.time > 0 ? (props.time - 1) * 10 : 0}%;
      transition: width 1s linear;
    }
  }

  p {
    margin: 10px;
  }

`;

const Quiz = () => {
    const id_ref = useRef(0);
    const answer_ref = useRef(0);
    const [answer, setAnswer] = useState(0);
    const [quiz, setQuiz] = useState({
        id: 0,
        category: "",
        question: "",
        choice1: "",
        choice2: "",
        choice3: "",
        choice4: "",
    });
    const [time, setTime] = useState(11);
    const isChecked = useSelector((state) => state.quiz.status.isChecked);

    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        if (isChecked === 'SUCCESS') {
            async function randomQuiz() {
                const res = await axios.get("/quiz/random");
                if (res.data.success === 1) {
                    id_ref.current = res.data.quiz[0].id;
                    let data = res.data.quiz[0];
                    setQuiz({
                        id: data.id,
                        category: data.category,
                        question: data.question,
                        choice1: data.choice1,
                        choice2: data.choice2,
                        choice3: data.choice3,
                        choice4: data.choice4,
                    });
                }
            }
            randomQuiz();
            const submit = setTimeout(async () => {
                const res = await axios.post("/quiz/submit", {
                    id: id_ref.current,
                    answer: String(answer_ref.current),
                });
                if (res.data.success === 1) {
                    alert("축하드립니다! 정답입니다:)");
                } else {
                    alert("아쉽게도 정답이 아닙니다ㅠㅠ");
                }
                history.push("/info");
            }, 11000);

            const timer = setInterval(() => {
                setTime(prevState => prevState - 1);
            }, 1000);

            return () => {
                clearTimeout(submit);
                clearInterval(timer);
                dispatch(entranceFeeInit());
                dispatch(balanceCheckInit());
            };
        } else {
            history.push("/");
        }
    }, [isChecked]);

    const answerHandler = (answer) => {
        setAnswer(answer);
        answer_ref.current = answer;
    };
    return (
        <QuizStyle answer={answer}>
            <TimerStyle time={time}>
                <div className='timerBar'>
                    <div/>
                </div>
                <p>남은 시간 <strong>{time > 10 ? 10 : time >= 0 ? time : 0}초</strong></p>
            </TimerStyle>
            <div className="container">
                <p id="category">&lt;{quiz.category}&gt;</p>
                <p id="question">👉 {quiz.question}</p>
                <div className="choices">
                    <button id="choice1" onClick={() => answerHandler(1)}>
                        {quiz.choice1}
                    </button>
                    <button id="choice2" onClick={() => answerHandler(2)}>
                        {quiz.choice2}
                    </button>
                    <button id="choice3" onClick={() => answerHandler(3)}>
                        {quiz.choice3}
                    </button>
                    <button id="choice4" onClick={() => answerHandler(4)}>
                        {quiz.choice4}
                    </button>
                </div>
            </div>
        </QuizStyle>
    );
};

export default Quiz;
