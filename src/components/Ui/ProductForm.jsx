import React, { useState, useEffect } from "react";

export default function ProductForm({
  mode = "add",
  initialData = {},
  categories = [],
  units = [],
  tags = [],
  onSubmit,
  onClose,
}) {
  const [product, setProduct] = useState({
    name: "",
    category: "",
    unit: "",
    tags: [],
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setProduct({
        name: initialData.name || "",
        category: initialData.category || "",
        unit: initialData.unit || "",
        tags: initialData.tags || [],
      });
    }
  }, [mode, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagsChange = (e) => {
    const values = Array.from(e.target.selectedOptions, (o) => o.value);
    setProduct((prev) => ({ ...prev, tags: values }));
  };

  const validate = () => {
    let newErrors = {};
    if (!product.name.trim()) newErrors.name = "Product name is required";
    if (!product.category) newErrors.category = "Category is required";
    if (!product.unit) newErrors.unit = "Unit is required";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    onSubmit(product);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">
          {mode === "add" ? "Add Product" : "Edit Product"}
        </h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Product Name */}
        <div>
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={product.name}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        {/* Category */}
        <div>
          <select
            name="category"
            value={product.category}
            onChange={handleChange}
            className="w-full border rounded p-2"
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-red-500 text-sm">{errors.category}</p>
          )}
        </div>

        {/* Unit */}
        <div>
          <select
            name="unit"
            value={product.unit}
            onChange={handleChange}
            className="w-full border rounded p-2"
          >
            <option value="">Select Unit</option>
            {units.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
          {errors.unit && (
            <p className="text-red-500 text-sm">{errors.unit}</p>
          )}
        </div>

        {/* Tags */}
        <select
          name="tags"
          value={product.tags}
          onChange={handleTagsChange}
          multiple
          className="w-full border rounded p-2"
        >
          {tags.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className={`px-4 py-2 rounded text-white ${
            mode === "add" ? "bg-blue-500" : "bg-green-500"
          }`}
        >
          {mode === "add" ? "Save Product" : "Update Product"}
        </button>
      </form>
    </div>
  );
}
