'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import QrScanner from 'qr-scanner';
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const qrScannerRef = useRef<QrScanner | null>(null);

  // Use a ref to track if we've already processed a scan (prevents race conditions)
  const hasScannedRef = useRef(false);

  // Track if we've already called onScanSuccess for this scan
  const hasCalledCallbackRef = useRef(false);

  // Store the callback in a ref to avoid useEffect dependency issues
  const onScanSuccessRef = useRef(onScanSuccess);

  useEffect(() => {
    onScanSuccessRef.current = onScanSuccess;
  }, [onScanSuccess]);

  useEffect(() => {
    if (!videoRef.current) return;

    hasScannedRef.current = false;
    hasCalledCallbackRef.current = false;

    console.log('[QRCodeReader] Initializing scanner...');

    qrScannerRef.current = new QrScanner(
      videoRef.current,
      (result) => {
        if (hasScannedRef.current) {
          console.log('[QRCodeReader] Ignoring duplicate scan, already processed');
          return;
        }

        hasScannedRef.current = true;
        
        console.log('[QRCodeReader] QR Code detected:', result.data);
        console.log('[QRCodeReader] Stopping scanner...');
        
        qrScannerRef.current?.stop();
        
        setDecodedValue(result.data);

        if (!hasCalledCallbackRef.current && onScanSuccessRef.current) {
          hasCalledCallbackRef.current = true;
          console.log('[QRCodeReader] Calling onScanSuccess with:', result.data);
          onScanSuccessRef.current(result.data);
        }
      },
      {
        returnDetailedScanResult: true,
        highlightScanRegion: true,
        highlightCodeOutline: true,
        ...extraConfig,
      }
    );

    qrScannerRef.current.start()
      .catch((err) => {
        console.error('[QRCodeReader] Scanner start error:', err);
        setError(err?.message || 'Failed to start camera');
      });

    return () => {
      qrScannerRef.current?.destroy();
      qrScannerRef.current = null;
    };
  }, [uniquifier]);

  return (
    <div>
      {displayError && error && <p className="text-red-500">{error}</p>}
      <div
        id={`qr-reader-${uniquifier}`}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '400px',
        }}
      >
        <video
          ref={videoRef}
          style={{
            width: '100%',
            borderRadius: '8px',
          }}
        />
      </div>
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
