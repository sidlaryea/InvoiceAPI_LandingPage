

export default function SuccessModal({ show, onClose, message }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
      <div className="bg-white/90 rounded-2xl shadow-xl p-6 max-w-sm text-center">
        <h2 className="text-lg font-semibold text-gray-800">✅ Success</h2>
        <p className="mt-2 text-gray-600">{message}</p>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}
