// src/api/employeeApi.js

import apiClient from "./ApiCilent";


const employeeApi = {
  // -------------------------
  // Employee Routes
  // -------------------------

  // List all employees
  async getAllEmployees() {
    const res = await apiClient.client.get("/api/employees");
    return res.data;
  },

  // Get employees by branch
  async getEmployeesByBranch(branchId) {
    const res = await apiClient.client.get(`/api/employees/branch/${branchId}`);
    return res.data;
  },

  // Get single employee by ID
  async getEmployeeById(id) {
    const res = await apiClient.client.get(`/api/employees/${id}`);
    return res.data;
  },

  // Create new employee
  async createEmployee(data) {
    const res = await apiClient.client.post("/api/employees", data);
    return res.data;
  },

  // Update employee
  async updateEmployee(id, data) {
    const res = await apiClient.client.put(`/api/employees/${id}`, data);
    return res.data;
  },

  // Delete employee
  async deleteEmployee(id, adminId) {
    const res = await apiClient.client.delete(`/api/employees/${id}`,{
      data: { admin_user_id: adminId }, 
    });
    return res.data;
  },
};

export default employeeApi;
