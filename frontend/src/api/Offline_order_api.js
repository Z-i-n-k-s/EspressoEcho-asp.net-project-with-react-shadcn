// src/api/offlineOrdersApi.js

import apiClient from "./ApiCilent";


const offlineOrdersApi = {
  // -------------------------
  // Offline Order Routes
  // -------------------------

  // Get all offline orders
  async getAllOrders(params) {
    const res = await apiClient.client.get("/api/pos/orders", { params });
    return res.data;
  },

  // Create a new offline order
  async createOrder(data) {
    const res = await apiClient.client.post("/api/pos/orders", data);
    return res.data;
  },

  // Get offline orders by cashier ID
  async getOrdersByCashier(cashierId) {
    const res = await apiClient.client.get(`/api/pos/orders/cashier/${cashierId}`);
    return res.data;
  },
};

export default offlineOrdersApi;
