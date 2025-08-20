// AddUPCModal.jsx
import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import axios from 'axios';

export function AddUPCModal({ isOpen, onClose, onSaved }) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("jwtToken");
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/upcs`, { code }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCode('');
      onSaved();
      onClose();
    } catch (err) {
      alert("Error adding UPC",err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Add UPC</h2>
          <button onClick={onClose}><X /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="UPC Code"
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 flex items-center gap-2"
          >
            <Save size={16} /> {loading ? 'Saving...' : 'Save'}
          </button>
        </form>
      </div>
    </div>
  );
}
export default AddUPCModal;
// This component allows users to add a new UPC code through a modal form.