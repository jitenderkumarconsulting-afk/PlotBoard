import RestClient from "../../api/restClient";
import { signUpURL, loginURL, refreshTokenUrl } from "../../api/urls";

import { authAction } from "../slices/auth-slice";

export const login = (params, callBack) => {
  return (dispatch, getState) => {
    // call the service and set the state
    RestClient.Post(getState(), loginURL, params)   // calling the API
      .then((result) => {
        console.log("login result ", result);
        if (result.data.success) {
          dispatch(authAction.login(result.data));
          callBack({ success: true });
        }
      })
      .catch((error) => {
        console.log("LOGIN ERROR :: ", error)
        callBack({
          success:false,
          code:error.code,
          message:error?.code==="ERR_NETWORK"?"Kindly check internet connection":error.message?? error.response.data.message
        });
      })
  };
};

export const register = (params, callBack) => {
  return (dispatch, getState) => {
    RestClient.Post(getState(), signUpURL, params)   // calling the API
      .then((result) => {
        console.log("signup result ", result);
        dispatch(authAction.register(result.data));
        callBack({
          success: true,
          message: result.data.message
        });
      })
      .catch((error) => {
        console.log("signup ERROR :: ", error)
        callBack({
          success: false,
          code:error.code,
          message:error?.code==="ERR_NETWORK"?"Kindly check internet connection": error.message??error?.response?.data?.message
        });
      })
  };
};

export const logout = (callBack) => {
  return (dispatch, getState) => {
    // call the service and set the state
    console.log('logout parms: ');
    dispatch(authAction.logout());
    callBack({ success: true });
  };
};


export const refreshToken = (token, callBack) => {
  return (dispatch, getState) => {
    RestClient.Post(getState(), refreshTokenUrl)   // calling the API
      .then((result) => {
        if(result.status){
        dispatch(authAction.refreshToken(result.data.data.access_token));
        callBack({
          success: true,
          message: result.data.message
        });
      }else{
        callBack({
          success: false,
          message: result.message
        });
      }
      })
      .catch((error) => {
        console.log('refresh token error: ',error);
      callBack({
          success: false,
          message: error?.response?.data?.message
        });
      })
  };
};
