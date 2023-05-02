import http from "../utils/http";

export const getVehicleById = (id) => {
  return http.get("/manager/vehicle", id);
};
export const addVehicle = (data) => {
  return http.get("/manager/vehicle", data);
};
export const updateVehicle = (data) => {
  return http.get("/manager/vehicle", data);
};
export const deleteVehicle = (params) => {
  return http.delete("/manager/account/", params);
};
