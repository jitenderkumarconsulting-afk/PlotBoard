import RestClient from "../../api/restClient";
import { gameStateURL } from "../../api/urls";
export const createGameState = (urlCode, callBack) => {
    return (dispatch, getState) => {
      // call the service and set the state
      RestClient.Post(getState(), gameStateURL+"state/"+urlCode)   // calling the API
        .then((result) => {
          if (result.data.success) {
            callBack({ success: true,code:result.data.status_code,data:result.data.data});
          }
          else{
            callBack({ success: false,code:result.data.status_code});
          }
        })
        .catch((error) => {
          console.log("createGameState ERROR :: ", error)
          callBack({
            success: error.response.data.success,
            code:error.response.data.status_code??error?.code,
            message:error?.code==="ERR_NETWORK"?"Kindly check internet connection":error?.response?.data?.message
          });
        })
    };
  };
  export const getPlayGameState = (urlCode,callBack) => {
    return (dispatch, getState) => {
      RestClient.Get(getState(), gameStateURL + "state/" + urlCode,) // calling the API
      .then((result) => {
        //save games in slice
        callBack({
          success: result.data.success,
          message: result.message,
          data: result.data.data,
        });
      })
      .catch((error) => {
        console.log('getPlayGameState service call error : ',error);
        callBack({
          success: false,
          code:error?.code,
          message:error?.code==="ERR_NETWORK"?"Kindly check internet connection": error?.message,
        });
      });
  };
      
};