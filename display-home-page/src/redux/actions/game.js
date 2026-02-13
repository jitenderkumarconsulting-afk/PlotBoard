import RestClient from "../../api/restClient";
import { addGameURL, deleteGameURL, editGameURL, getGameURL } from "../../api/urls";
import { addGame as addGameToState, editGame as editGameToState, deleteGame as deleteGameToState } from "../slices/games.slice";

export const createGame = (params, gameId, callBack) => {
  if (gameId === undefined) {
    return addGame(params, callBack);
  } else return editGame(params, gameId, callBack);
};
const addGame = (params, callBack) => {
  return (dispatch, getState) => {
    RestClient.PostWithAccessToken(getState(), addGameURL, params) // calling the API
      .then((result) => {
        if (result.data.success) {
          dispatch(addGameToState(result.data.data));
        }
        callBack({
          success: result.data.success,
          message: result.data.message,
          data: result.data.data,
        });
      })
      .catch((error) => {
        callBack({
          success: false,
          code:error?.code,
          message:error?.code==="ERR_NETWORK"?"Kindly check internet connection": error?.response?.data?.message,
        });
      });
  };
};
const editGame = (params, gameId, callBack) => {
  return (dispatch, getState) => {
    let gameUrl = editGameURL + "/" + gameId;

    RestClient.PatchWithAccessToken(getState(), gameUrl, params) // calling the API
      .then((result) => {
        if (result.data.success) {
          dispatch(editGameToState(result.data.data));
        }
        callBack({
          success: result.data.success,
          message: result.data.message,
        });
      })
      .catch((error) => {
        callBack({
          success: false,
          code:error.code,
          message:error?.code==="ERR_NETWORK"?"Kindly check internet connection": error?.response?.data?.message,
        });
      });
  };
};

export const getGames = (callBack) => {
  return (dispatch, getState) => {
    RestClient.Get(getState(), getGameURL) // calling the API
      .then((result) => {
        //save games in slice
        callBack({
          success: result.data.success,
          message: result.message,
          data: result.data.data,
        });
      })
      .catch((error) => {
        callBack({
          success: false,
          code:error?.code,
          message:error?.code==="ERR_NETWORK"?"Kindly check internet connection": error?.message,
        });
      });
  };
};

export const getGame = async (gameId, token) => {
  return await RestClient.Get(
    undefined,
    getGameURL + "/" + gameId,
    null,
    token
  ); // calling the API
};

export const deleteGame = (params, callBack) => {
  return (dispatch, getState) => {
    RestClient.Delete(getState(), deleteGameURL + "/" + params) // calling the API
      .then((result) => {
        if (result.data.success) {
          dispatch(deleteGameToState(params));
        }
        callBack({
          success: result.data.success,
          message: result.data.message,
        });
      })
      .catch((error) => {
        callBack({
          success: false,
          message: error?.message,
        });
      });
  };
};