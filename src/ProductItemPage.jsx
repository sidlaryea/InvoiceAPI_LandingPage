// InventoryManagementPage.jsx
import React, { useState, useEffect,useCallback } from 'react';
import axios from 'axios';
import { Card, CardContent } from "./components/Ui/card";
import { Input } from "./components/Ui/card";
import { Button } from "./components/Ui/card";
import { Table, TableHead, TableBody, TableRow, TableCell } from "./components/Ui/table";
import { Plus, Box, X, Edit3, Trash2, Save } from 'lucide-react';
import DashboardLayout from "./components/DashboardLayout";
import AddCategoryModal from "./components/AddCategoryModal";
import AddUnitModal from "./components/AddUnitModal";
import AddTagModal from "./components/AddTagModel";
import AddUpcModal from "./components/AddUPCModal";
import Pagination from "./components/Ui/pagination";
import { useApiInterceptor } from "./components/Hooks/useApiInterceptor";

export default function InventoryManagementPage() {
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);



  
  const [categories, setCategories] = useState([]);
  const [units, setUnits] = useState([]);
  const [tags, setTags] = useState([]);
  // const [upcs, setUpcs] = useState([]);

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  
  const [showUnitModal, setShowUnitModal] = useState(false);
  const [showTagModal, setShowTagModal] = useState(false);
  const [showUpcModal, setShowUpcModal] = useState(false);

  //Pagination Constants
const [currentPage, setCurrentPage] = useState(1);
const productsPerPage = 5; // Change this to however many rows you want
const indexOfLastProduct = currentPage * productsPerPage;
const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  
  // Dashboard Layout states (copied from GenerateInvoicePage)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isChangeImageDialogOpen, setIsChangeImageDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isChangePasswordDialogOpen, setIsChangePasswordDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("./user-placeholder.png");


