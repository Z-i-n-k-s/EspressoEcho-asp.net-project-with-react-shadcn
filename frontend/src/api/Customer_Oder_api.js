// src/api/ordersApi.js

import apiClient from "./ApiCilent";


const ordersApi = {
  // -------------------------
  // Order Resource Routes
  // -------------------------

  // List all orders
  async getAllOrders() {
    const res = await apiClient.client.get("/api/orders");
    return res.data;
  },

  // Create a new order
  async createOrder(data) {
    const res = await apiClient.client.post("/api/orders", data);
    return res.data;
  },

  // Get single order by ID
  async getOrderById(id) {
    const res = await apiClient.client.get(`/api/orders/${id}`);
    return res.data;
  },

  // Update order (full update)
  async updateOrder(id, data) {
    const res = await apiClient.client.put(`/api/orders/${id}`, data);
    return res.data;
  },

  // Delete order
  async deleteOrder(id) {
    const res = await apiClient.client.delete(`/api/orders/${id}`);
    return res.data;
  },

  // -------------------------
  // Status & Delivery
  // -------------------------

  // Update status
  async updateStatus(id, data) {
    const res = await apiClient.client.patch(`/api/orders/${id}/status`, data);
    return res.data;
  },

  // Assign delivery
  async assignDelivery(id, data) {
    const res = await apiClient.client.post(`/api/orders/${id}/assign-delivery`, data);
    return res.data;
  },

  // -------------------------
  // Cancellation Flows
  // -------------------------

  // Generic cancel
  async cancelOrder(id, data) {
    const res = await apiClient.client.post(`/api/orders/${id}/cancel`, data);
    return res.data;
  },

  // Customer cancel
  async customerCancelOrder(id, data) {
    const res = await apiClient.client.post(`/api/orders/${id}/customer-cancel`, data);
    return res.data;
  },

  // Cashier cancel
  async cashierCancelOrder(id, data) {
    const res = await apiClient.client.post(`/api/orders/${id}/cashier-cancel`, data);
    return res.data;
  },

  // Check cancellation eligibility
  async checkCancellationEligibility(id) {
    const res = await apiClient.client.get(`/api/orders/${id}/cancellation-eligibility`);
    return res.data;
  },

  // -------------------------
  // Customer-specific Routes
  // -------------------------

  // Customer order history
  async customerOrderHistory(customerId) {
    const res = await apiClient.client.get(`/api/customers/${customerId}/orders`);
    return res.data;
  },
};

export default ordersApi;
