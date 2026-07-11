import React from 'react';

const AddTaxRateModal = ({ isOpen, onClose, newTaxRate, handleNewTaxRateChange, addTaxRate }) => {
  if (!isOpen) return null;

  const handleAdd = () => {
    addTaxRate();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50  flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Add New Tax Rate</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Tax Name"
            value={newTaxRate.name}
            onChange={handleNewTaxRateChange}
            className="input bg-white border border-gray-300 rounded-lg px-4 py-3"
          />
          <input
            type="number"
            name="rate"
            placeholder="Rate (%)"
            value={newTaxRate.rate}
            onChange={handleNewTaxRateChange}
            className="input bg-white border border-gray-300 rounded-lg px-4 py-3"
          />
          <input
            type="text"
            name="country"
            placeholder="Country"
            value={newTaxRate.country}
            readOnly
            className="input bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 cursor-not-allowed"
          />
          <input
            type="text"
            name="region"
            placeholder="Region/Province/State"
            value={newTaxRate.region}
            onChange={handleNewTaxRateChange}
            className="input bg-white border border-gray-300 rounded-lg px-4 py-3"
          />
        </div>
        <div className="flex justify-end mt-4 space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add Tax Rate
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTaxRateModal;
