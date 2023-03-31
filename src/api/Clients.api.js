import http from "../utils/http";

export const getClient = () => {
  return http.get("/Clients");
};
export const getClientById = (id) => {
  return http.get(`/Clients/${id}`);
};