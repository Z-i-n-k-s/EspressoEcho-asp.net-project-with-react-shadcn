// src/api/productReviewApi.js
import apiClient from "./ApiClient";

const productReviewApi = {
  // -------------------------
  // Product Review Routes
  // -------------------------

  // Get reviews by product ID
  async getReviewsByProduct(productId) {
    const res = await apiClient.client.get(`/api/product-reviews/product/${productId}`);
    return res.data;
  },

  // Get reviews by customer ID
  async getReviewsByCustomer(customerId) {
    const res = await apiClient.client.get(`/api/product-reviews/customer/${customerId}`);
    return res.data;
  },

  // Create a new review
  async createReview(data) {
    const res = await apiClient.client.post("/api/product-reviews", data);
    return res.data;
  },

  // Get a single review by ID
  async getReviewById(id) {
    const res = await apiClient.client.get(`/api/product-reviews/${id}`);
    return res.data;
  },

  // Update a review
  async updateReview(id, data) {
    const res = await apiClient.client.put(`/api/product-reviews/${id}`, data);
    return res.data;
  },

  // Delete a review
  async deleteReview(id) {
    const res = await apiClient.client.delete(`/api/product-reviews/${id}`);
    return res.data;
  },

  // Get reviews by rating
  async getReviewsByRating(rating) {
    const res = await apiClient.client.get(`/api/product-reviews/rating/${rating}`);
    return res.data;
  },

  // Get high-rated reviews
  async getHighRatedReviews() {
    const res = await apiClient.client.get("/api/product-reviews/high-rated");
    return res.data;
  },

  // Get low-rated reviews
  async getLowRatedReviews() {
    const res = await apiClient.client.get("/api/product-reviews/low-rated");
    return res.data;
  },
};

export default productReviewApi;
