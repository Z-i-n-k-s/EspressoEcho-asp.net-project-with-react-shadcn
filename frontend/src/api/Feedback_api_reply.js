// src/api/feedbackReplyApi.js

import apiClient from "./ApiCilent";


const feedbackReplyApi = {
  // -------------------------
  // Feedback Reply Routes
  // -------------------------

  // List all replies for a given feedback
  async getRepliesByFeedback(feedbackId) {
    const res = await apiClient.client.get(`/api/feedback-replies/feedback/${feedbackId}`);
    return res.data;
  },

  // Create a new reply
  async createReply(data) {
    const res = await apiClient.client.post("/api/feedback-replies", data);
    return res.data;
  },

  // Get a single reply by ID
  async getReplyById(id) {
    const res = await apiClient.client.get(`/api/feedback-replies/${id}`);
    return res.data;
  },

  // Update a reply
  async updateReply(id, data) {
    const res = await apiClient.client.put(`/api/feedback-replies/${id}`, data);
    return res.data;
  },

  // Delete a reply
  async deleteReply(id) {
    const res = await apiClient.client.delete(`/api/feedback-replies/${id}`);
    return res.data;
  },

  // Get replies by role
  async getRepliesByRole(role) {
    const res = await apiClient.client.get(`/api/feedback-replies/role/${role}`);
    return res.data;
  },

  // Get replies by responder ID
  async getRepliesByResponder(responderId) {
    const res = await apiClient.client.get(`/api/feedback-replies/responder/${responderId}`);
    return res.data;
  },
};

export default feedbackReplyApi;
