import {
  QUIZ_BALANCE_CHECK_SUCCESS,
  QUIZ_BALANCE_CHECK_FAILURE,
  QUIZ_ENTRANCE_FEE_SUCCESS,
  QUIZ_ENTRANCE_FEE_FAILURE,
} from "../actions/quiz";
import update from "react-addons-update";

const initialState = {
  status: {
    isChecked: "INIT",
    isPaid: "INIT",
  },
};

export default function auth(state = initialState, action) {
  switch (action.type) {
    // available
    case QUIZ_BALANCE_CHECK_SUCCESS:
      return update(state, {
        status: {
          isChecked: { $set: "SUCCESS" },
        },
      });

    // unavailable
    case QUIZ_BALANCE_CHECK_FAILURE:
      return update(state, {
        status: {
          isChecked: { $set: "FAILURE" },
        },
      });

    // paid
    case QUIZ_ENTRANCE_FEE_SUCCESS:
      return update(state, {
        status: {
          isPaid: { $set: "SUCCESS" },
        },
      });

    // unpaid
    case QUIZ_ENTRANCE_FEE_FAILURE:
      return update(state, {
        status: {
          isPaid: { $set: "FAILURE" },
        },
      });
    default:
      return state;
  }
}
