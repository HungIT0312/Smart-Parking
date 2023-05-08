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
