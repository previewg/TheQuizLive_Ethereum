import React, { useState, useEffect } from "react";
import styled from "styled-components";

const SignUpStyle = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .layout {
    margin-top: 100px;
    width: 50%;
  }
`;

const SignUp = (props) => {
  return (
    <SignUpStyle>
      <div className="layout"></div>
    </SignUpStyle>
  );
};

export default SignUp;
