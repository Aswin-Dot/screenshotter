import React, { useCallback, useRef, useState } from 'react';
import { Upload, X, Image } from 'lucide-react';

export default function DropZone({ screenshots, onUpload, onRemove, maxFiles }) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      const files = Array.from(e.dataTransfer.files).filter((f) =>
        f.type.startsWith('image/')
      );
      if (files.length > 0) {
        onUpload(files);
      }
    },
    [onUpload]
  );

  const handleClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (e) => {
      const files = Array.from(e.target.files || []);
      if (files.length > 0) {
        onUpload(files);
      }
      e.target.value = '';
    },
    [onUpload]
  );

  return (
    <div className="space-y-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-colors ${
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-muted'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
        <Upload className="mx-auto mb-4 text-muted" size={32} />
        <p className="text-white font-medium mb-1">
          Drop screenshots here or click to upload
        </p>
        <p className="text-muted text-sm">
          PNG, JPG up to {maxFiles} files
        </p>
      </div>

      {screenshots.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {screenshots.map((s) => (
            <div
              key={s.id}
              className="relative group rounded-lg overflow-hidden bg-surface border border-border"
            >
              <img
                src={s.dataUrl}
                alt="Screenshot"
                className="w-full aspect-[9/16] object-cover"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(s.id);
                }}
                className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
