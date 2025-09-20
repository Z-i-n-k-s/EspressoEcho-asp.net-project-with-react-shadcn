// src/api/inventoryTransferApi.js

import apiClient from "./ApiCilent";

const inventoryTransferApi = {
  // -------------------------
  // Inventory Transfer Routes
  // -------------------------

  async requestTransfer(data) {
    const res = await apiClient.client.post("/api/inventory-transfers/request", data);
    return res.data;
  },

  async approveTransfer(transferId, approvedBy) {
    const res = await apiClient.client.post(
      `/api/inventory-transfers/${transferId}/approve`,
      { approved_by: approvedBy } 
    );
    return res.data;
  },

  async rejectTransfer(transferId, rejectedBy, reason) {
    const res = await apiClient.client.post(
      `/api/inventory-transfers/${transferId}/reject`,
      { rejected_by: rejectedBy, rejection_reason: reason } );
    return res.data;
  },

  async completeTransfer(transferId, receivedBy) {
    const res = await apiClient.client.post(
      `/api/inventory-transfers/${transferId}/complete`,
      { received_by: receivedBy } 
    );
    return res.data;
  },

  async getTransfer(transferId) {
    const res = await apiClient.client.get(`/api/inventory-transfers/${transferId}`);
    return res.data;
  },

  async listTransfers() {
    const res = await apiClient.client.get("/api/inventory-transfers");
    return res.data;
  },
};

export default inventoryTransferApi;
