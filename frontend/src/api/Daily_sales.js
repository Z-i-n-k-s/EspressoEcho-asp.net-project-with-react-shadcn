// src/api/dailySalesReportApi.js

import apiClient from "./ApiCilent";

const dailySalesReportApi = {
  // Get daily sales report
  async getDailyReport(date) {
    const res = await apiClient.client.get("/api/manager/daily-sales-report", {
      params: { date }
    });
    return res.data;
  }
};

export default dailySalesReportApi;
