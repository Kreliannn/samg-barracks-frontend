"use client";
import React, { useEffect, useRef, useCallback } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useState } from "react";
import { getRequestInterface } from "@/app/types/request.type";
import { X } from "lucide-react";
import Display from "./display";
import axiosInstance from "@/app/utils/axios";
import { useMutation } from "@tanstack/react-query";
import { errorAlert, successAlert } from "@/app/utils/alert";

interface QRScannerProps {
  onScan?: (data: string) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScan }) => {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const isInitializing = useRef(false);
  const isMounted = useRef(true);
  const onScanRef = useRef(onScan);

  const [request, setRequest] = useState<getRequestInterface | null>(null);
  const [showModal, setShowModal] = useState(false);


  const mutation = useMutation({
    mutationFn : (data : { id : string}) => axiosInstance.post("/request/one", data),
    onSuccess : (response) => {
        if(!response.data) return errorAlert("Not Found")
        setShowModal(true)
        setRequest(response.data)
        successAlert("data found")
    },
    onError : () => {
        errorAlert("Invalid Qr Code")
    }
  })


  // Update the callback ref when onScan changes
  useEffect(() => {
    onScanRef.current = onScan;
  }, [onScan]);

  const clearScanner = useCallback(async () => {
    if (scannerRef.current) {
      try {
        // Stop the scanner and clear resources
        await scannerRef.current.clear();
        console.log("Scanner cleared successfully");
      } catch (err) {
        console.error("Error clearing scanner:", err);
        // If clear() fails, try to force stop by accessing internal methods
        try {
          const scanner = scannerRef.current as any;
          if (scanner.html5QrcodeScanner) {
            await scanner.html5QrcodeScanner.stop();
          }
        } catch (forceErr) {
          console.error("Force stop also failed:", forceErr);
        }
      } finally {
        scannerRef.current = null;
      }
    }
  }, []);

  const initializeScanner = useCallback(async () => {
    if (isInitializing.current || !isMounted.current) {
      return;
    }

    isInitializing.current = true;

    try {
      const scannerId = "qr-reader";
      
      // Clear any existing scanner first
      await clearScanner();

      // Small delay to ensure cleanup is complete
      await new Promise(resolve => setTimeout(resolve, 100));

      if (!isMounted.current) {
        return;
      }

      // Clear the DOM element
      const scannerElement = document.getElementById(scannerId);
      if (scannerElement) {
        scannerElement.innerHTML = "";
      }

      // Create new scanner instance
      const scanner = new Html5QrcodeScanner(
        scannerId,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          rememberLastUsedCamera: true,
          aspectRatio: 1.0,
        },
        false
      );

      scannerRef.current = scanner;

      // Render the scanner
      scanner.render(
        (decodedText) => {
          console.log("Scanned:", decodedText);
          mutation.mutate({id : decodedText})
          onScanRef.current?.(decodedText);
        },
        (error) => {
          // Handle scan errors silently (these are usually just "no QR code found" messages)
          // console.warn("QR scan error:", error);
        }
      );

      console.log("Scanner initialized successfully");
    } catch (error) {
      console.error("Error initializing scanner:", error);
    } finally {
      isInitializing.current = false;
    }
  }, [clearScanner]);

  useEffect(() => {
    isMounted.current = true;
    
    // Initialize scanner after a small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      initializeScanner();
    }, 200);

    // Cleanup function
    return () => {
      isMounted.current = false;
      clearTimeout(timeoutId);
      
      // Synchronous cleanup to prevent race conditions
      if (scannerRef.current) {
        try {
          // Try to clear immediately
          scannerRef.current.clear().catch(err => {
            console.error("Cleanup error:", err);
          });
        } catch (err) {
          console.error("Immediate cleanup error:", err);
        } finally {
          scannerRef.current = null;
        }
      }
    };
  }, []); // Empty dependency array - only run once



  return (
    <>
    
    <div className="flex flex-col justify-center items-center min-h-screen">
      <h2 className="text-xl font-bold mb-4">QR Code Scanner</h2>
      <div id="qr-reader" className="w-full max-w-xs" />
      <p className="text-sm text-gray-600 mt-4">
        Allow camera access to start scanning
      </p>
    </div>
    
    
    
    
    {showModal && request && (
        <Display  setShowModal={setShowModal} request={request} />
    )}
    </>
   
  );
};

export default QRScanner;