// src/api/adminMonthlyReportApi.js

import apiClient from "./ApiCilent";


const adminMonthlyReportApi = {
  async getMonthlyReport(branchId, month) {
    const res = await apiClient.client.get("/api/admin/monthly-report", {
      params: { branch_id: branchId, month }
    });
    return res.data;
  }
};

export default adminMonthlyReportApi;
