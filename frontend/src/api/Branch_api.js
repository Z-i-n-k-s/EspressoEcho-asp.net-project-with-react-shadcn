// src/api/branchApi.js

import apiClient from "./ApiCilent";

const branchApi = {
  // -------------------------
  // Branch Routes
  // -------------------------

  // List all branches
  async getAllBranches() {
    const res = await apiClient.client.get("/api/branches");
    return res.data;
  },

  // Create new branch
  async createBranch(data) {
    const res = await apiClient.client.post("/api/branches", data);
    return res.data;
  },

  // Get a single branch by ID
  async getBranchById(id) {
    const res = await apiClient.client.get(`/api/branches/${id}`);
    return res.data;
  },

  // Full update of a branch
  async updateBranch(id, data) {
    const res = await apiClient.client.put(`/api/branches/${id}`, data);
    return res.data;
  },

  // Partial update of a branch
  async patchBranch(id, data) {
    const res = await apiClient.client.patch(`/api/branches/${id}`, data);
    return res.data;
  },

  // Soft delete a branch
  async deleteBranch(id) {
    const res = await apiClient.client.delete(`/api/branches/${id}`);
    return res.data;
  },

  // Restore a soft-deleted branch
  async restoreBranch(id) {
    const res = await apiClient.client.post(`/api/branches/${id}/restore`);
    return res.data;
  },

  // Get categories by branch
  async getCategoriesByBranch(branchId) {
    const res = await apiClient.client.get(`/api/branches/${branchId}/categories`);
    return res.data;
  },

  // Get inventory by branch
  async getInventoryByBranch(branchId) {
    const res = await apiClient.client.get(`/api/branches/${branchId}/inventory`);
    return res.data;
  },
};

export default branchApi;
