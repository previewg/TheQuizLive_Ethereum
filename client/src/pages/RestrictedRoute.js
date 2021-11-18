import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import React from "react";

const TRUE = "SUCCESS";

const RestrictedRoute = ({
  component: Component,
  fallback: Fallback,
  path,
}) => {
  const isSignedIn = useSelector((state) => state.auth.status.signIn);
  const isPaid = useSelector((state) => state.quiz.status.isPaid);

  switch (path) {
    case "/signIn":
      return isSignedIn !== TRUE ? (
        <Component/>
      ) : (
        <Fallback />
      );
    case "/signUp":
      return isSignedIn !== TRUE ? (
        <Component/>
      ) : (
        <Fallback />
      );
    case "/info":
      return isSignedIn === TRUE ? (
          <Component/>
      ) : (
          <Fallback />
      );
    case "/quiz":
      if (isSignedIn === TRUE && isPaid === TRUE)
        return <Component/>;
      else if (isSignedIn !== TRUE) return <Fallback />;
      else if (isPaid !== TRUE) {
        return <Redirect to="/"/>;
      }
      break;
  }
};

export default RestrictedRoute;
