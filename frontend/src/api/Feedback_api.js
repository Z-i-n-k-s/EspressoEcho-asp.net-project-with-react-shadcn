// src/api/feedbackApi.js

import apiClient from "./ApiCilent";


const feedbackApi = {
  // -------------------------
  // Feedback Routes
  // -------------------------

  // Submit feedback
  async createFeedback(data) {
    const res = await apiClient.client.post("/api/feedback", data);
    return res.data;
  },

  // Get feedback by customer ID
  async getFeedbackByCustomer(customerId) {
    const res = await apiClient.client.get(`/api/feedback/customer/${customerId}`);
    return res.data;
  },

  // Get feedback by branch ID
  async getFeedbackByBranch(branchId) {
    const res = await apiClient.client.get(`/api/feedback/branch/${branchId}`);
    return res.data;
  },
   async getAllFeedbacks() {
    const res = await apiClient.client.get(`/api/feedback`);
    return res.data;
  },
};

export default feedbackApi;
