import React from "react";
import RegisterModal from "../RegisterModal";

export default function RegisterModalHost({ open, onClose }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-[90vw] max-w-6xl max-h-[90vh] overflow-hidden bg-white rounded-2xl shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="cursor-pointer absolute top-4 right-4 z-10 inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/90 hover:bg-white text-gray-700 shadow"
          aria-label="Close registration modal"
        >
          ✕
        </button>
        <RegisterModal onClose={onClose} />
      </div>
    </div>
  );
}

