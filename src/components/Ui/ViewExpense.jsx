import { X, Eye } from "lucide-react";
import { useState } from "react";

export default function ViewExpense({ isOpen, expense, onClose, expenseCategories, getStatusElement }) {
  const [showReceiptViewer, setShowReceiptViewer] = useState(false);

  if (!isOpen || !expense) return null;

  const category = expenseCategories.find(c => c.id === expense.categoryId);
  const categoryName = category ? category.name : expense.categoryId;

  const handleViewReceipt = () => {
    setShowReceiptViewer(true);
  };

  const handleCloseReceipt = () => {
    setShowReceiptViewer(false);
  };

  return (
    <>
      <div className="fixed inset-0 bg-white/30 bg-opacity-10 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
          {/* Modal Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">View Expense Entry</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 overflow-y-auto">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expense ID</label>
                  <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900">
                    {expense.expenseId}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900">
                    {new Date(expense.date).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900">
                  {categoryName}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount (GH₵)</label>
                <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 font-semibold">
                  GH₵{expense.amount.toFixed(2)}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900">
                  {expense.description}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Merchant</label>
                  <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900">
                    {expense.merchant}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                  <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900">
                    {expense.paymentMethod}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg">
                  {getStatusElement(expense.expenseStatus)}
                </div>
              </div>

              {expense.receiptUrl && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Receipt</label>
                  <button
                    onClick={handleViewReceipt}
                    className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View Receipt
                  </button>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 mt-6">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {showReceiptViewer && (
        <ReceiptViewerModal
          receiptUrl={expense.receiptUrl}
          onClose={handleCloseReceipt}
        />
      )}
    </>
  );
}

function ReceiptViewerModal({ receiptUrl, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <button
        onClick={onClose}
        className="absolute top-3 right-3 z-50 bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
      >
        ✕
      </button>
      <div className="bg-white w-11/12 md:w-3/4 h-5/6 rounded-2xl shadow-xl overflow-hidden relative">
        <div className="h-full">
          {receiptUrl ? (
            <img
              src={`${import.meta.env.VITE_API_URL}/${receiptUrl.replace(/\\/g, '/')}`}
              alt="Receipt"
              className="w-full h-full object-contain"
            />
          ) : (
            <p className="text-center mt-20 text-red-500">
              No receipt available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
