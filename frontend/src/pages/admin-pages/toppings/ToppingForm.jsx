import React, { useState } from "react";
import { Plus, Edit } from "lucide-react";
import toppingApi from "@/api/Toppings_api";
import { useSelector } from "react-redux";



export default function ToppingForm({
  formData,
  setFormData,
  setToppings,
  toppings,
  editingId,
  setEditingId,
}) {
  const user = useSelector((state) => state.user.user);
  const [loading, setLoading] = useState(false);
 const employeeId = user.id

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let saved;
      if (editingId) {
        saved = await toppingApi.updateTopping(editingId, formData);
        setToppings(
          toppings.map((t) => (t.id === editingId ? saved.data : t))
        );
        setEditingId(null);
      } else {
        saved = await toppingApi.createTopping(formData);
        setToppings([...toppings, saved.data]);
      }

      setFormData({
        name: "",
        description: "",
        price: "",
        is_active: true,
        created_by: employeeId, 
      });
    } catch (err) {
      console.error("Failed to save topping:", err);
      alert("Failed to save topping");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#fff8f1] p-6 rounded-2xl shadow-lg border border-[#e7dcd3] space-y-4"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Topping Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          className="p-2 border rounded-lg"
        />
        <input
          type="number"
          placeholder="Price"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          required
          className="p-2 border rounded-lg"
        />
        <input
          type="text"
          placeholder="Description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="p-2 border rounded-lg col-span-2"
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.is_active}
            onChange={(e) =>
              setFormData({ ...formData, is_active: e.target.checked })
            }
          />
          Active
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-[#6b4226] hover:bg-[#5c3620] text-white px-4 py-2 rounded-lg flex items-center gap-2"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            Saving...
          </>
        ) : editingId ? (
          <>
            <Edit size={16} />
            Update Topping
          </>
        ) : (
          <>
            <Plus size={16} />
            Add Topping
          </>
        )}
      </button>
    </form>
  );
}
