"use client";

import { useEffect, ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  width?: string;
}

export function Modal({ open, onClose, title, children, width = "560px" }: ModalProps) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: "rgba(29,29,31,0.42)",
        backdropFilter: "saturate(180%) blur(8px)",
        WebkitBackdropFilter: "saturate(180%) blur(8px)",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="bg-white flex flex-col"
        style={{
          width,
          maxWidth: "100%",
          maxHeight: "88vh",
          borderRadius: 18,
          border: "1px solid rgba(0,0,0,0.06)",
          boxShadow: "0 30px 80px rgba(0,0,0,0.18), 0 4px 20px rgba(0,0,0,0.08)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 shrink-0"
          style={{ height: 56, borderBottom: "1px solid #F0F0F0" }}
        >
          <h2 className="apple-tagline" style={{ fontSize: 17 }}>{title}</h2>
          <button
            onClick={onClose}
            className="rounded-full transition-colors flex items-center justify-center"
            style={{ width: 32, height: 32, color: "#86868B" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.06)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 scroll-y">
          {children}
        </div>
      </div>
    </div>
  );
}

export function ModalActions({ children }: { children: ReactNode }) {
  return (
    <div
      className="flex items-center justify-end gap-2 px-6 py-3 shrink-0 flex-wrap"
      style={{ minHeight: 64, borderTop: "1px solid #F0F0F0", background: "#FAFAFC" }}
    >
      {children}
    </div>
  );
}
