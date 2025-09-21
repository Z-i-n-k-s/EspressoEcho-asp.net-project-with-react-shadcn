// src/api/adminDashboardApi.js
import apiClient from "./ApiCilent";

const adminDashboardApi = {
  // Dashboard overview
  async getDashboard() {
    const res = await apiClient.client.get("/api/dashboard");
    return res.data;
  },

  // Branches
  async getBranches() {
    const res = await apiClient.client.get("/api/branches");
    return res.data.data;
  },
  async getBranch(id) {
    const res = await apiClient.client.get(`/api/branches/${id}`);
    return res.data;
  },

  // Employees
  async getEmployees() {
    const res = await apiClient.client.get("/api/employees");
    return res.data;
  },
  async getEmployee(id) {
    const res = await apiClient.client.get(`/api/employees/${id}`);
    return res.data;
  },

  // Sales
  async getSales() {
    const res = await apiClient.client.get("/api/sales");
    return res.data;
  },

  // Promotions
  async getPromotions() {
    const res = await apiClient.client.get("/api/promotions");
    return res.data;
  },
  async getActivePromotions() {
    const res = await apiClient.client.get("/api/promotions/active");
    return res.data;
  },
  async getPromotion(id) {
    const res = await apiClient.client.get(`/api/promotions/${id}`);
    return res.data;
  },
};

export default adminDashboardApi;
