import http from "../../utils/http";
export const getAccountById = (id) => {
  return http.get(`/manager/account/?id=${id}`);
};
