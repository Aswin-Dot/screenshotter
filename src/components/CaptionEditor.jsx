import React from 'react';
import { Type, ArrowUp, ArrowDown } from 'lucide-react';

export default function CaptionEditor({
  screenshots,
  onUpdateCaption,
  apiKey,
  appContext,
  captionPosition,
  onCaptionPositionChange,
}) {
  return (
    <div className="bg-surface rounded-2xl border border-border p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
          Captions
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted">Position:</span>
          <button
            onClick={() =>
              onCaptionPositionChange(captionPosition === 'top' ? 'bottom' : 'top')
            }
            className="flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-background border border-border text-muted hover:text-white transition-colors"
          >
            {captionPosition === 'top' ? (
              <>
                <ArrowUp size={12} /> Top
              </>
            ) : (
              <>
                <ArrowDown size={12} /> Bottom
              </>
            )}
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {screenshots.map((screenshot, index) => (
          <div key={screenshot.id} className="flex items-start gap-3">
            <img
              src={screenshot.dataUrl}
              alt={`Screenshot ${index + 1}`}
              className="w-10 h-16 object-cover rounded border border-border flex-shrink-0"
            />
            <div className="flex-1">
              <label className="block text-xs text-muted mb-1">
                Screenshot {index + 1}
              </label>
              <input
                type="text"
                value={screenshot.customCaption || screenshot.selectedCaption || ''}
                onChange={(e) =>
                  onUpdateCaption(screenshot.id, { customCaption: e.target.value })
                }
                placeholder="Enter caption text..."
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-white placeholder:text-muted/50 focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
