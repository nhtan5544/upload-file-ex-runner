import axios from "axios";
import { BASE_URL } from "../constant";

const callAPIWithoutToken = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,
  timeoutErrorMessage: "timeout",
  headers: {
    "Content-Type": "application/json",
  },
});

callAPIWithoutToken.interceptors.response.use(
  (res) => {
    return res;
  },
  (err: any) => {
    //timeout && error network
    if (
      err.code === "ERR_NETWORK" ||
      (err.code === "ECONNABORTED" && err.message.includes("timeout"))
    ) {
      return Promise.reject({
        response: {
          data: {},
          status: -1,
        },
      });
    }

    return Promise.reject(err);
  }
);
export { callAPIWithoutToken };
