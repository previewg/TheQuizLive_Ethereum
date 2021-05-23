import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { entranceFeeInit, balanceCheckInit } from "../actions/quiz";

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
`;

const Quiz = ({ push }) => {
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
  const [time, setTime] = useState({
    1: 10,
    2: 0,
    3: 0,
  });
  const isPaid = useSelector((state) => state.quiz.status.isPaid);
  const dispatch = useDispatch();

  useEffect(async () => {
    if (isPaid) {
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
        push("/info");
      }, 1000000);

      const timer1 = setInterval(() => {
        let before = time["1"];
        setTime({ ...time, 1: before - 1 });
      }, 1000);
      // const timer2 = setInterval(() => {
      //   setTime((time) => time - 1);
      // }, 100);

      return () => {
        clearTimeout(submit);
        clearInterval(timer1);
        dispatch(entranceFeeInit());
        dispatch(balanceCheckInit());
      };
    } else {
      push("/home");
    }
  }, []);

  const answerHandler = (answer) => {
    setAnswer(answer);
    answer_ref.current = answer;
  };
  return (
    <QuizStyle answer={answer}>
      <TimerStyle>
        <p>{time["1"]}</p>
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
