import * as faceapi from 'face-api.js';

// Minimum confidence level for face detection (0-1)
const FACE_DETECTION_CONFIDENCE = 0.7;
// Minimum confidence level for face matching (0-1)
const FACE_MATCHING_CONFIDENCE = 0.6;

export interface FaceDetectionResult {
  detected: boolean;
  confidence?: number;
  faceDescriptor?: Float32Array;
  error?: string;
}

export function useFacialRecognition() {

  /**
   * Initialize the webcam stream
   */
  const initStream = async (): Promise<MediaStream> => {
    try {
      return await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }
      });
    } catch (error) {
      console.error("Error accessing webcam:", error);
      throw new Error("Camera access denied. Please enable camera permissions.");
    }
  };

  /**
   * Detect a face in the video stream
   */
  const detectFace = async (
    video: HTMLVideoElement,
    canvas: HTMLCanvasElement
  ): Promise<FaceDetectionResult> => {
    try {
      // Use SSD MobileNet for faster detection
      const options = new faceapi.SsdMobilenetv1Options({ 
        minConfidence: FACE_DETECTION_CONFIDENCE 
      });
      
      const detections = await faceapi
        .detectSingleFace(video, options)
        .withFaceLandmarks()
        .withFaceDescriptor();

      const displaySize = { width: video.width, height: video.height };
      
      // Reset detection canvas
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }

      if (detections) {
        // Draw detection results on canvas
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        
        // Apply Adversarial Defense - Check for potential spoofing with simple heuristics
        // In a real system, this would use more sophisticated techniques
        const faceBox = resizedDetections.detection.box;
        const aspectRatio = faceBox.width / faceBox.height;
        
        // Typical human face has aspect ratio around 0.75-0.85
        if (aspectRatio < 0.6 || aspectRatio > 1.0) {
          return {
            detected: false,
            error: "Unusual face proportions detected. Possible spoofing attempt."
          };
        }
        
        return {
          detected: true,
          confidence: resizedDetections.detection.score,
          faceDescriptor: detections.descriptor
        };
      }
      
      return { detected: false };
    } catch (error) {
      console.error("Face detection error:", error);
      return { 
        detected: false, 
        error: "Error during face detection" 
      };
    }
  };



  /**
   * Verify face against stored descriptor
   */
  const verifyFace = (
    currentDescriptor: Float32Array,
    storedDescriptor: Float32Array
  ): { matched: boolean; confidence: number } => {
    // Calculate Euclidean distance between descriptors
    const distance = faceapi.euclideanDistance(currentDescriptor, storedDescriptor);
    
    // Convert distance to similarity (1 = perfect match, 0 = completely different)
    const similarity = 1 - distance;
    
    return {
      matched: similarity >= FACE_MATCHING_CONFIDENCE,
      confidence: Math.round(similarity * 100) // Convert to percentage
    };
  };

  return {
    initStream,
    detectFace,
    verifyFace
  };
}
