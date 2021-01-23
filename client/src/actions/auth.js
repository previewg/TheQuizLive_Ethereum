import axios from "axios";

export const AUTH_INIT = "AUTH_INIT";

// SignIn
export const AUTH_SIGNIN_SUCCESS = "AUTH_SIGNIN_SUCCESS";
export const AUTH_SIGNIN_FAILURE = "AUTH_SIGNIN_FAILURE";

// SignOut
export const AUTH_SIGNOUT = "AUTH_SIGNOUT";
export const AUTH_SIGNOUT_SUCCESS = "AUTH_SIGNOUT_SUCCESS";
export const AUTH_SIGNOUT_FAILURE = "AUTH_SIGNOUT_FAILURE";

// SignDestroy
export const AUTH_SIGN_DESTROY = "AUTH_SIGN_DESTROY";
export const AUTH_SIGN_DESTROY_SUCCESS = "AUTH_SIGN_DESTROY_SUCCESS";
export const AUTH_SIGN_DESTROY_FAILURE = "AUTH_SIGN_DESTROY_FAILURE";

export const authInit = () => {
  return { type: AUTH_INIT };
};

// 로그인
export const signInSuccess = (data) => {
  return {
    type: AUTH_SIGNIN_SUCCESS,
    data: data,
  };
};
export const signInFailure = (error) => {
  return { type: AUTH_SIGNIN_FAILURE, error: error };
};

// 로그아웃
export const signOutStart = () => {
  return { type: AUTH_SIGNOUT };
};
export const signOutSuccess = () => {
  return { type: AUTH_SIGNOUT_SUCCESS };
};
export const signOutFailure = () => {
  return { type: AUTH_SIGNOUT_FAILURE };
};

// 회원 탈퇴
export const signDestroyStart = () => {
  return { type: AUTH_SIGN_DESTROY };
};
export const signDestroySuccess = () => {
  return { type: AUTH_SIGN_DESTROY_SUCCESS };
};
export const signDestroyFailure = () => {
  return { type: AUTH_SIGN_DESTROY_FAILURE };
};

// 로그아웃 요청
export const signOutRequest = () => async (dispatch) => {
  dispatch(signOutStart());
  await axios
    .post("/auth/signOut")
    .then((response) => {
      dispatch(signOutSuccess());
    })
    .catch((error) => {
      dispatch(signOutFailure());
    });
};

// 회원탈퇴요청
export const signDestroyRequest = (email) => async (dispatch) => {
  dispatch(signDestroyStart());
  await axios
    .post("/auth/destroy", { email: email })
    .then((username) => {
      dispatch(signDestroySuccess());
    })
    .catch((error) => {
      dispatch(signDestroyFailure());
    });
};
