import http from "../../utils/http";

export const getAccountById = (id) => {
  return http.get(`/manager/account/`, id);
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
