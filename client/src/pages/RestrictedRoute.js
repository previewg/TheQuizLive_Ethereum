import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { checkBtnIsClicked } from "../actions/quiz";

const TRUE = "SUCCESS";

const RestrictedRoute = ({
  component: Component,
  fallback: Fallback,
  subFallback: SubFallback,
  path,
}) => {
  const isSignedIn = useSelector((state) => state.auth.status.signIn);
  const isPaid = useSelector((state) => state.quiz.status.isPaid);
  const history = useHistory();

  switch (path) {
    case "/signIn":
      return isSignedIn !== TRUE ? (
        <Component push={history.push} />
      ) : (
        <Fallback />
      );
      break;
    case "/signUp":
      return isSignedIn !== TRUE ? (
        <Component push={history.push} />
      ) : (
        <Fallback />
      );
      break;
    case "/quiz":
      if (isSignedIn === TRUE && isPaid === TRUE)
        return <Component push={history.push} />;
      else if (isSignedIn !== TRUE) return <Fallback />;
      else if (isPaid !== TRUE) {
        return <SubFallback />;
      }
      break;
  }
};

export default RestrictedRoute;
