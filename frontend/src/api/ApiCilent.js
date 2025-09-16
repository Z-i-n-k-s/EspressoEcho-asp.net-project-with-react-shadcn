// src/api/ApiClient.js

import axios from "axios";


class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;

    this.client = axios.create({
      baseURL,
      withCredentials: false,//true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // this.refreshClient = axios.create({
    //   baseURL,
    //   withCredentials: true,
    //   headers: { "Content-Type": "application/json" },
    // });

    // Request interceptor (no token handling)
    // this.client.interceptors.request.use(
    //   async (config) => {
    //     return config;
    //   },
    //   (error) => Promise.reject(error)
    // );

    // Response interceptor (no token refresh)
  //   this.client.interceptors.response.use(
  //     (response) => response,
  //     async (error) => {
  //       return Promise.reject(error);
  //     }
  //   );
   }

  // Placeholder refresh method (not used now)
  // async refreshAccessToken() {
  //   throw new Error("Token refresh not implemented");
  // }
}

const apiClient = new ApiClient("http://127.0.0.1:8000");
export default apiClient;
