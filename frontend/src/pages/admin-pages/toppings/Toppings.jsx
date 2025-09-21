import productApi from "@/api/Product_api";
import toppingApi from "@/api/Toppings_api";
import React, { useEffect, useState } from "react";
import ToppingForm from "./ToppingForm";
import ToppingTable from "./ToppingTable";
import { useSelector } from "react-redux";


export default function Toppings() {
  const user = useSelector((state) => state.user.user);
  
 const employeeId = user.id
  const [toppings, setToppings] = useState([]);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    is_active: true,
    created_by: employeeId, 
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const toppingsRes = await toppingApi.getAllToppings();
        setToppings(Array.isArray(toppingsRes) ? toppingsRes : toppingsRes.data);

        const productsRes = await productApi.getAllProducts();
        setProducts(Array.isArray(productsRes) ? productsRes : productsRes.data);
      } catch (err) {
        console.error("Failed to load toppings/products:", err);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6 min-h-screen bg-gradient-to-b from-[#f5e6d3] to-[#6b4226] p-6 font-[Inter] rounded-lg shadow-inner">
      <h1 className="text-3xl font-extrabold text-[#5c4033]">🍩 Toppings Management</h1>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6b4226]"></div>
          <span className="ml-3 text-[#6b4226] font-semibold">
            Loading toppings page...
          </span>
        </div>
      ) : (
        <>
          <ToppingForm
            formData={formData}
            setFormData={setFormData}
            toppings={toppings}
            setToppings={setToppings}
            editingId={editingId}
            setEditingId={setEditingId}
          />
          <ToppingTable
            toppings={toppings}
            setFormData={setFormData}
            setEditingId={setEditingId}
            setToppings={setToppings}
            products={products}
          />
        </>
      )}
    </div>
  );
}
