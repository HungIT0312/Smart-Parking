import axios from "axios";
// import { REACT_APP_API_KEY, REACT_APP_API_URL } from "@env";
// console.log(API_URL);
//http://192.168.5.237:8000/
class Http {
  constructor() {
    this.instance = axios.create({
      baseURL: "http://172.20.10.7:8000/",
      name: "Parking",
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });
    this.instance.interceptors.response.use(
      (response) => {
        return response.data;
      },
      ({ response }) => {
        if (response.status === 401) {
          console.log(response);
        }
        const result = { ...response.data, status: response.status };
        return Promise.reject(result);
      }
    );
    this.instance.interceptors.request.use(
      (config) => {
        const token = sessionStorage.getItem("tokenAdmin");
        if (token) {
          config.headers["Authorization"] = `Token ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error.response);
      }
    );
  }
  get(url, config = null) {
    return this.instance.get(url, config);
  }
  post(url, data, config = null) {
    return this.instance.post(url, data, config);
  }
  put(url, data, config = null) {
    return this.instance.put(url, data, config);
  }
  delete(url, data, config = null) {
    return this.instance.delete(url, {
      data,
      ...config,
    });
  }
}

const http = new Http();

export default http;
