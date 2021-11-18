import React, { useState, useEffect } from "react";
import styled from "styled-components";

const AboutStyle = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .layout {
    margin-top: 120px;
    width: 50%;
    
    .head {
      font-size: 2.5rem;
      margin-bottom: 80px;
    }

    .body {
      display: flex;
      flex-direction: column;
    }
  }

  .info__logic__box {
  }
`;

const QnAStyle = styled.div`
  .active {
    position: absolute;
    width: ${(props) => (props.open ? "10px" : "0px")};
    height: 50px;
    background-color: rgb(241, 43, 69);
    transition: all 0.3s ease-in-out;
  }

  .question {
    background: none;
    border: 0.1mm solid rgba(0, 0, 0, 0.2);
    width: 100%;
    min-width: 400px;
    height: 50px;
    padding: 10px;
    padding-left: 20px;
    font-weight: 600;
    font-size: 1.2rem;
    text-align: left;
    cursor: pointer;
    margin-bottom: 15px;
  }

  .answer {
    padding: 10px;
    padding-left: 20px;
    padding-bottom: 20px;
    font-size: 1.1rem;
  }
`;

const About = (props) => {
  const QnA = ({ question, answer }) => {
    const [open, setOpen] = useState(false);
    return (
      <QnAStyle open={open}>
        <div className="active"/>
        <button className="question" onClick={() => setOpen(!open)}>
          {question}
        </button>
        {open && <p className="answer">{answer}</p>}
      </QnAStyle>
    );
  };

  return (
    <AboutStyle>
      <div className="layout">
        <p className="head">어떻게 참여할까요?</p>
        <div className="body">
          <QnA
            question="Q . 처음부터 과금이 필요한가요?"
            answer="A . 회원가입을 하면 100QMT를 드려요😍"
          />
          <QnA
            question="Q . 퀴즈를 풀 수 있는 시간은 어떻게 되나요?"
            answer="A . 하루 한 번 낯 12시에 가능합니다!"
          />
          <QnA
            question="Q . 퀴즈 참가비는 어떻게 되나요?"
            answer="A . 한 번 참가하는데 10 QMT가 차감돼요"
          />
          <QnA
            question="Q . 정답자라면?"
            answer="A . 일정한 양의 보상이 지급됩니다. 자세한 사항은 아래 버튼을
              눌러보세요😆"
          />
          <QnA
            question="Q . 오답자라면?"
            answer="A . 아쉽지만 다음 라이브퀴즈에 도전해주세요 😭"
          />
        </div>
      </div>
    </AboutStyle>
  );
};

export default About;
