import React, { useState, useEffect } from "react";
import {Search} from "lucide-react";
import UserList from "./UserList";
import UserDetails from "./UserDetails";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  // 📡 Fetch users with registered + guest customers
  const fetchUsers = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));//simulate api delay show loading

      const data = [
        {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
          address: "123 Coffee Street",
          contact: "+1 555-1234",
          isGuest: false,
          ordersOnline: [
            {
              id: 101,
              items: [
                { name: "Cappuccino", qty: 2, price: 5 },
                { name: "Blueberry Muffin", qty: 1, price: 3 },
              ],
              bill: 13,
              time: "2025-08-10 14:32",
              status: "Delivered",
            },
          ],
          ordersBranch: [
            {
              id: 201,
              branch: "Downtown",
              items: [
                { name: "Espresso", qty: 1, price: 3 },
                { name: "Croissant", qty: 2, price: 4 },
              ],
              bill: 11,
              time: "2025-08-09 09:15",
              customerName: "John Doe",
              customerContact: "+1 555-1234",
            },
          ],
        },
        {
          id: 2,
          name: "Emily Smith",
          email: "emily@example.com",
          address: "45 Latte Avenue",
          contact: "+1 555-9876",
          isGuest: false,
          ordersOnline: [],
          ordersBranch: [
            {
              id: 202,
              branch: "Uptown",
              items: [
                { name: "Flat White", qty: 1, price: 4 },
                { name: "Chocolate Cake", qty: 1, price: 6 },
              ],
              bill: 10,
              time: "2025-08-12 16:50",
              customerName: "Emily Smith",
              customerContact: "+1 555-9876",
            },
          ],
        },

      ];
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 min-h-screen bg-gradient-to-b from-[#f5e6d3] to-[#6b4226] p-6 font-[Inter] rounded-lg shadow-inner">
      <h1 className="text-4xl font-extrabold text-[#5c4033] mb-6">
        👤 User Management
      </h1>

      {/* Search Bar */}
      <div className="flex items-center gap-2 bg-[#fffaf5] p-3 rounded-lg shadow-md">
        <Search className="text-[#6b4226]" />
        <input
          type="text"
          placeholder="Search users..."
          className="bg-transparent outline-none w-full text-[#3f2c1d]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6b4226]"></div>
          <span className="ml-3 text-[#6b4226] font-semibold">
            Loading users...
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Users List */}
          <UserList
            filteredUsers={filteredUsers}
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
          />

          {/* Selected User Details */}
          <UserDetails selectedUser={selectedUser} />
        </div>
      )}
    </div>
  );
}
