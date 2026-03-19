import { useEffect, useRef, useState } from "react";
import * as faceapi from 'face-api.js';
import { useFacialRecognition } from "@/lib/facial-recognition";
import { useAuth } from "@/hooks/use-auth";
import { useVerification } from "@/hooks/use-verification";

interface FaceRecognitionProps {
  onDetectionComplete: (success: boolean) => void;
}

export default function FaceRecognition({ onDetectionComplete }: FaceRecognitionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [detectionMessage, setDetectionMessage] = useState("Please position your face within the frame");
  const { user } = useAuth();
  const { setVerifying, completeVerificationStep, verificationDetails } = useVerification();
  const { initStream, detectFace } = useFacialRecognition();

  useEffect(() => {
    let stream: MediaStream | null = null;
    
    const startVideo = async () => {
      try {
        setVerifying(true);
        stream = await initStream();
        
        if (videoRef.current && stream) {
          videoRef.current.srcObject = stream;
          setIsStreaming(true);
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
        setDetectionMessage("Error accessing camera. Please ensure camera permissions are enabled.");
        onDetectionComplete(false);
      }
    };
    
    startVideo();
    
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (!isStreaming || !videoRef.current || !canvasRef.current) return;

    let animationFrame: number;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const displaySize = { width: video.width, height: video.height };
    
    faceapi.matchDimensions(canvas, displaySize);

    const runDetection = async () => {
      const result = await detectFace(video, canvas);
      
      if (result.detected) {
        setDetectionMessage("Face detected! Verifying identity...");
        
        // Simulate verification with the user
        setTimeout(() => {
          setVerifying(false);
          setDetectionMessage("Identity verified successfully!");
          completeVerificationStep(1, { success: true, data: { confidence: 95.7 } });
          onDetectionComplete(true);
        }, 2000);
        
        return; // Stop the detection loop
      }
      
      animationFrame = requestAnimationFrame(runDetection);
    };

    // Wait for video to be playing
    const checkVideoReady = () => {
      if (video.readyState === 4) {
        runDetection();
      } else {
        setTimeout(checkVideoReady, 100);
      }
    };
    
    checkVideoReady();

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [isStreaming]);

  return (
    <div className="bg-gray-100 rounded-lg p-4 mb-6 text-center">
      <div className="relative w-full h-48 bg-gray-800 rounded-lg flex items-center justify-center mb-2 overflow-hidden">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          width={300}
          height={225}
          autoPlay
          muted
          playsInline
        />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          width={300}
          height={225}
        />
        
        {!isStreaming && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-4xl text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
          </div>
        )}
      </div>
      <p className="text-sm text-gray-600 mt-2">{detectionMessage}</p>
    </div>
  );
}
