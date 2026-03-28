import React, { useEffect, useRef, useCallback } from 'react';

const BACKGROUND_STYLES = {
  'gradient-ocean': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'gradient-sunset': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'gradient-forest': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'gradient-midnight': 'linear-gradient(135deg, #0c0c1d 0%, #1a1a3e 100%)',
  'solid-white': '#ffffff',
  'solid-black': '#000000',
};

export default function PreviewGrid({
  screenshots,
  deviceFrame,
  backgroundStyle,
  captionPosition,
  onRenderedUpdate,
}) {
  return (
    <div className="bg-surface rounded-2xl border border-border p-6 space-y-4">
      <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
        Preview
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {screenshots.map((screenshot) => (
          <PreviewCard
            key={screenshot.id}
            screenshot={screenshot}
            deviceFrame={deviceFrame}
            backgroundStyle={backgroundStyle}
            captionPosition={captionPosition}
            onRenderedUpdate={onRenderedUpdate}
          />
        ))}
      </div>
    </div>
  );
}

function PreviewCard({
  screenshot,
  deviceFrame,
  backgroundStyle,
  captionPosition,
  onRenderedUpdate,
}) {
  const canvasRef = useRef(null);

  const renderPreview = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = 390;
    const height = 844;
    canvas.width = width;
    canvas.height = height;

    // Draw background
    const bgStyle = BACKGROUND_STYLES[backgroundStyle] || BACKGROUND_STYLES['gradient-ocean'];
    if (bgStyle.startsWith('linear-gradient')) {
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, '#667eea');
      gradient.addColorStop(1, '#764ba2');
      ctx.fillStyle = gradient;
    } else {
      ctx.fillStyle = bgStyle;
    }
    ctx.fillRect(0, 0, width, height);

    // Draw screenshot image
    const img = new Image();
    img.onload = () => {
      const caption = screenshot.customCaption || screenshot.selectedCaption || '';
      const captionHeight = caption ? 80 : 0;
      const padding = 20;
      const imgX = padding;
      const imgY = captionPosition === 'top' ? captionHeight + padding : padding;
      const imgW = width - padding * 2;
      const imgH = height - captionHeight - padding * 2;

      // Draw rounded rect for device frame
      const radius = deviceFrame !== 'none' ? 24 : 0;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(imgX + radius, imgY);
      ctx.lineTo(imgX + imgW - radius, imgY);
      ctx.quadraticCurveTo(imgX + imgW, imgY, imgX + imgW, imgY + radius);
      ctx.lineTo(imgX + imgW, imgY + imgH - radius);
      ctx.quadraticCurveTo(imgX + imgW, imgY + imgH, imgX + imgW - radius, imgY + imgH);
      ctx.lineTo(imgX + radius, imgY + imgH);
      ctx.quadraticCurveTo(imgX, imgY + imgH, imgX, imgY + imgH - radius);
      ctx.lineTo(imgX, imgY + radius);
      ctx.quadraticCurveTo(imgX, imgY, imgX + radius, imgY);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(img, imgX, imgY, imgW, imgH);
      ctx.restore();

      // Draw caption
      if (caption) {
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px -apple-system, sans-serif';
        ctx.textAlign = 'center';
        const captionY =
          captionPosition === 'top' ? captionHeight / 2 + 10 : height - captionHeight / 2 + 10;
        ctx.fillText(caption, width / 2, captionY, width - 40);
      }

      // Export rendered data URL
      const renderedDataUrl = canvas.toDataURL('image/png');
      onRenderedUpdate(screenshot.id, { renderedDataUrl });
    };
    img.src = screenshot.dataUrl;
  }, [screenshot, deviceFrame, backgroundStyle, captionPosition, onRenderedUpdate]);

  useEffect(() => {
    renderPreview();
  }, [renderPreview]);

  return (
    <div className="rounded-lg overflow-hidden border border-border bg-background">
      <canvas
        ref={canvasRef}
        className="w-full h-auto"
        style={{ aspectRatio: '9/19.5' }}
      />
    </div>
  );
}
