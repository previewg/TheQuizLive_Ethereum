// BALANCE_CHECK
export const QUIZ_BALANCE_CHECK_SUCCESS = "QUIZ_BALANCE_CHECK_SUCCESS";
export const QUIZ_BALANCE_CHECK_FAILURE = "QUIZ_BALANCE_CHECK_FAILURE";
export const QUIZ_BALANCE_CHECK_INIT = "QUIZ_BALANCE_CHECK_INIT";

// ENTRANCE_FEE
export const QUIZ_ENTRANCE_FEE_SUCCESS = "QUIZ_ENTRANCE_FEE_SUCCESS";
export const QUIZ_ENTRANCE_FEE_FAILURE = "QUIZ_ENTRANCE_FEE_FAILURE";
export const QUIZ_ENTRANCE_FEE_INIT = "QUIZ_ENTRANCE_FEE_INIT";

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
// The balance payable check will be initialized
export const balanceCheckInit = () => {
  return {
    type: QUIZ_BALANCE_CHECK_INIT,
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
// The entrance fee check will be initialized
export const entranceFeeInit = () => {
  return {
    type: QUIZ_ENTRANCE_FEE_INIT,
  };
};
