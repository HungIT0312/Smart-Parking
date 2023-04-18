import http from "../utils/http";

export const getLots = () => {
  return http.get("/Parkings");
};
// export const getClientById = (id) => {
//   return http.get(`/Clients/${id}`);
// };
