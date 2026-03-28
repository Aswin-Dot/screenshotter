import React from 'react';
import { Smartphone, Monitor } from 'lucide-react';

const DEVICES = [
  { id: 'iphone-15-pro-black', label: 'iPhone 15 Pro', color: '#1a1a1a' },
  { id: 'iphone-15-pro-white', label: 'iPhone 15 Pro (White)', color: '#f5f5f7' },
  { id: 'iphone-15-pro-natural', label: 'iPhone 15 Pro (Natural)', color: '#c4b49a' },
  { id: 'pixel-8', label: 'Pixel 8', color: '#2a2a2a' },
  { id: 'galaxy-s24', label: 'Galaxy S24', color: '#1a1a2e' },
  { id: 'none', label: 'No Frame', color: 'transparent' },
];

const BACKGROUNDS = [
  { id: 'gradient-ocean', label: 'Ocean', style: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { id: 'gradient-sunset', label: 'Sunset', style: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { id: 'gradient-forest', label: 'Forest', style: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
  { id: 'gradient-midnight', label: 'Midnight', style: 'linear-gradient(135deg, #0c0c1d 0%, #1a1a3e 100%)' },
  { id: 'solid-white', label: 'White', style: '#ffffff' },
  { id: 'solid-black', label: 'Black', style: '#000000' },
];

export default function StylePicker({
  selectedDevice,
  onDeviceChange,
  selectedBackground,
  onBackgroundChange,
}) {
  return (
    <div className="bg-surface rounded-2xl border border-border p-6 space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
          Device Frame
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {DEVICES.map((device) => (
            <button
              key={device.id}
              onClick={() => onDeviceChange(device.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedDevice === device.id
                  ? 'bg-primary/20 text-primary border border-primary'
                  : 'bg-background text-muted border border-border hover:border-muted'
              }`}
            >
              <Smartphone size={14} />
              <span className="truncate">{device.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
          Background
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {BACKGROUNDS.map((bg) => (
            <button
              key={bg.id}
              onClick={() => onBackgroundChange(bg.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedBackground === bg.id
                  ? 'bg-primary/20 text-primary border border-primary'
                  : 'bg-background text-muted border border-border hover:border-muted'
              }`}
            >
              <div
                className="w-4 h-4 rounded-full border border-border flex-shrink-0"
                style={{ background: bg.style }}
              />
              <span className="truncate">{bg.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
