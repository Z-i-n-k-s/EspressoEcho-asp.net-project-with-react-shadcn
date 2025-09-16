// src/api/inventoryApi.js

import apiClient from "./ApiCilent";


const inventoryApi = {
  // -------------------------
  // Inventory Routes
  // -------------------------

  // Adjust inventory (single item update)
  async adjustInventory(data) {
    const res = await apiClient.client.post("/api/inventory/adjust", data);
    return res.data;
  },

  // Bulk update inventory (multiple items)
  async bulkUpdate(data) {
    const res = await apiClient.client.post("/api/inventory/bulk-update", data);
    return res.data;
  },
};

export default inventoryApi;
