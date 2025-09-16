// src/api/promotionsApi.js

import apiClient from "./ApiCilent";


const promotionsApi = {
  // -------------------------
  // Promotion Routes
  // -------------------------

  // List all promotions
  async getAllPromotions() {
    const res = await apiClient.client.get("/api/promotions");
    return res.data;
  },

  // Create new promotion
  async createPromotion(data) {
    const res = await apiClient.client.post("/api/promotions", data);
    return res.data;
  },

  // Get single promotion by ID
  async getPromotionById(id) {
    const res = await apiClient.client.get(`/api/promotions/${id}`);
    return res.data;
  },

  // Update promotion
  async updatePromotion(id, data) {
    const res = await apiClient.client.put(`/api/promotions/${id}`, data);
    return res.data;
  },

  // Soft delete promotion
  async deletePromotion(id) {
    const res = await apiClient.client.delete(`/api/promotions/${id}`);
    return res.data;
  },

  // Restore soft-deleted promotion
  async restorePromotion(id) {
    const res = await apiClient.client.post(`/api/promotions/${id}/restore`);
    return res.data;
  },

  // Force delete promotion
  async forceDeletePromotion(id) {
    const res = await apiClient.client.delete(`/api/promotions/${id}/force`);
    return res.data;
  },
};

export default promotionsApi;
