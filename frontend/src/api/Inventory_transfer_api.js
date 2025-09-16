// src/api/inventoryTransferApi.js

import apiClient from "./ApiCilent";


const inventoryTransferApi = {
  // -------------------------
  // Inventory Transfer Routes
  // -------------------------

  // Request a new transfer
  async requestTransfer(data) {
    const res = await apiClient.client.post("/api/inventory-transfers/request", data);
    return res.data;
  },

  // Approve a transfer
  async approveTransfer(transferId) {
    const res = await apiClient.client.post(`/api/inventory-transfers/${transferId}/approve`);
    return res.data;
  },

  // Reject a transfer
  async rejectTransfer(transferId) {
    const res = await apiClient.client.post(`/api/inventory-transfers/${transferId}/reject`);
    return res.data;
  },

  // Complete a transfer
  async completeTransfer(transferId) {
    const res = await apiClient.client.post(`/api/inventory-transfers/${transferId}/complete`);
    return res.data;
  },

  // Get a single transfer by ID
  async getTransfer(transferId) {
    const res = await apiClient.client.get(`/api/inventory-transfers/${transferId}`);
    return res.data;
  },

  // List all transfers
  async listTransfers() {
    const res = await apiClient.client.get("/api/inventory-transfers");
    return res.data;
  },
};

export default inventoryTransferApi;
