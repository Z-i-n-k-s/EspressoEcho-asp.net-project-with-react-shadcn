// src/api/productApi.js

import apiClient from "./ApiCilent";


const productApi = {
  // -------------------------
  // Product Routes
  // -------------------------

  // List all products
  async getAllProducts() {
    const res = await apiClient.client.get("/api/products");
    return res.data;
  },

  // Create new product
  async createProduct(data) {
    const res = await apiClient.client.post("/api/products", data);
    return res.data;
  },

  // Get single product by ID
  async getProductById(id) {
    const res = await apiClient.client.get(`/api/products/${id}`);
    return res.data;
  },

  // Update product
  async updateProduct(id, data) {
    const res = await apiClient.client.put(`/api/products/${id}`, data);
    return res.data;
  },

  // Delete product
  async deleteProduct(id) {
    const res = await apiClient.client.delete(`/api/products/${id}`);
    return res.data;
  },
};

export default productApi;
