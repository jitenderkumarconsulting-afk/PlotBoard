import RestClient from "../../api/restClient";
import {gameURL } from "../../api/urls";

export const generatePlayableToken = (params,gameId, callBack) => {
  return (dispatch, getState) => {
    // call the service and set the state
    let endPoint=gameId+'/urls';
    RestClient.Post(getState(), gameURL+endPoint,params)   // calling the API
      .then((result) => {
        if (result.data.success) {
          callBack({ success: true ,data:result.data.data});
        }
      })
      .catch((error) => {
        console.log("generatePlayableToken ERROR :: ", error)
        callBack({
          success: false,
          code:error?.code,
          message: error?.code==="ERR_NETWORK"?"Kindly check internet connection":error.response.data.message
        });
      })
  };
};