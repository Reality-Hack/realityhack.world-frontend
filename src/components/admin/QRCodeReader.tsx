'use client';

// QRCodeComponent.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import '@/app/globals.css';

const QRCodeReader = ({
  onScanSuccess
}: {
  onScanSuccess?: (userId: string) => void;
}) => {
  const [decodedValue, setDecodedValue] = useState<string | null>(null);
  const [_error, setError] = useState<string | null>(null);
  const qrScannerRef = useRef<Html5QrcodeScanner | null>(null);

  const qrCodeSuccessCallback = (decodedText: string) => {
    setDecodedValue(decodedText);
  };

  const qrCodeErrorCallback = (errorMessage: string) => {
    setError(errorMessage);
  };

  useEffect(() => {
    qrScannerRef.current = new Html5QrcodeScanner(
      'qr-reader',
      { fps: 2, qrbox: 250, aspectRatio: 1.7777778 },
      false
    );
    qrScannerRef.current.render(qrCodeSuccessCallback, qrCodeErrorCallback);

    return () => {
      qrScannerRef.current?.clear();
    };
  }, []);

  useEffect(() => {
    if (decodedValue && onScanSuccess) {
      onScanSuccess(decodedValue);
    }
  }, [decodedValue, onScanSuccess]);

  return (
    <div>
      {decodedValue ? <div></div> : <div id="qr-reader" />}

      <div className="checkin-text">
        <div className="mb-4 text-lg">
          {decodedValue ? (
            <p className="text-green-500">Value: {decodedValue}</p>
          ) : (
            'Looking for User'
          )}
        </div>
      </div>
    </div>
  );
};

export default QRCodeReader;
