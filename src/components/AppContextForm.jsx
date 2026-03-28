import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function AppContextForm({
  appContext,
  onUpdate,
  apiKey,
  onApiKeyChange,
  showApiKey,
  onToggleApiKey,
}) {
  const handleChange = (field, value) => {
    onUpdate({ ...appContext, [field]: value });
  };

  return (
    <div className="bg-surface rounded-2xl border border-border p-6 space-y-4">
      <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
        App Context
      </h3>

      <div className="space-y-3">
        <div>
          <label className="block text-xs text-muted mb-1">App Name</label>
          <input
            type="text"
            value={appContext.appName}
            onChange={(e) => handleChange('appName', e.target.value)}
            placeholder="My App"
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-white placeholder:text-muted/50 focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-xs text-muted mb-1">Category</label>
          <input
            type="text"
            value={appContext.category}
            onChange={(e) => handleChange('category', e.target.value)}
            placeholder="Productivity, Social, etc."
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-white placeholder:text-muted/50 focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-xs text-muted mb-1">Description</label>
          <textarea
            value={appContext.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Brief description of what your app does"
            rows={3}
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-white placeholder:text-muted/50 focus:outline-none focus:border-primary resize-none"
          />
        </div>

        <div>
          <label className="block text-xs text-muted mb-1">API Key (for AI captions)</label>
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
    </div>
  );
}
