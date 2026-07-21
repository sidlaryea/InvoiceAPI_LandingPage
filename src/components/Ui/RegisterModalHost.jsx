import React from "react";
import RegisterModal from "../RegisterModal";

export default function RegisterModalHost() {
  return (
    <dialog
      id="register-modal"
      /* 
        NOTE: backdrop:backdrop-blur-sm is intentionally omitted.
        backdrop-filter on ::backdrop causes a solid blur/white screen 
        on many mobile browsers (Safari iOS, Android Chrome, Samsung Internet).
        Simple background-color on ::backdrop is universally supported.
      */
      className="border-none rounded-2xl p-0 w-[90vw] max-w-6xl overflow-hidden bg-white backdrop:bg-black/40"
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        maxHeight: "90vh",
      }}
    >
      <button
        type="button"
        onClick={() => document.getElementById('register-modal')?.close()}
        className="cursor-pointer absolute top-4 right-4 z-10 inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/90 hover:bg-white text-gray-700 shadow"
        aria-label="Close registration modal"
      >
        ✕
      </button>
      <RegisterModal />
    </dialog>
  );
}

