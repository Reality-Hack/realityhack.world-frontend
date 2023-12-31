// QRCodeComponent.tsx
import React from "react";
import QRCode from "react-qr-code";

interface QRCodeProps {
  value: string;
}

const QRCodeGenerator: React.FC<QRCodeProps> = ({ value }) => {
  return (
    <div className="flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 p-6 rounded-lg shadow-lg">
      <div className="text-white text-center">
        <p className="text-lg font-bold mb-4">Check In</p>
        <div
          className="border-4 border-white rounded-md p-4"
          style={{ maxWidth: 300, width: "100%" }}
        >
          <QRCode
            size={256}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            value={value}
            viewBox={`0 0 256 256`}
          />
        </div>
      </div>
    </div>
  );
};

export default QRCodeGenerator;
