import { User, UserX } from 'lucide-react'
import React from 'react'

export default function UserList({ filteredUsers, selectedUser, setSelectedUser }) {
  return (
    <div className="bg-[#fffaf5] p-6 rounded-2xl shadow-lg border border-[#e7dcd3] overflow-y-auto max-h-[75vh]">
            <h2 className="text-lg font-semibold text-[#5c4033] mb-3">
              All Customers
            </h2>
            <ul className="space-y-3 ">
              {filteredUsers.length === 0 ? (
                <p className="text-[#7b5e4b] italic">No customers found</p>
              ) : (
                filteredUsers.map((user) => (
                  <li
                    key={user.id}
                    className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 transform ${
                      selectedUser?.id === user.id
                        ? "bg-[#e8d8c3] border-[#c19a6b] scale-[1.02] shadow-lg"
                        : "bg-[#fffaf5] border-[#e7dcd3] hover:bg-[#f7efe7] hover:scale-[1.02] hover:shadow-lg"
                    }`}
                    onClick={() => setSelectedUser(user)}
                  >
                    <div className="flex items-center gap-3">
                        <User className="text-[#6b4226]" />
                      <div>
                        <p className="font-semibold text-[#3f2c1d] truncate">
                          {user.name} 
                        </p>
                        <p className="text-sm text-[#7b5e4b] truncate">
                          {user.email || "No email"}
                        </p>
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
  )
}
