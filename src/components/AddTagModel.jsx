// AddTagModal.jsx
import React, { useState, useEffect } from 'react';
import { X, Save, Edit2, Trash2, Plus, Tag as TagIcon } from 'lucide-react';
import axios from 'axios';

export function AddTagModal({ isOpen, onClose, onSaved }) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const token = localStorage.getItem("jwtToken");
  const userId = localStorage.getItem("userId");

  // Fetch tags for logged-in user
  const fetchTags = async () => {
    
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/ProductTag/GetTagByUserId?userId=${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTags(res.data);
      console.log('mytags',res.data);
    } catch (err) {
      console.error("Error fetching tags", err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchTags();
    }
  }, [isOpen]);

  // Add or update tag
  const handleSubmit = async (e) => {
    
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        // Update tag
        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/ProductTag/${editingId}`,
          { id: editingId, name },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // Create tag
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/ProductTag`,
          { name },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      setName('');
      setEditingId(null);
      fetchTags();
      onSaved && onSaved();
    } catch (err) {
      alert("Error saving tag");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Delete tag
  const handleDelete = async (id) => {
    
    if (!window.confirm("Are you sure you want to delete this tag?")) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/ProductTag/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTags();
    } catch (err) {
      alert("Error deleting tag");
      console.error(err);
    }
  };

  // Start editing
  const handleEdit = (tag) => {
    setName(tag.name);
    setEditingId(tag.id);
  };

  // Cancel editing
  const handleCancel = () => {
    setName('');
    setEditingId(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      {/* Modal box */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-6 py-4">
          <div className="flex justify-between items-center text-white">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold w-full">
                {editingId ? 'Edit Tag' : 'Manage Tags'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Form Section */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <Plus size={18} className="text-teal-500" />
              {editingId ? 'Edit Tag' : 'Add New Tag'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter tag name..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors placeholder-gray-400"
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-teal-500 text-white px-4 py-3 rounded-lg hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium transition-colors"
                >
                  <Save size={18} />
                  {loading ? 'Saving...' : editingId ? 'Update' : 'Add Tag'}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-3 border-2 border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Tags List Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Your Tags</h3>
              <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-medium">
                {tags.length} {tags.length === 1 ? 'tag' : 'tags'}
              </span>
            </div>

            {/* Tags list */}
            <div className="max-h-64 overflow-y-auto space-y-2">
              {tags.length > 0 ? (
                tags.map((t) => (
                  <div
                    key={t.id}
                    className={`group flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border-2 transition-all ${
                      editingId === t.id ? 'border-teal-500 bg-teal-50' : 'border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                      <span className="font-medium text-gray-800">{t.name}</span>
                    </div>

                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(t)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Edit tag"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        title="Delete tag"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TagIcon size={24} className="text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-sm">No tags yet.</p>
                  <p className="text-gray-400 text-xs mt-1">Add your first tag above!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddTagModal;
