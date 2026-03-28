import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const ICONS = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
};

const COLORS = {
  success: 'text-success',
  error: 'text-error',
  info: 'text-info',
};

export function useToast() {
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);

  const showToast = useCallback((message, type = 'info') => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setToast({ message, type, id: Date.now() });
    timerRef.current = setTimeout(() => {
      setToast(null);
    }, 3000);
  }, []);

  const dismissToast = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setToast(null);
  }, []);

  return { toast, showToast, dismissToast };
}

export default function Toast({ toast, onDismiss }) {
  if (!toast) return null;

  const Icon = ICONS[toast.type] || ICONS.info;
  const colorClass = COLORS[toast.type] || COLORS.info;

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.id}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <div className="flex items-center gap-3 bg-surface border border-border rounded-xl px-4 py-3 shadow-lg">
            <Icon size={18} className={colorClass} />
            <span className="text-sm text-white">{toast.message}</span>
            <button
              onClick={onDismiss}
              className="text-muted hover:text-white transition-colors ml-2"
            >
              <X size={14} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
