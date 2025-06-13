import React from "react";

export default function TrailerModal({ videoUrl, onClose }) {
  if (!videoUrl) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
      <div className="relative w-full max-w-3xl aspect-video bg-black">
        <iframe
          src={videoUrl.replace("watch?v=", "embed/")}
          title="YouTube Trailer"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
          className="w-full h-full"
        />
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-white text-black rounded px-2 py-1"
        >
          ✖
        </button>
      </div>
    </div>
  );
}
