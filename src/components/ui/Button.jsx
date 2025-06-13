import React from "react";

export function Button({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={`bg-cinema-gold text-black px-4 py-2 rounded hover:bg-yellow-400 transition font-semibold ${className}`}
    >
      {children}
    </button>
  );
}
