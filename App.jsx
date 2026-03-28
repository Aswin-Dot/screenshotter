import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from './components/Header';
import StepIndicator from './components/StepIndicator';
import DropZone from './components/DropZone';
import AppContextForm from './components/AppContextForm';
import StylePicker from './components/StylePicker';
import CaptionEditor from './components/CaptionEditor';
import PreviewGrid from './components/PreviewGrid';
import DownloadSection from './components/DownloadSection';
import SettingsModal from './components/SettingsModal';
import Toast, { useToast } from './components/Toast';
import { useLocalStorage } from './hooks/useLocalStorage';

// Generate unique IDs
const generateId = () => `screenshot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export default function App() {
  // Persistent state
  const [apiKey, setApiKey] = useLocalStorage('screenshotter-api-key', '');
  const [appContext, setAppContext] = useLocalStorage('screenshotter-app-context', {
    appName: '',
    category: '',
    description: '',
  });

  // Session state
  const [screenshots, setScreenshots] = useState([]);
  const [deviceFrame, setDeviceFrame] = useState('iphone-15-pro-black');
  const [backgroundStyle, setBackgroundStyle] = useState('gradient-ocean');
  const [captionPosition, setCaptionPosition] = useState('top');
  const [showApiKey, setShowApiKey] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Toast notifications
  const { toast, showToast, dismissToast } = useToast();

  // Calculate current step
  const currentStep = screenshots.length === 0 
    ? 1 
    : screenshots.some(s => s.selectedCaption || s.customCaption) 
      ? screenshots.every(s => s.renderedDataUrl) 
        ? 4 
        : 3 
      : 2;

  // Handle file uploads
  const handleUpload = useCallback(async (files) => {
    const newScreenshots = [];

    for (const file of files) {
      if (screenshots.length + newScreenshots.length >= 10) {
        showToast('Maximum 10 screenshots allowed', 'info');
        break;
      }

      try {
        const dataUrl = await readFileAsDataUrl(file);
        newScreenshots.push({
          id: generateId(),
          file,
          dataUrl,
          captions: null,
          selectedCaption: null,
          customCaption: null,
          renderedDataUrl: null,
        });
      } catch (error) {
        console.error('Failed to read file:', error);
        showToast(`Failed to load ${file.name}`, 'error');
      }
    }

    if (newScreenshots.length > 0) {
      setScreenshots(prev => [...prev, ...newScreenshots]);
      showToast(`Added ${newScreenshots.length} screenshot${newScreenshots.length > 1 ? 's' : ''}`, 'success');
    }
  }, [screenshots.length, showToast]);

  // Remove screenshot
  const handleRemove = useCallback((id) => {
    setScreenshots(prev => prev.filter(s => s.id !== id));
  }, []);

  // Update caption for a screenshot
  const handleUpdateCaption = useCallback((id, updates) => {
    setScreenshots(prev => prev.map(s => 
      s.id === id ? { ...s, ...updates } : s
    ));
  }, []);

  // Update rendered data for a screenshot
  const handleRenderedUpdate = useCallback((id, updates) => {
    setScreenshots(prev => prev.map(s => 
      s.id === id ? { ...s, ...updates } : s
    ));
  }, []);

  // Reset everything
  const handleReset = useCallback(() => {
    setScreenshots([]);
    setApiKey('');
    setAppContext({
      appName: '',
      category: '',
      description: '',
    });
    setDeviceFrame('iphone-15-pro-black');
    setBackgroundStyle('gradient-ocean');
    setCaptionPosition('top');
    showToast('All data has been reset', 'success');
  }, [setApiKey, setAppContext, showToast]);

  return (
    <div className="min-h-screen bg-background">
      <Header onOpenSettings={() => setSettingsOpen(true)} />
      
      <main className="max-w-7xl mx-auto px-6 pb-24">
        {/* Step indicator */}
        <StepIndicator 
          currentStep={currentStep} 
          completedSteps={
            currentStep > 1 
              ? Array.from({ length: currentStep - 1 }, (_, i) => i + 1) 
              : []
          }
        />

        {/* Main content */}
        <div className="space-y-8">
          {/* Step 1: Upload */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <DropZone
              screenshots={screenshots}
              onUpload={handleUpload}
              onRemove={handleRemove}
              maxFiles={10}
            />
          </motion.section>

          {/* Show remaining sections only when screenshots exist */}
          {screenshots.length > 0 && (
            <>
              {/* App context + Style picker row */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="grid lg:grid-cols-3 gap-6"
              >
                {/* App context form - smaller */}
                <div className="lg:col-span-1">
                  <AppContextForm
                    appContext={appContext}
                    onUpdate={setAppContext}
                    apiKey={apiKey}
                    onApiKeyChange={setApiKey}
                    showApiKey={showApiKey}
                    onToggleApiKey={() => setShowApiKey(!showApiKey)}
                  />
                </div>

                {/* Style picker - larger */}
                <div className="lg:col-span-2">
                  <StylePicker
                    selectedDevice={deviceFrame}
                    onDeviceChange={setDeviceFrame}
                    selectedBackground={backgroundStyle}
                    onBackgroundChange={setBackgroundStyle}
                  />
                </div>
              </motion.section>

              {/* Caption editor */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <CaptionEditor
                  screenshots={screenshots}
                  onUpdateCaption={handleUpdateCaption}
                  apiKey={apiKey}
                  appContext={appContext}
                  captionPosition={captionPosition}
                  onCaptionPositionChange={setCaptionPosition}
                />
              </motion.section>

              {/* Preview grid */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <PreviewGrid
                  screenshots={screenshots}
                  deviceFrame={deviceFrame}
                  backgroundStyle={backgroundStyle}
                  captionPosition={captionPosition}
                  onRenderedUpdate={handleRenderedUpdate}
                />
              </motion.section>

              {/* Download section */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <DownloadSection screenshots={screenshots} />
              </motion.section>
            </>
          )}

          {/* Empty state footer */}
          {screenshots.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center py-12"
            >
              <p className="text-muted text-sm">
                Upload your first screenshot to get started
              </p>
              <div className="mt-6 flex items-center justify-center gap-8">
                <Feature icon="📱" label="Device Frames" />
                <Feature icon="🎨" label="Beautiful Backgrounds" />
                <Feature icon="✨" label="AI Captions" />
                <Feature icon="📦" label="ZIP Export" />
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* Settings modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        apiKey={apiKey}
        onApiKeyChange={setApiKey}
        showApiKey={showApiKey}
        onToggleApiKey={() => setShowApiKey(!showApiKey)}
        onReset={handleReset}
      />

      {/* Toast notifications */}
      <Toast toast={toast} onDismiss={dismissToast} />
    </div>
  );
}

// Helper component for features
function Feature({ icon, label }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-2xl">{icon}</span>
      <span className="text-xs font-medium text-muted">{label}</span>
    </div>
  );
}

// Helper to read file as data URL
function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}
