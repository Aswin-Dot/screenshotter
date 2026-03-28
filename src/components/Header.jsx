import React from 'react';
import { Settings } from 'lucide-react';

export default function Header({ onOpenSettings }) {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">📸</span>
          <h1 className="text-xl font-bold text-white tracking-tight">Screenshotter</h1>
        </div>
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-lg text-muted hover:text-white hover:bg-surface transition-colors"
          aria-label="Open settings"
        >
          <Settings size={20} />
        </button>
      </div>
    </header>
  );
}
