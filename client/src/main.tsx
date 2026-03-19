import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import * as faceapi from 'face-api.js';

// Load face-api.js models as early as possible
const loadModels = async () => {
  try {
    // Using CDN for the models to avoid including large model files
    const MODEL_URL = 'https://justadudewhohacks.github.io/face-api.js/models';
    
    await Promise.all([
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      // For liveness detection
      faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
    ]);
    
    console.log('Face recognition models loaded successfully');
  } catch (error) {
    console.error('Error loading face recognition models:', error);
  }
};

// Load models and then render the app
loadModels().then(() => {
  createRoot(document.getElementById("root")!).render(<App />);
});
