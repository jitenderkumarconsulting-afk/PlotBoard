import { baseURL } from "./urls";
import axios from "axios";

export default class RestClient {
  static async Get(state, endPoint, params = {}, token = "") {
    let url = `${baseURL}${endPoint}`;
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    if (token !== "" || token !== undefined) {
      headers["Authorization"] = "Bearer " + token;
    }
    if (state !== undefined && state.auth.isAuthenticated) {
      headers["Authorization"] = "Bearer " + state.auth.accessToken;
    }
    let config = {
      headers: headers,
      params: params,
    };
    try {
      const response = await axios.get(url, config);
      return response;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  static async Post(state, endPoint, params) {
    let url = `${baseURL}${endPoint}`;
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    if (state.auth.isAuthenticated) {
      headers["Authorization"] = "Bearer " + state.auth.accessToken;
    }
    let config = {
      headers: headers,
    };
    const response = await axios.post(url, params, config);
    return response;
  }

  static async Put(state, endPoint, params) {
    let url = `${baseURL}${endPoint}`;
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    if (state.auth.isAuthenticated) {
      headers["Authorization"] = "Bearer " + state.auth.accessToken;
    }
    let config = {
      headers: headers,
    };
    try {
      const response = await axios.put(url, params, config);
      return response;
    } catch (error) {
      console.error(error);
      return error.response;
    }
  }

  static async PostWithAccessToken(state, endPoint, params) {
    let url = `${baseURL}${endPoint}`;
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + state.auth.accessToken,
    };
    let config = {
      headers: headers,
    };
    try {
      const response = await axios.post(url, params, config);
      return response;
    } catch (error) {
      return error.response;
    }
  }

  static async PatchWithAccessToken(state, endPoint, params) {
    let url = `${baseURL}${endPoint}`;
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + state.auth.accessToken,
    };
    let config = {
      headers: headers,
    };
    try {
      const response = await axios.patch(url, params, config);
      return response;
    } catch (error) {
      return error.response;
    }
  }

  static async Delete(state, endPoint) {
  
    let url = `${baseURL}${endPoint}`;
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + state.auth.accessToken,
    };
    let config = {
      headers: headers,
    };
    try {
      const response = await axios.delete(url,config);
      return response;
    } catch (error) {
      return error.response;
    }
  }
}
