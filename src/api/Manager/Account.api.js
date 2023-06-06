import http from "../../utils/http";

export const getAllAcount = () => {
  return http.get(`/manager/account/`);
};
export const getAccount = (id) => {
  return http.get(`/manager/account/?id=${id}`);
};
export const addAccount = (data) => {
  return http.post("/manager/account/", data);
};
export const updateAccount = (data) => {
  return http.put("/manager/account/", data);
};
export const deleteAccount = (ids) => {
  return http.delete("/manager/account/", ids);
};
export const getTimeLog = () => {
  return http.get("/manager/logs/");
};
export const getOpenReq = (params) => {
  return http.post("/manager/logs/", params);
};
export const getCheckAgain = (params) => {
  return http.post("/manager/check-again/", params);
};
