// src/api/managerDashboardApi.js

import apiClient from "./ApiCilent";

const managerDashboardApi = {
  // Fetch the manager dashboard data
  async getDashboardData() {
    const res = await apiClient.client.get("/api/manager/dashboard");
    return res.data;
  }
};

export default managerDashboardApi;
