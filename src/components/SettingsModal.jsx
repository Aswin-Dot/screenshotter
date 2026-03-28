import React from 'react';
import { X, Eye, EyeOff, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SettingsModal({
  isOpen,
  onClose,
  apiKey,
  onApiKeyChange,
  showApiKey,
  onToggleApiKey,
  onReset,
}) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative bg-surface rounded-2xl border border-border p-6 w-full max-w-md mx-4 space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Settings</h2>
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-muted hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs text-muted mb-1">API Key</label>
                <div className="relative">
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={apiKey}
                    onChange={(e) => onApiKeyChange(e.target.value)}
                    placeholder="sk-..."
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 pr-10 text-sm text-white placeholder:text-muted/50 focus:outline-none focus:border-primary"
                  />
                  <button
                    onClick={onToggleApiKey}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted hover:text-white"
                  >
                    {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <button
                onClick={() => {
                  onReset();
                  onClose();
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-error hover:bg-error/10 transition-colors"
              >
                <RotateCcw size={14} />
                Reset All Data
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
