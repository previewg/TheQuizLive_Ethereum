import React, { useState, useEffect } from "react";
import styled from "styled-components";

const SignInStyle = styled.section`
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

const SignIn = (props) => {
  return (
    <SignInStyle>
      <div className="layout"></div>
    </SignInStyle>
  );
};

export default SignIn;
