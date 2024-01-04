// QRCodeComponent.tsx
import React from 'react';
import QRCode from 'react-qr-code';

interface QRCodeProps {
  value: string;
}

const QRCodeGenerator: React.FC<QRCodeProps> = ({ value }) => {
  return (
    <div className="text-center text-white">
      <div
        className="p-4 bg-white rounded-md"
        style={{ maxWidth: 160, width: '100%' }}
      >
        <QRCode
          size={160}
          style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
          value={value}
          viewBox={`0 0 160 160`}
        />
      </div>
    </div>
  );
};

export default QRCodeGenerator;
