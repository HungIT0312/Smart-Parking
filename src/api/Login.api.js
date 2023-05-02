import http from "../utils/http";

export const getTokenLogin = (data) => {
  return http.post("/manager/login/", data);
};
