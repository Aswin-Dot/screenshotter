import React, { useCallback, useState } from 'react';
import { Download, Archive } from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export default function DownloadSection({ screenshots }) {
  const [isExporting, setIsExporting] = useState(false);

  const hasRendered = screenshots.some((s) => s.renderedDataUrl);

  const handleDownloadSingle = useCallback(
    (screenshot, index) => {
      if (!screenshot.renderedDataUrl) return;
      const link = document.createElement('a');
      link.download = `screenshot-${index + 1}.png`;
      link.href = screenshot.renderedDataUrl;
      link.click();
    },
    []
  );

  const handleDownloadAll = useCallback(async () => {
    const rendered = screenshots.filter((s) => s.renderedDataUrl);
    if (rendered.length === 0) return;

    setIsExporting(true);
    try {
      const zip = new JSZip();
      for (let i = 0; i < rendered.length; i++) {
        const dataUrl = rendered[i].renderedDataUrl;
        const base64 = dataUrl.split(',')[1];
        zip.file(`screenshot-${i + 1}.png`, base64, { base64: true });
      }
      const blob = await zip.generateAsync({ type: 'blob' });
      saveAs(blob, 'screenshots.zip');
    } catch (err) {
      // Error handled silently in production
    } finally {
      setIsExporting(false);
    }
  }, [screenshots]);

  return (
    <div className="bg-surface rounded-2xl border border-border p-6 space-y-4">
      <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
        Download
      </h3>

      {!hasRendered ? (
        <p className="text-muted text-sm">
          Preview your screenshots above to enable downloads.
        </p>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {screenshots.map((s, i) =>
              s.renderedDataUrl ? (
                <button
                  key={s.id}
                  onClick={() => handleDownloadSingle(s, i)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-background border border-border text-muted hover:text-white hover:border-muted transition-colors"
                >
                  <Download size={14} />
                  Screenshot {i + 1}
                </button>
              ) : null
            )}
          </div>

          <button
            onClick={handleDownloadAll}
            disabled={isExporting}
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium bg-primary hover:bg-primary-hover text-white transition-colors disabled:opacity-50"
          >
            <Archive size={16} />
            {isExporting ? 'Exporting...' : 'Download All as ZIP'}
          </button>
        </div>
      )}
    </div>
  );
}
