import React, { useEffect, useState } from "react";
import { ArrowRightLeft, ClipboardList } from "lucide-react";
import branchApi from "@/api/Branch_api";
import inventoryTransferApi from "@/api/Inventory_transfer_api";
import employeeApi from "@/api/Employee_api";
import { useSelector } from "react-redux";
export default function TransferForm() {
  const [managerBranchId, setManagerBranchId] = useState("");
  const [fromBranches, setFromBranches] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [formData, setFormData] = useState({
    fromBranchId: "",
    productId: "",
    quantity: "",
    reason: "",
  });
 const user = useSelector((state) => state.user.user);
// not user id employee id from employee table
const employeeId = user.employee.id;
const userId = user.id;
  // Fetch manager branch
  useEffect(() => {
    async function fetchManagerBranch() {
      try {
        const res = await employeeApi.getEmployeeById(employeeId);
        const branchId = res?.data?.branch_id || res?.branch_id;
        setManagerBranchId(branchId);
        console.log("Manager branch ID:", branchId);
      } catch (err) {
        console.error("Failed to fetch manager branch:", err);
      }
    }
    fetchManagerBranch();
  }, []);

  // Fetch branches for "From" (exclude manager’s own branch)
  useEffect(() => {
    async function fetchBranches() {
      try {
        const res = await branchApi.getAllBranches();
        const branches = Array.isArray(res?.data) ? res.data : res;
        setFromBranches(branches.filter((b) => b.id !== managerBranchId));
      } catch (err) {
        console.error("Failed to fetch branches:", err);
        setFromBranches([]);
      }
    }
    fetchBranches();
  }, [managerBranchId]);

  // Fetch inventory for selected "From" branch
  useEffect(() => {
    async function fetchInventory() {
      if (!formData.fromBranchId) {
        setInventory([]);
        return;
      }
      try {
        const res = await branchApi.getInventoryByBranch(formData.fromBranchId);
        console.log("Inventory API response:", res);
        const inv = Array.isArray(res?.data) ? res.data : res;
        setInventory(inv || []);
      } catch (err) {
        console.error("Failed to fetch inventory:", err);
        setInventory([]);
      }
    }
    fetchInventory();
  }, [formData.fromBranchId]);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle transfer request
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fromBranchId || !formData.productId || !formData.quantity) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      await inventoryTransferApi.requestTransfer({
        from_branch_id: formData.fromBranchId,
        to_branch_id: managerBranchId, // manager’s branch is always "To"
        items: [
          {
            product_id: formData.productId,
            quantity: parseInt(formData.quantity, 10),
          },
        ],
        reason: formData.reason,
        requested_by: userId,
      });

      alert("Transfer request submitted!");
      setFormData({ fromBranchId: "", productId: "", quantity: "", reason: "" });
      setInventory([]);
    } catch (err) {
      console.error("Transfer request failed:", err);
      alert("Failed to submit transfer request.");
    }
  };

  return (
    <div className="bg-[#fff8f1] p-6 rounded-2xl shadow-md border border-[#e7dcd3]">
      <h2 className="text-lg font-semibold text-[#5c4033] mb-4 flex items-center gap-2">
        <ArrowRightLeft className="text-[#6b4226]" /> Request Transfer
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* From Branch */}
        <div>
          <label className="block text-sm font-medium text-[#5c4033] mb-1">
            From Branch
          </label>
          <select
            name="fromBranchId"
            value={formData.fromBranchId}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            required
          >
            <option value="">-- Select Branch --</option>
            {fromBranches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
        </div>

        {/* Item (from selected branch) */}
        <div>
          <label className="block text-sm font-medium text-[#5c4033] mb-1">
            Item
          </label>
          <select
            name="productId"
            value={formData.productId}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            required
            disabled={!formData.fromBranchId}
          >
            <option value="">
              {formData.fromBranchId
                ? "-- Select Item --"
                : "Select a From Branch first"}
            </option>
            {Array.isArray(inventory) &&
              inventory.map((item) => (
                <option key={item.product_id} value={item.product_id}>
                  {item.product_name} (Qty: {item.quantity_on_hand})
                </option>
              ))}
          </select>
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm font-medium text-[#5c4033] mb-1">
            Quantity
          </label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            min="1"
            className="w-full border rounded-lg p-2"
            required
            disabled={!formData.productId}
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-[#5c4033] mb-1">
            Reason (optional)
          </label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-[#6b4226] text-white py-2 px-4 rounded-lg hover:bg-[#5c4033] flex items-center justify-center gap-2"
        >
          <ClipboardList size={16} /> Submit Transfer
        </button>
      </form>
    </div>
  );
}
