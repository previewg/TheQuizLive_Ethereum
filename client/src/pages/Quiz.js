import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";

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

const Quiz = (props) => {
  const [answer, setAnswer] = useState(0);
  const [quiz, setQuiz] = useState({
    id: "",
    category: "",
    question: "",
    choice1: "",
    choice2: "",
    choice3: "",
    choice4: "",
  });

  useEffect(async () => {
    const res = await axios.get("/quiz/start");
    if (res.data.success === 1) {
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

    const timer = () => {
      setTimeout(async () => {
        await axios
          .post("/quiz/submit", { id: quiz.id, answer: String(answer) })
          .then((result) => {
            console.log(result);
          });
      }, 10000);
    };
    timer();

    return () => clearTimeout(timer);
  }, []);

  return (
    <QuizStyle answer={answer}>
      <div className="container">
        <p id="category">&lt;{quiz.category}&gt;</p>
        <p id="question">👉 {quiz.question}</p>
        <div className="choices">
          <button id="choice1" onClick={() => setAnswer(1)}>
            {quiz.choice1}
          </button>
          <button id="choice2" onClick={() => setAnswer(2)}>
            {quiz.choice2}
          </button>
          <button id="choice3" onClick={() => setAnswer(3)}>
            {quiz.choice3}
          </button>
          <button id="choice4" onClick={() => setAnswer(4)}>
            {quiz.choice4}
          </button>
        </div>
      </div>
    </QuizStyle>
  );
};

export default Quiz;