const initialProductState = {
  name: "",
  price: 0,
  description: "",
  categoryId: "",
  unitId: "",
  tagId: "",
  upcCode: "",
  skuCode: "",
  productImage: null,
  isActive: true
};

  //for editing and update purposes
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("add"); // "add" or "edit"
  const [currentProduct, setCurrentProduct] = useState(initialProductState);

  
  

  // Dashboard Layout functions (copied from GenerateInvoicePage)
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
  const openChangeImageDialog = () => setIsChangeImageDialogOpen(true);
  const closeChangeImageDialog = () => setIsChangeImageDialogOpen(false);
  const openChangePasswordDialog = () => setIsChangePasswordDialogOpen(true);
  const closeChangePasswordDialog = () => {
    setIsChangePasswordDialogOpen(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
  };




  const handleChange = (e) => {
    {
    const { name, value, type, checked, files } = e.target;
    setCurrentProduct((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "file"
          ? files[0]
          : value
    }));
  };
  };

  const country = localStorage.getItem('country');
  const countryCode = localStorage.getItem('countryCode');

  // Flag helper function
  const getFlagEmoji = (code) => {
    return code
      ?.toUpperCase()
      .replace(/./g, char => String.fromCodePoint(127397 + char.charCodeAt()));
  };

  //for image upload old and new image //
   const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };
  const handleUpload = async () => {
    if (!selectedFile) return alert("Please select a file first.");
    const token = localStorage.getItem("jwtToken");
    const formData = new FormData();
    formData.append("imageFile", selectedFile);

    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/Register/update-profile-image`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        },
      });
      alert("Profile image updated!");
      fetchUserProfile();
      closeChangeImageDialog();
    } catch (error) {
      alert("Upload failed: " + (error.response?.data?.message || error.message));
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      alert("All fields are required.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      alert("New passwords do not match.");
      return;
    }
    const token = localStorage.getItem("jwtToken");
    
    if (!token) {
      setError("Authentication token not found.");
      return;
    }

    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/Register/update-password`, {
        currentPassword,
        newPassword,
        confirmPassword: newPassword,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });
      alert("Password changed successfully!");
      closeChangePasswordDialog();
    } catch (error) {
      alert("Error: " + (error.response?.data?.message || error.message));
    }
  };

  const fetchUserProfile = async () => {
    const token = localStorage.getItem("jwtToken");
    
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/Register/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const { profileImageUrl } = res.data;
      setProfileImageUrl(`${import.meta.env.VITE_API_URL}/${profileImageUrl.replace(/\\/g, '/')}`);
    } catch (err) {
      console.error("Failed to fetch user profile", err);
    }
  };

  const handleSignOut = () => {
    localStorage.clear();
    window.location.replace("/InvoiceAPI_LandingPage/login");
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };
///End of NavBar Options/////////


  // Product management functions
  const fetchProducts = useCallback (async () => { 
    try {
      const token = localStorage.getItem("jwtToken");
      const apiKey = localStorage.getItem("apiKey");
      const userId = localStorage.getItem("userId");
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/Product/user/${userId}`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "X-Api-Key": apiKey,
          "Content-Type": "application/json"
      }
      });
      
      setProducts(res.data);
      setFilteredProducts(res.data);
      console.log("Fetched product:", res.data[0]);
      
    } catch (error) {
      console.error("Error fetching products:", error);
      
      
      showNotification("Failed to fetch products", "error");
    }
  
  
  }, []);

// When user clicks Add Product button
  const openAddForm = () => {
    setFormMode("add");
    setCurrentProduct(initialProductState);
    setIsFormOpen(true);
  };



  //Function to Add Product
  const handleAddProduct = async () => {
    
    
    setIsFormOpen(false);
  
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem("jwtToken");
      const apiKey = localStorage.getItem("apiKey");

      if (!token || !apiKey) {
        alert("Please log in and ensure your API key is available.");
        return;
      }
          // Prepare form data for multipart/form-data
        const formData = new FormData();
        formData.append("Name", currentProduct.name);
        formData.append("Description", currentProduct.description);
        formData.append("Price", parseFloat(currentProduct.price));
        formData.append("ProductCategoryId", currentProduct.categoryId || "");
        formData.append("ProductUnitId", currentProduct.unitId || "");
        formData.append("ProductTagId", currentProduct.tagId || "");
        //formData.append("ProductCurrencyId", newProduct.currencyId || "");
        formData.append("Upccode", currentProduct.upcCode || "");
        formData.append("SKU", currentProduct.skuCode || "");
        formData.append("IsActive", currentProduct.isActive);

    // Append file (if selected)
    if (currentProduct.productImage) {
      formData.append("ImageUrl", currentProduct.productImage); // must match DTO property
    }

      //Send request to server
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/product`, formData, 
        {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Api-Key": apiKey,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200 || response.status === 201) {
        showNotification("Product added successfully!", "success");
        setCurrentProduct(initialProductState);
        //openAddForm(false);
        fetchProducts(); // Refresh the product list
      }
    } catch (error) {
      console.error("Error adding product:", error);
      showNotification("Failed to add product", "error");
    } finally {
      setLoading(false);
    }
  };

// When user clicks Edit button
  const openEditForm = (product) => {
    setFormMode("edit");
    // Map API field names to form field names
  const mappedProduct = {
    id: product.id,
    userId: product.userId || "",
    name: product.name,
    price: product.price,
    description: product.description,
    categoryId: product.productCategoryId ??  "",
    unitId: product.productUnitId ?? "",
    tagId: product.productTagId ?? "",
    upcCode: product.upccode ?? "",
    skuCode: product.sku ?? "",
    isActive: product.isActive,
    productImage: product.imageUrl ?? null, // Reset image for new upload
  };

    setCurrentProduct(mappedProduct);
    
    setIsFormOpen(true);
  };

  


//Function to Delete Product
  const handleDeleteProduct = async (productId) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const token = localStorage.getItem("jwtToken");
      const apiKey = localStorage.getItem("apiKey");

      await axios.delete(`${import.meta.env.VITE_API_URL}/api/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Api-Key": apiKey,
        }
      });

      showNotification("Product deleted successfully!", "success");
      fetchProducts(); // Refresh the product list
    } catch (error) {
      console.error("Error deleting product:", error);
      showNotification("Failed to delete product", "error");
    }
  };
////End Of Handle Delete

// Function to Update Product////////////////////////////////////////////////////////////////////////////
const handleUpdateProduct = async () => {
  setLoading(true);
  setError(null);
  setSuccess(null);

  try {
    const token = localStorage.getItem("jwtToken");
    const apiKey = localStorage.getItem("apiKey");
    if (!token || !apiKey) {
      alert("Please log in and ensure your API key is available.");
      setLoading(false);
      return;
    }

    // Decide whether to send JSON (no file) or FormData (file included)
    const hasFile = currentProduct.productImage instanceof File;

    if (hasFile) {
      const fd = new FormData();
      fd.append("Id", currentProduct.id);
      if (currentProduct.userId) fd.append("UserId", currentProduct.userId);
      fd.append("Name", currentProduct.name || "");
      fd.append("Description", currentProduct.description || "");
      fd.append("Price", (currentProduct.price || 0).toString());

      if (currentProduct.categoryId) fd.append("ProductCategoryId", currentProduct.categoryId);
      if (currentProduct.unitId) fd.append("ProductUnitId", currentProduct.unitId);
      if (currentProduct.tagId) fd.append("ProductTagId", currentProduct.tagId);
      if (currentProduct.productCurrencyId) fd.append("ProductCurrencyId", currentProduct.productCurrencyId);

      fd.append("Upccode", currentProduct.upcCode || "");
      fd.append("SKU", currentProduct.skuCode || "");
      fd.append("IsActive", currentProduct.isActive ? "true" : "false");

      // IMPORTANT: the file field name must match what your backend expects (IFormFile property name)
      fd.append("ImageUrl", currentProduct.productImage);

      // Debug: inspect form entries in console before send
      for (const pair of fd.entries()) console.log(pair[0], pair[1]);

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/Product/${currentProduct.id}`,
        fd,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Api-Key": apiKey,
            // DO NOT set Content-Type; axios will set boundary automatically
          },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        showNotification("Product updated successfully!", "success");
        setCurrentProduct(initialProductState);
        fetchProducts();
        setIsFormOpen(false); // close *after* success
      }
    } else {
      // Send JSON if no file
      const payload = {
        id: currentProduct.id,
        userId: currentProduct.userId || undefined,
        name: currentProduct.name,
        description: currentProduct.description,
        price: parseFloat(currentProduct.price || 0),
        productCategoryId: currentProduct.categoryId || undefined,
        productUnitId: currentProduct.unitId || undefined,
        productTagId: currentProduct.tagId || undefined,
        
        upccode: currentProduct.upcCode || "",
        sku: currentProduct.skuCode || "",
        imageUrl:currentProduct.productImage,
        isActive: currentProduct.isActive
      };

      console.log("payload", payload);
      console.log(currentProducts.map(p => p.id));

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/Product/${currentProduct.id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Api-Key": apiKey,
          },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        showNotification("Product updated successfully!", "success");
        setCurrentProduct(initialProductState);
        fetchProducts();
        setIsFormOpen(false);
      }
    }
  } catch (err) {
    console.error("Error updating product:", err.response?.data ?? err.message);
    // show server validation messages if available:
    const msg = err.response?.data?.message || "Failed to update product";
    showNotification(msg, "error");
  } finally {
    setLoading(false);
  }
};





  useEffect(() => {
    fetchProducts();
    fetchUserProfile();
    fetchOptions();
  }, [fetchProducts]);

