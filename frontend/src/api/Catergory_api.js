// src/api/categoryApi.js

import apiClient from "./ApiCilent";


const categoryApi = {
  // -------------------------
  // Category Routes
  // -------------------------

  // List all categories
  async getAllCategories() {
    const res = await apiClient.client.get("/api/categories");
    return res.data;
  },

  // Create new category
  async createCategory(data) {
    const res = await apiClient.client.post("/api/categories", data);
    return res.data;
  },

  // Get a single category by ID
  async getCategoryById(id) {
    const res = await apiClient.client.get(`/api/categories/${id}`);
    return res.data;
  },

  // Update category
  async updateCategory(id, data) {
    const res = await apiClient.client.put(`/api/categories/${id}`, data);
    return res.data;
  },

  // Delete category
  async deleteCategory(id) {
    const res = await apiClient.client.delete(`/api/categories/${id}`);
    return res.data;
  },

  // Assign/Manage category to a branch
  async manageBranchAssignment(id, data) {
    const res = await apiClient.client.post(`/api/categories/${id}/branches`, data);
    return res.data;
  },
};

export default categoryApi;
