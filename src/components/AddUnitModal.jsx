// AddUnitModal.jsx
import React, { useState, useEffect } from 'react';
import { X, Save, Package,Edit3,Trash2 } from 'lucide-react';
import axios from 'axios';

export function AddUnitModal({ isOpen, onClose, onSaved }) {
  const [name, setName] = useState('');
  const [unitCode, setUnitCode] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Table state
  const [units, setUnits] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const unitsPerPage = 5;

  // Fetch units when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchUnits();
    }
  }, [isOpen]);
  



  

  const fetchUnits = async () => {
    const token = localStorage.getItem("jwtToken");
    const userId = localStorage.getItem("userId");
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/ProductUnit/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUnits(res.data);
    } catch (err) {
  alert("Error adding unit");
  console.error(err);
}
  };

  const handleSubmit = async (e) => {
    
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("jwtToken");
    
    try {
        if (editingId){
          //Update unit
          await axios.put(`${import.meta.env.VITE_API_URL}/api/ProductUnit/${editingId}`, 
        { id:editingId,name, unitCode, description, isActive }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
        }else{
            //create New unit
          await axios.post(`${import.meta.env.VITE_API_URL}/api/ProductUnit`, 
        { name, unitCode, description, isActive }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );}
      // Reset form
      setName('');
      setUnitCode('');
      setDescription('');
      setIsActive(true);
      
      await fetchUnits(); // refresh table
      onSaved();
    } catch (err) {
      alert("Error adding unit",err);
    } finally {
      setLoading(false);
    }
  };


// Delete category
  const handleDelete = async (id) => {
    const token = localStorage.getItem("jwtToken");
    if (!window.confirm("Are you sure you want to delete this Unit Of Measure?")) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/ProductUnit/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUnits();
    } catch (err) {
      alert("Error deleting Unit", err);
    }
  };


   // Start editing
  const handleEdit = (unit) => {
    setName(unit.name);
    setUnitCode(unit.unitCode)
    setDescription(unit.description)
    setIsActive(unit.isActive)
    setEditingId(unit.id);
  };



  // Pagination logic
  const indexOfLastUnit = currentPage * unitsPerPage;
  const indexOfFirstUnit = indexOfLastUnit - unitsPerPage;
  const currentUnits = units.slice(indexOfFirstUnit, indexOfLastUnit);

  const totalPages = Math.ceil(units.length / unitsPerPage);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-6 py-4">
          <div className="flex justify-between items-center text-white">
            <div className="flex items-center gap-3">
              <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                <Package size={20} />
              </div>
              <h2 className="text-xl font-semibold">{editingId ? 'Edit Unit' : 'Add New Unit'}</h2>
            </div>
            <button 
              onClick={onClose}
              className="hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6 mb-6">
            {/* Unit Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unit Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter unit name (e.g., Kilogram, Piece, Liter)"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            {/* Unit Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unit Code *
              </label>
              <input
                type="text"
                value={unitCode}
                onChange={(e) => setUnitCode(e.target.value)}
                placeholder="Enter unit code (e.g., KG, PCS, L)"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter a brief description of this unit (optional)"
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 resize-none"
              />
            </div>

            {/* Active Status */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isActive"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                Active Unit
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-teal-500 text-white px-8 py-3 rounded-lg hover:bg-teal-600 disabled:opacity-50 flex items-center gap-2"
              >
                <Save size={18} />
                {loading ? 'Saving...' : 'Save Unit'}
              </button>
            </div>
          </form>

          {/* Table */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Existing Units</h3>
            <div className="overflow-x-auto border rounded-lg">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 border-b">Name</th>
                    <th className="px-4 py-2 border-b">Code</th>
                    <th className="px-4 py-2 border-b">Active</th>
                    <th className="px-4 py-2 border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUnits.map((unit) => (
                    <tr key={unit.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border-b">{unit.name}</td>
                      <td className="px-4 py-2 border-b">{unit.unitCode}</td>
                      <td className="px-4 py-2 border-b">
                        {unit.isActive ? 'Yes' : 'No'}
                      </td>
                       <td className="px-4 py-2 border-b">
                          <div className="flex items-center gap-2">
                            <button onClick={() => handleEdit(unit)}
                            
                            className="text-blue-600 hover:text-blue-900">
                              <Edit3 size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(unit.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                    </tr>
                  ))}
                  {currentUnits.length === 0 && (
                    <tr>
                      <td colSpan="3" className="text-center text-gray-500 py-4">
                        No units found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-4 gap-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 rounded ${
                      currentPage === i + 1
                        ? 'bg-teal-500 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddUnitModal;
