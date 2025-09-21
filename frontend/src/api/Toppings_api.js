// src/api/toppingApi.js
import apiClient from "./ApiCilent";

const toppingApi = {
  // Get all toppings
  async getAllToppings() {
    const res = await apiClient.client.get("/api/toppings");
    return res.data;
  },

  // Create a new topping
  async createTopping(data) {
    const res = await apiClient.client.post("/api/toppings", data);
    return res.data;
  },

  // Get a topping by ID
  async getToppingById(id) {
    const res = await apiClient.client.get(`/api/toppings/${id}`);
    return res.data;
  },

  // Update topping
  async updateTopping(id, data) {
    const res = await apiClient.client.put(`/api/toppings/${id}`, data);
    return res.data;
  },

  // Delete topping
  async deleteTopping(id) {
    const res = await apiClient.client.delete(`/api/toppings/${id}`);
    return res.data;
  },

  // Assign topping to product
  async assignToProduct(toppingId, productId, isDefault = false, createdBy) {
    const res = await apiClient.client.post(
      `/api/toppings/${toppingId}/assign-to-product/${productId}`,
      { is_default: isDefault, created_by: createdBy }
    );
    return res.data;
  },

  // Remove topping from product
  async removeFromProduct(toppingId, productId) {
    const res = await apiClient.client.delete(
      `/api/toppings/${toppingId}/remove-from-product/${productId}`
    );
    return res.data;
  },

  // Get toppings assigned to a product
  async getToppingsByProduct(productId) {
    const res = await apiClient.client.get(`/api/toppings/by-product/${productId}`);
    return res.data;
  },

  // Get all products assigned to a topping
  async getProductsByTopping(toppingId) {
    const res = await apiClient.client.get(`/api/toppings/${toppingId}/products`);
    return res.data;
  },
};

export default toppingApi;
