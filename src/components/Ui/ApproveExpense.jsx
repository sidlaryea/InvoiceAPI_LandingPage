import { useState, useEffect } from "react";
import { X } from "lucide-react";
import axios from "axios";

export default function ApproveExpense({ isOpen, expense, onClose, onStatusUpdate }) {
  const [selectedStatus, setSelectedStatus] = useState(expense?.expenseStatus ?? expense?.status ?? 0);
  const [loading, setLoading] = useState(false);

  // Keep selectedStatus in sync when a different expense is passed
  useEffect(() => {
    setSelectedStatus(Number(expense?.expenseStatus ?? expense?.status ?? 0));
  }, [expense]);

  const statusOptions = [
    { value: 0, label: 'Draft', color: 'bg-gray-100 text-gray-800' },
    { value: 1, label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { value: 2, label: 'Approved', color: 'bg-green-100 text-green-800' },
    { value: 3, label: 'Paid', color: 'bg-blue-100 text-blue-800' },
    { value: 4, label: 'Rejected', color: 'bg-red-100 text-red-800' }
  ];

  const handleSave = async () => {
    if (!expense) return;

    setLoading(true);
    const token = localStorage.getItem("jwtToken");

    // derive id (support multiple shapes)
    const idToUse =
      expense?.expenseId ??
      expense?.id ??
      expense?.expenseID ??
      expense?.expense_id ??
      null;

    if (!idToUse) {
      setLoading(false);
      console.error("ApproveExpense: missing expense id, expense:", expense);
      alert("Unable to update status: missing expense id.");
      return;
    }

    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/Expense/${idToUse}/status?newStatus=${selectedStatus}`,
        {
          id: idToUse,
          status: selectedStatus
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        }
      );

      alert("Expense status updated successfully!");
      onStatusUpdate && onStatusUpdate(idToUse, selectedStatus);
      onClose();
    } catch (error) {
      alert("Failed to update expense status: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !expense) return null;

  return (
    <div className="fixed inset-0 bg-white/30 bg-opacity-10 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Update Expense Status</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <div className="space-y-4">
            {/* Expense Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Expense ID:</span>
                  <p className="text-gray-900">{expense.expenseId}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Amount:</span>
                  <p className="text-gray-900">GH₵{expense.amount?.toFixed(2)}</p>
                </div>
                <div className="col-span-2">
                  <span className="font-medium text-gray-700">Description:</span>
                  <p className="text-gray-900">{expense.description}</p>
                </div>
                <div className="col-span-2">
                  <span className="font-medium text-gray-700">Merchant:</span>
                  <p className="text-gray-900">{expense.merchant}</p>
                </div>
              </div>
            </div>

            {/* Status Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Preview */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Preview:</span>
              <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${statusOptions.find(s => s.value === selectedStatus)?.color || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                {statusOptions.find(s => s.value === selectedStatus)?.label || 'Unknown'}
              </span>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Status'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
