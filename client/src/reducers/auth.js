import {
  AUTH_INIT,
  AUTH_SIGNIN_SUCCESS,
  AUTH_SIGNIN_FAILURE,
  AUTH_SIGNOUT,
  AUTH_SIGNOUT_SUCCESS,
  AUTH_SIGNOUT_FAILURE,
  AUTH_SIGN_DESTROY,
  AUTH_SIGN_DESTROY_SUCCESS,
  AUTH_SIGN_DESTROY_FAILURE,
} from "../actions/auth";

import update from "react-addons-update";

function getCookie(name) {
  let value = "; " + document.cookie;
  let parts = value.split("; " + name + "=");
  if (parts.length === 2) return parts.pop().split(";").shift();
}

function parseJwt(token) {
  if (!token) return { nickname: "" };
  let base64Url = token.split(".")[1];
  let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  let jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  return JSON.parse(jsonPayload);
}

const initialState = {
  user: {
    uid: parseJwt(getCookie("quiz")).uid || "",
    unn: parseJwt(getCookie("quiz")).unn || "",
  },
  status: {
    signIn: "INIT",
    signUp: "INIT",
    signOut: "INIT",
    signDestroy: "INIT",
  },
};

export default function auth(state = initialState, action) {
  switch (action.type) {
    case AUTH_INIT:
      return update(state, {
        signIn: {
          status: { $set: "INIT" },
        },
        signOut: {
          status: { $set: "INIT" },
        },
      });

    // 로그인
    case AUTH_SIGNIN_SUCCESS:
      return update(state, {
        status: {
          signIn: { $set: "SUCCESS" },
        },
        user: {
          uid: { $set: action.data.uid },
          unn: { $set: action.data.unn },
        },
      });
    case AUTH_SIGNIN_FAILURE:
      return update(state, {
        status: {
          signIn: { $set: "FAILURE" },
        },
      });

    // 로그아웃
    case AUTH_SIGNOUT_SUCCESS:
      return update(state, {
        status: {
          signIn: { $set: "INIT" },
          signOut: { $set: "SUCCESS" },
        },
        user: {
          uid: { $set: "" },
          unn: { $set: "" },
        },
      });

    case AUTH_SIGNOUT_FAILURE:
      return update(state, {
        status: {
          signOut: { $set: "FAILURE" },
        },
      });

    //회원탈퇴
    case AUTH_SIGN_DESTROY:
      return update(state, {
        signDestroy: {
          status: { $set: "WAITING" },
        },
      });

    case AUTH_SIGN_DESTROY_SUCCESS:
      return update(state, {
        user: {
          isLoggedIn: { $set: false },
          nickname: { $set: "" },
          profile: { $set: "" },
          email: { $set: "" },
          hash_email: { $set: "" },
        },
        signDestroy: {
          status: { $set: "SUCCESS" },
        },
      });
    case AUTH_SIGN_DESTROY_FAILURE:
      return update(state, {
        signDestroy: {
          status: { $set: "FAILURE" },
        },
      });
    default:
      return state;
  }
}
