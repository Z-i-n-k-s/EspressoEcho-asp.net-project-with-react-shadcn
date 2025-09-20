import React, { useEffect, useState, useRef } from "react";
import { Loader, XCircle } from "lucide-react";
import productApi from "@/api/Product_api";
import categoryApi from "@/api/Catergory_api";
import { useSelector } from "react-redux";

const CLOUDINARY_UPLOAD_PRESET = "coffee_shop";
const CLOUDINARY_CLOUD_NAME = "dy5eozkhz";

export default function ProductDialog({
  isAddMode,
  currentItem,
  setCurrentItem,
  setShowDialog,
  setCurrentInventory,
}) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryApi.getAllCategories();
        const cats = Array.isArray(res.data) ? res.data : [];
        setCategories(cats);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch categories.");
      }
    };
    fetchCategories();
  }, []);

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );
      const data = await res.json();
      return data.secure_url;
    } catch (err) {
      console.error("Cloudinary upload failed:", err);
      return null;
    }
  };

  const saveItem = async () => {
    if (!currentItem?.name || !currentItem?.category) {
      alert("Please select category and enter item name");
      return;
    }

    setLoading(true);
    let imageUrl = currentItem.image_url || null;

    if (currentItem.imageFile) {
      const uploadedUrl = await uploadToCloudinary(currentItem.imageFile);
      if (!uploadedUrl) {
        setLoading(false);
        alert("Image upload failed");
        return;
      }
      imageUrl = uploadedUrl;
    }
     const user = useSelector((state) => state.user.user);

    const payload = {
      name: currentItem.name.trim(),
      description: currentItem.description || "",
      base_price: parseFloat(currentItem.base_price) || 0,
      category_id: categories.find((c) => c.name === currentItem.category)?.id,
      image_url: imageUrl,
      created_by: user.id,
    };

    try {
      let res;
      if (isAddMode) {
        res = await productApi.createProduct(payload);
        setCurrentInventory((prev) => [...prev, res.data]);
      } else {
        res = await productApi.updateProduct(currentItem.id, payload);
        setCurrentInventory((prev) =>
          prev.map((p) => (p.id === res.data.id ? res.data : p))
        );
      }
      setShowDialog(false);
      // Auto-refresh page
      window.location.reload();
    } catch (err) {
      console.error("Failed to save product:", err);
      alert("Failed to save product.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
     <div className="absolute inset-0 bg-[url('/bg2.jpg')] bg-cover bg-center blur-sm"></div>
      <div className="relative bg-[#fffaf5] p-6 rounded-2xl shadow-lg w-[600px] max-w-[90vw] max-h-[90vh] overflow-y-auto border border-[#e7dcd3]">
        <h2 className="text-2xl font-bold text-[#5c4033] mb-6">
          {isAddMode ? "Add New Product" : "Edit Product"}
        </h2>

        {/* Category */}
        <div className="mb-4">
          <label className="block mb-2 font-semibold text-[#5c4033]">Category</label>
          <select
            value={currentItem?.category || ""}
            onChange={(e) =>
              setCurrentItem({ ...currentItem, category: e.target.value })
            }
            className="w-full p-2 border rounded-lg"
          >
            <option value="" disabled>Select category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Name */}
        <div className="mb-4">
          <label className="block mb-2 font-semibold text-[#5c4033]">Item Name</label>
          <input
            type="text"
            value={currentItem?.name || ""}
            onChange={(e) =>
              setCurrentItem({ ...currentItem, name: e.target.value })
            }
            className="w-full p-2 border rounded-lg"
          />
        </div>

        {/* Base Price */}
        <div className="mb-4">
          <label className="block mb-2 font-semibold text-[#5c4033]">Base Price</label>
          <input
            type="number"
            min="0"
            value={currentItem?.base_price || ""}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              setCurrentItem({ ...currentItem, base_price: isNaN(value) ? "" : value });
            }}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block mb-2 font-semibold text-[#5c4033]">Description</label>
          <textarea
            value={currentItem?.description || ""}
            onChange={(e) =>
              setCurrentItem({ ...currentItem, description: e.target.value })
            }
            className="w-full p-2 border rounded-lg"
            rows={3}
          />
        </div>

        {/* Product Image */}
        <div className="col-span-2 mb-4">
          <label className="block mb-2 font-semibold text-[#5c4033]">Product Image</label>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const imageUrl = URL.createObjectURL(file);
                setCurrentItem({
                  ...currentItem,
                  image_url: imageUrl,
                  imageFile: file,
                });
                e.target.value = null;
              }
            }}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-blue-200 hover:bg-blue-300 text-blue-900 rounded-lg shadow"
          >
            + Add Image
          </button>

          {currentItem?.image_url && (
            <div className="relative mt-3 w-28 h-28 group">
              <img
                src={currentItem.image_url}
                alt="Product Preview"
                className="w-full h-full object-cover rounded-lg border"
              />
              <button
                type="button"
                onClick={() =>
                  setCurrentItem({ ...currentItem, image_url: null, imageFile: null })
                }
                className="absolute -top-2 -right-2 bg-white rounded-full shadow p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remove Image"
              >
                <XCircle className="text-red-500 hover:text-red-600" size={20} />
              </button>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => setShowDialog(false)}
            disabled={loading}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={saveItem}
            disabled={loading}
            className="px-4 py-2 bg-green-200 text-green-800 rounded-lg hover:bg-green-300"
          >
            {loading && <Loader className="animate-spin" size={16} />}
            {isAddMode ? "Add" : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}
