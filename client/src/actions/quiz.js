import axios from "axios";

// BALANCE_CHECK
export const QUIZ_BALANCE_CHECK_SUCCESS = "QUIZ_BALANCE_CHECK_SUCCESS";
export const QUIZ_BALANCE_CHECK_FAILURE = "QUIZ_BALANCE_CHECK_FAILURE";

// ENTRANCE_FEE
export const QUIZ_ENTRANCE_FEE_SUCCESS = "QUIZ_ENTRANCE_FEE_SUCCESS";
export const QUIZ_ENTRANCE_FEE_FAILURE = "QUIZ_ENTRANCE_FEE_FAILURE";

// The balance payable has been confirmed successfully
export const balanceCheckSuccess = () => {
  return {
    type: QUIZ_BALANCE_CHECK_SUCCESS,
  };
};
// The balance payable has not been confirmed
export const balanceCheckFailure = () => {
  return {
    type: QUIZ_BALANCE_CHECK_FAILURE,
  };
};

// The entrance fee has been paid successfully
export const entranceFeeSuccess = () => {
  return {
    type: QUIZ_ENTRANCE_FEE_SUCCESS,
  };
};
// The entrance fee has not been paid
export const entranceFeeFailure = () => {
  return {
    type: QUIZ_ENTRANCE_FEE_FAILURE,
  };
};
