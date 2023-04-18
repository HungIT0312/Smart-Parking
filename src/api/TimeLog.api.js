import http from "../utils/http";

export const getTimeLog = () => {
  return http.get("/TimeLog");
};
