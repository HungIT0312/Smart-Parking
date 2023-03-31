import http from "../utils/http";

export const getSlots = () => {
  return http.get("/Parkings");
};
// export const getClientById = (id) => {
//   return http.get(`/Clients/${id}`);
// };