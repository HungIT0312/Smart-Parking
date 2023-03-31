import http from "../utils/http";

export const getUser = () => {
  return http.get("/User");
};
export const getUserById = (id) => {
  return http.get(`/User/${id}`);
};
export const getUserByData = (data) => {
  return http.get(`/User`,data);
};
export const addUser = (data) => {
    return http.get(`/User`,data);
};
export const deleteUserById = (id) => {
    return http.delete(`/User/${id}`);
};