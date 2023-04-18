import http from "../utils/http";

export const getClient = () => {
  return http.get("/Clients");
};
export const getClientById = (id) => {
  return http.get(`/Clients/${id}`);
};

export const getClientByData = (data) => {
  return http.get(`/Clients`, data);
};
export const addClient = (data) => {
  return http.post(`/Clients`, data);
};
export const updateClient = (id, data) => {
  return http.put(`/Clients/${id}`, data);
};
export const deleteClientsById = (id) => {
  return http.delete(`/Clients/${id}`);
};
