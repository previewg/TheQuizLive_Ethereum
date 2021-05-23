import {
  QUIZ_BALANCE_CHECK_SUCCESS,
  QUIZ_BALANCE_CHECK_FAILURE,
  QUIZ_BALANCE_CHECK_INIT,
  QUIZ_ENTRANCE_FEE_SUCCESS,
  QUIZ_ENTRANCE_FEE_FAILURE,
  QUIZ_ENTRANCE_FEE_INIT,
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

    // initialize
    case QUIZ_BALANCE_CHECK_INIT:
      return update(state, {
        status: {
          isChecked: { $set: "INIT" },
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

    // initialize
    case QUIZ_ENTRANCE_FEE_INIT:
      return update(state, {
        status: {
          isPaid: { $set: "INIT" },
        },
      });

    default:
      return state;
  }
}
