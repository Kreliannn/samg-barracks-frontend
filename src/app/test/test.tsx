"use client"
import { useState } from 'react';
import QRCode from 'react-qr-code';

interface ReactQRGeneratorProps {
  className?: string;
}

const ReactQRGenerator: React.FC<ReactQRGeneratorProps> = ({ className = '' }) => {
  const [text, setText] = useState('');
  const [showQR, setShowQR] = useState(false);

  const handleGenerate = () => {
    if (text.trim()) {
      setShowQR(true);
    }
  };

  const handleDownload = () => {
    const svg = document.getElementById('qr-code-svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = 'qrcode.png';
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  };

  return (
    <div className={`p-6 max-w-md mx-auto ${className}`}>
      <h2 className="text-2xl font-bold mb-4">React QR Code Generator</h2>
      
      <div className="mb-4">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text or URL"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        onClick={handleGenerate}
        disabled={!text.trim()}
        className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed mb-4"
      >
        Generate QR Code
      </button>

      {showQR && text && (
        <div className="text-center">
          <div className="mb-4 p-4 bg-white border border-gray-200 rounded inline-block">
            <QRCode
              id="qr-code-svg"
              value={text}
              size={256}
              bgColor="#ffffff"
              fgColor="#000000"
              level="M"
            />
          </div>
          <br />
          <button
            onClick={handleDownload}
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
          >
            Download QR Code
          </button>
        </div>
      )}
    </div>
  );
};

export default ReactQRGenerator;