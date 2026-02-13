import RestClient from "../../api/restClient";
import { gameLoopURL } from "../../api/urls";
export const publish = (urlCode,params, callBack) => {
    return (dispatch, getState) => {
      // call the service and set the state
      RestClient.Post(getState(), gameLoopURL+"publish/"+urlCode,params)   // calling the API
        .then((result) => {
          console.log("publish result ", result);
          if (result.data.success) {
            callBack({ success: true });
          }
        })
        .catch((error) => {
          callBack({
            success: error.response.data.success,
            message: error.response.data.message
          });
        })
    };
  };

  export const subcribe = (urlCode,params, callBack) => {
    return (dispatch, getState) => {
      // call the service and set the state
      RestClient.Post(getState(), gameLoopURL+"subscribe/"+urlCode,params)   // calling the API
        .then((result) => {
          console.log("subcribe result ", result);
          if (result.data.success) {
            callBack({ success: true });
          }
        })
        .catch((error) => {
          console.log("subcribe ERROR :: ", error)
          callBack({
            success: false,
            message: error?.code==="ERR_NETWORK"?"Kindly check internet connection":error?.response?.data?.message
          });
        })
    };
  };
  
  export const unsubcribe = (urlCode,params, callBack) => {
    return (dispatch, getState) => {
      // call the service and set the state
      RestClient.Post(getState(), gameLoopURL+"unsubscribe/"+urlCode,params)   // calling the API
        .then((result) => {
          console.log("unsubcribe result ", result);
          if (result.data.success) {
            callBack({ success: true });
          }
        })
        .catch((error) => {
          console.log("unsubcribe ERROR :: ", error)
          callBack({
            success: false,
            message:error?.code==="ERR_NETWORK"?"Kindly check internet connection":error?.response?.data?.message
          });
        })
    };
  };