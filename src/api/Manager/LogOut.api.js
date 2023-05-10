import http from "../../utils/http";
export const logoutManager = () => {
  return http.post("/manager/logout/");
};
