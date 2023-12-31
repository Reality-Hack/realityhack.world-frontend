'use client';

// QRCodeComponent.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import '@/app/globals.css'; 


const QRCodeReader = () => {
  const [userId, setUserId] = useState<string | null>('');
  const [error, setError] = useState<string | null>(null);
  const qrScannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    
    const qrCodeSuccessCallback = (decodedText: string) => {
      setUserId(decodedText);
      setError(null); 
    };

    const qrCodeErrorCallback = (errorMessage: string) => {
      setError(errorMessage); // Update error state
    };


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

  return (
    <div>
      {
        userId ? <div></div> : <div id="qr-reader" />
      }
      
      <div className="checkin-text">
        <p className="mb-4 text-lg">{userId ? <p className="text-green-500">Checked In {userId}</p>: 'Looking for User'}</p>
      </div>
    </div>
  );
};

export default QRCodeReader;