const fetchOptions = async () => {
  try {
    const token = localStorage.getItem("jwtToken");
    const userId = localStorage.getItem("userId");
    const apiKey = localStorage.getItem("apiKey");

    console.log("userId from localStorage:", userId);
    console.log("apiKey from localStorage:", apiKey);
    console.log("token from localStorage:", token);

    let categories = [];
    let units = [];
    let tags = [];

    try {
      const catRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/ProductCategory/user/${userId}`, {
        headers: {
          "X-Api-Key": apiKey,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      categories = catRes.data;
    } catch (err) {
      if (err.response?.status === 404) categories = [];
      else throw err;
    }

    try {
      const unitRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/ProductUnit/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      units = unitRes.data;
    } catch (err) {
      if (err.response?.status === 404) units = [];
      else throw err;
    }

    try {
      const tagRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/ProductTag/GetTagByUserId?userId=${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      tags = tagRes.data;
    } catch (err) {
      if (err.response?.status === 404) tags = [];
      else throw err;
    }

    console.log("Categories from API:", categories);
    setCategories(categories);
    setUnits(units);
    setTags(tags);

  } catch (err) {
    console.error("Error loading options:", err);
  }
};

const handleSubmit = (e) => {
  e.preventDefault(); // stops the page from reloading when submitting the form
  
  if (formMode === "add") {
    handleAddProduct(); // run the add-product logic
  } else {
    handleUpdateProduct(); // run the update-product logic
  }

  setIsFormOpen(false); // close the form after submit
};

  useEffect(() => {
    setFilteredProducts(
      products.filter(item =>
        item.name?.toLowerCase().includes(search.toLowerCase()) ||
        item.productUPC?.code?.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, products]);


useApiInterceptor(); // Initialize the API interceptor

  return (
    <DashboardLayout
      profileImageUrl={profileImageUrl}
      openModal={openModal}
      isModalOpen={isModalOpen}
      closeModal={closeModal}
      handleSignOut={handleSignOut}
      toggleSidebar={toggleSidebar}
      isSidebarOpen={isSidebarOpen}
      dialogProps={{
        openChangeImageDialog,
        openChangePasswordDialog,
        isChangeImageDialogOpen,
        closeChangeImageDialog,
        handleFileChange,
        handleUpload,
        isChangePasswordDialogOpen,
        closeChangePasswordDialog,
        currentPassword,
        newPassword,
        confirmNewPassword,
        setCurrentPassword,
        setNewPassword,
        setConfirmNewPassword,
        handleChangePassword,
      }}
    >
      <div className="min-h-screen bg-gray-50 p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Inventory Management</h1>
              <p className="text-gray-600">Track, manage and restock your products efficiently</p>
            </div>

            {/* Country Selector */}
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Country:</label>
              <div className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-1 text-sm bg-gray-50">
                <span className="text-xl">{getFlagEmoji(countryCode)}</span>
                <span>{country}</span>
              </div>
            </div>
          </div>
        </div>

        {success && <p className="text-green-600 mb-4">{success}</p>}
        {error && <p className="text-red-600 mb-4">{error}</p>}

        {/* Notification */}
        {notification && (
          <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
            notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white`}>
            {notification.message}
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Products</h3>
            <div className="text-3xl font-bold text-gray-900">{products.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Active Products</h3>
            <div className="text-3xl font-bold text-green-600">{products.filter(p => p.isActive).length}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Inactive Products</h3>
            <div className="text-3xl font-bold text-red-600">{products.filter(p => !p.isActive).length}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Value</h3>
            <div className="text-3xl font-bold text-blue-600">
              GHS {products.reduce((acc, p) => acc + p.price, 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}

            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Product List */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search product name or UPC..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
                <button
                  onClick={openAddForm}
                  className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors flex items-center gap-2"
                >
                  <Plus size={20} />
                  Add Product
                </button>
              </div>
            </div>

            {/* Product Table */}
            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mx-auto"></div>
                  <p className="text-gray-500 mt-2">Loading...</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No products found. Add your first product!
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentProducts.map((product,index) => (
                      <tr key={`${product.id}-${index}`} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <img
                                  src={product.imageUrl ? `${import.meta.env.VITE_API_URL}/${product.imageUrl.replace(/\\/g, '/')}` : './user-placeholder.png'}
                                  alt={product.name}
                                  className="w-16 h-16 object-cover rounded"
                                  onError={(e) => {
                                    e.target.src = './user-placeholder.png';
                                  }}
                                />
                            <div>
                              <div className="text-sm font-medium text-gray-900">{product.name}</div>
                              <div className="text-sm text-gray-500">{product.description || 'No UPC'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          GHS {product.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {categories.find((cat) => cat.id === product.productCategoryId)?.name || '—'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            product.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {product.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <button onClick={() => openEditForm(product)}
                            
                            className="text-blue-600 hover:text-blue-900">
                              <Edit3 size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )} 
              </div>
              {/* Pagination */}
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={(page) => {
                        if (page >= 1 && page <= totalPages) {
                          setCurrentPage(page);
                        }
                      }}
                    />
            </div>
                     

         
          {/* Right Column - Add Product Form */}
          <div className="bg-white rounded-lg shadow-sm">
            {isFormOpen ?   (
              <div>
                <div className="p-6 border-b">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900">{formMode === "add" ? "Add Product" : "Edit Product"}</h2>
                    <button
                      onClick={() => setIsFormOpen(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm">

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input 
                  placeholder="Enter Product Name"
                  type="text"
                  name="name" 
                  value={currentProduct.name} 
                  onChange={handleChange} 
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500" 
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                <input 
                  
                  type="number" 
                  step="0.01"
                  name="price" 
                  value={currentProduct.price} 
                  onChange={handleChange} 
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500" 
                  required
                />
              </div>
             </div>

             <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea 
                placeholder="Add A Brief Description"
                name="description" 
                value={currentProduct.description} 
                onChange={handleChange} 
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                rows="3"
              />
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <div className="flex gap-2">
                  <select 
                    name="categoryId" 
                    value={currentProduct.categoryId} 
                    onChange={handleChange} 
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="">Select category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  <button 
                    type="button" 
                    onClick={() => setShowCategoryModal(true)} 
                    className="bg-teal-500 text-white px-3 py-2 rounded-md hover:bg-teal-600 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Unit */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                <div className="flex gap-2">
                  <select 
                    name="unitId" 
                    value={currentProduct.unitId} 
                    onChange={handleChange} 
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="">Select unit</option>
                    {units.map((u) => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </select>
                  <button 
                    type="button" 
                    onClick={() => setShowUnitModal(true)} 
                    className="bg-teal-500 text-white px-3 py-2 rounded-md hover:bg-teal-600 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Tag */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tag</label>
                <div className="flex gap-2">
                  <select 
                    name="tagId" 
                    value={currentProduct.tagId} 
                    onChange={handleChange} 
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="">Select tag</option>
                    {tags.map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                  <button 
                    type="button" 
                    onClick={() => setShowTagModal(true)} 
                    className="bg-teal-500 text-white px-3 py-2 rounded-md hover:bg-teal-600 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* UPC */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">UPC Code</label>
                <input
                        type="text"
                        name="upcCode"
                        value={currentProduct.upcCode}
                        onChange={handleChange}
                        placeholder="Enter UPC code"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      />
              </div>
                    {/*SKU Code*/}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SKU Code</label>
                <input
                  type="text"
                  name="skuCode"
                  value={currentProduct.skuCode}
                  onChange={handleChange}
                  placeholder="Enter SKU code"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>

              {/*Upload Product Image */}
              <div> 
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                <input type="file" name="productImage" onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500" />
                 
              </div>

              <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isActive"
                        checked={currentProduct.isActive}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                        Active Product
                      </label>
                    </div>

             </div>

             <div className="mt-8">
              <button 
                type="submit" 
                
                className="bg-teal-500 text-white px-6 py-2 rounded-md hover:bg-teal-600 transition-colors font-medium"
              >
                {formMode === "add" ? "Save Product" : "Update Changes"}
              </button>
             </div>
             </form>
                                




                                {/* Modals */}
                        <AddCategoryModal 
                          isOpen={showCategoryModal} 
                          onClose={() => setShowCategoryModal(false)} 
                          onSaved={fetchOptions} 
                        />
                        <AddUnitModal 
                          isOpen={showUnitModal} 
                          onClose={() => setShowUnitModal(false)} 
                          onSaved={fetchOptions} 
                        />
                        <AddTagModal 
                          isOpen={showTagModal} 
                          onClose={() => setShowTagModal(false)} 
                          onSaved={fetchOptions} 
                        />
                        <AddUpcModal 
                          isOpen={showUpcModal} 
                          onClose={() => setShowUpcModal(false)} 
                          onSaved={fetchOptions} 
                        />



                </div>
                
              </div>
                      ) : (
              <div className="p-8 text-center text-gray-500">
                Click "Add Product" to create a new product
              </div>
            )}
          </div>
 
        </div>
         
      </div>
       
    </DashboardLayout>
     
  );
}