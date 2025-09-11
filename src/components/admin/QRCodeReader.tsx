'use client';

// QRCodeComponent.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import '@/app/globals.css';

const QRCodeReader = ({
  onScanSuccess,
  displayCheckinText = false, 
  displayError = false,
  uniquifier = 'default',
  extraConfig = {}
}: {
  onScanSuccess?: (userId: string) => void;
  displayCheckinText?: boolean;
  displayError?: boolean;
  uniquifier?: string;
  extraConfig?: object;
}) => {
  const [decodedValue, setDecodedValue] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const qrScannerRef = useRef<Html5QrcodeScanner | null>(null);

  const qrCodeSuccessCallback = (decodedText: string) => {
    setDecodedValue(decodedText);
  };

  const qrCodeErrorCallback = (errorMessage: string) => {
    setError(errorMessage);
  };

  useEffect(() => {
    qrScannerRef.current = new Html5QrcodeScanner(
      `qr-reader-${uniquifier}`,
      { fps: 2, qrbox: 250, aspectRatio: 1.7777778, ...extraConfig },
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
      {displayError && error && <p className="text-red-500">{error}</p>}
      {decodedValue ? <div></div> : <div id={`qr-reader-${uniquifier}`} />}
      {displayCheckinText && (
        <div className="checkin-text">
          <div className="mb-4 text-lg">
            {decodedValue ? (
              <p className="text-green-500">Value: {decodedValue}</p>
            ) : (
              'Looking for User'
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default QRCodeReader;
