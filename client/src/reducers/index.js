import { combineReducers } from "redux";
import auth from "./auth";
import quiz from "./quiz";

export default combineReducers({
  auth,
  quiz,
});
