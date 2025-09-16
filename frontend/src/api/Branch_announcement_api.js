// src/api/branchAnnouncementApi.js

import apiClient from "./ApiCilent";


const branchAnnouncementApi = {
  // -------------------------
  // Branch Announcement Routes
  // -------------------------

  // Get all announcements
  async getAll() {
    const res = await apiClient.client.get("/api/branch-announcements");
    return res.data;
  },

  // Create a new announcement
  async create(data) {
    const res = await apiClient.client.post("/api/branch-announcements", data);
    return res.data;
  },

  // Get announcement by ID
  async getById(id) {
    const res = await apiClient.client.get(`/api/branch-announcements/${id}`);
    return res.data;
  },

  // Update announcement
  async update(id, data) {
    const res = await apiClient.client.put(`/api/branch-announcements/${id}`, data);
    return res.data;
  },

  // Delete announcement
  async delete(id) {
    const res = await apiClient.client.delete(`/api/branch-announcements/${id}`);
    return res.data;
  },

  // Get announcements by branch ID
  async getByBranch(branchId) {
    const res = await apiClient.client.get(`/api/branch-announcements/branch/${branchId}`);
    return res.data;
  },

  // Bulk update status of announcements
  async bulkUpdateStatus(data) {
    const res = await apiClient.client.post("/api/branch-announcements/bulk/status", data);
    return res.data;
  },
};

export default branchAnnouncementApi;
