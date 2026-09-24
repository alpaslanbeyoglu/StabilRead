import { useEffect, useRef, useState, useCallback } from 'react';
import { EyeTrackingConfig, EyeTrackingData } from '../types';
import { KalmanFilter1D } from '../utils/physics';

export function useEyeTracker(config: EyeTrackingConfig) {
  const [data, setData] = useState<EyeTrackingData>({
    isActive: false,
    hasCameraPermission: false,
    isCalibrated: false,
    leftEye: { x: 0, y: 0, pupilSize: 0, open: true },
    rightEye: { x: 0, y: 0, pupilSize: 0, open: true },
    gazeVector: { x: 0, y: 0 },
    headTilt: { roll: 0, pitch: 0 },
    confidence: 0,
    fps: 0,
    isBlinking: false,
    cameraError: null,
  });

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Calibration baseline
  const baselineRef = useRef<{
    leftX: number;
    leftY: number;
    rightX: number;
    rightY: number;
    eyeDist: number;
  }>({
    leftX: 0,
    leftY: 0,
    rightX: 0,
    rightY: 0,
    eyeDist: 0,
  });

  const isCalibratedRef = useRef(false);

  // Kalman filters for gaze displacement
  const kalmanGazeX = useRef(new KalmanFilter1D(0.2, 0.5));
  const kalmanGazeY = useRef(new KalmanFilter1D(0.2, 0.5));

  // FPS tracking
  const frameCountRef = useRef(0);
  const lastFpsTimeRef = useRef(performance.now());
  const currentFpsRef = useRef(30);

  // Start Camera
  const startCamera = useCallback(async (): Promise<boolean> => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 320 },
          height: { ideal: 240 },
          frameRate: { ideal: 30, max: 60 },
        },
        audio: false,
      });

      streamRef.current = stream;

      if (!videoRef.current) {
        const video = document.createElement('video');
        video.playsInline = true;
        video.muted = true;
        video.autoplay = true;
        videoRef.current = video;
      }

      videoRef.current.srcObject = stream;
      await videoRef.current.play();

      setData((prev) => ({
        ...prev,
        isActive: true,
        hasCameraPermission: true,
        cameraError: null,
      }));

      return true;
    } catch (err: any) {
      console.warn('Front camera eye-tracking permission denied or failed:', err);
      setData((prev) => ({
        ...prev,
        isActive: false,
        hasCameraPermission: false,
        cameraError: err.message || 'Kamera erişimi reddedildi veya bulunamadı.',
      }));
      return false;
    }
  }, []);

  // Stop Camera
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    setData((prev) => ({
      ...prev,
      isActive: false,
    }));
  }, []);

  // Calibrate Eyes to Center
  const calibrateEyeBaseline = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    isCalibratedRef.current = false;
    // Signal calibration reset
    setTimeout(() => {
      isCalibratedRef.current = true;
      setData((prev) => ({ ...prev, isCalibrated: true }));
    }, 300);
  }, []);

  // Sync Camera start/stop with config.enabled
  useEffect(() => {
    if (config.enabled && (config.trackingMode === 'eye-camera' || config.trackingMode === 'sensor-fusion')) {
      if (!streamRef.current) {
        startCamera();
      }
    } else {
      if (streamRef.current && config.trackingMode === 'imu-only') {
        stopCamera();
      }
    }

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [config.enabled, config.trackingMode, startCamera, stopCamera]);

  // Main High-Speed Computer Vision Eye Tracking Loop
  useEffect(() => {
    if (!config.enabled || (config.trackingMode !== 'eye-camera' && config.trackingMode !== 'sensor-fusion')) {
      return;
    }

    const processFrame = () => {
      const video = videoRef.current;
      if (!video || video.readyState < 2) {
        animFrameRef.current = requestAnimationFrame(processFrame);
        return;
      }

      if (!canvasRef.current) {
        canvasRef.current = document.createElement('canvas');
        canvasRef.current.width = 160; // Downscaled for ultra-low latency (60fps)
        canvasRef.current.height = 120;
      }

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) {
        animFrameRef.current = requestAnimationFrame(processFrame);
        return;
      }

      const W = canvas.width;
      const H = canvas.height;

      // Draw mirrored video frame
      ctx.save();
      ctx.scale(-1, 1);
      ctx.drawImage(video, -W, 0, W, H);
      ctx.restore();

      // Get image buffer
      const imgData = ctx.getImageData(0, 0, W, H);
      const pixels = imgData.data;

      // 1. Detect Face / Head Region using skin luminance & gradient
      // Face is typically in the central 70% of upper half
      const startX = Math.floor(W * 0.15);
      const endX = Math.floor(W * 0.85);
      const startY = Math.floor(H * 0.15);
      const endY = Math.floor(H * 0.75);

      // Eye bands
      // Left eye region (in mirrored frame)
      const leftEyeBox = {
        x1: Math.floor(W * 0.22),
        x2: Math.floor(W * 0.46),
        y1: Math.floor(H * 0.28),
        y2: Math.floor(H * 0.52),
      };

      // Right eye region
      const rightEyeBox = {
        x1: Math.floor(W * 0.54),
        x2: Math.floor(W * 0.78),
        y1: Math.floor(H * 0.28),
        y2: Math.floor(H * 0.52),
      };

      // Helper function to find pupil dark centroid
      const findPupilCenter = (box: { x1: number; x2: number; y1: number; y2: number }) => {
        let minBrightness = 255;
        let sumX = 0;
        let sumY = 0;
        let count = 0;
        let totalLuma = 0;
        let totalCount = 0;

        // First pass: find min luma
        for (let y = box.y1; y < box.y2; y++) {
          for (let x = box.x1; x < box.x2; x++) {
            const idx = (y * W + x) * 4;
            const r = pixels[idx];
            const g = pixels[idx + 1];
            const b = pixels[idx + 2];
            const luma = 0.299 * r + 0.587 * g + 0.114 * b;
            totalLuma += luma;
            totalCount++;
            if (luma < minBrightness) minBrightness = luma;
          }
        }

        const avgLuma = totalLuma / Math.max(1, totalCount);
        const darkThreshold = minBrightness + (avgLuma - minBrightness) * 0.35;

        // Second pass: centroid of dark pupil pixels
        for (let y = box.y1; y < box.y2; y++) {
          for (let x = box.x1; x < box.x2; x++) {
            const idx = (y * W + x) * 4;
            const r = pixels[idx];
            const g = pixels[idx + 1];
            const b = pixels[idx + 2];
            const luma = 0.299 * r + 0.587 * g + 0.114 * b;

            if (luma <= darkThreshold) {
              const weight = Math.max(1, darkThreshold - luma + 1);
              sumX += x * weight;
              sumY += y * weight;
              count += weight;
            }
          }
        }

        const pupilX = count > 0 ? sumX / count : (box.x1 + box.x2) / 2;
        const pupilY = count > 0 ? sumY / count : (box.y1 + box.y2) / 2;
        const isOpen = avgLuma > 40 && count > 8; // blink detection

        return { x: pupilX, y: pupilY, isOpen, luma: avgLuma };
      };

      const leftPupil = findPupilCenter(leftEyeBox);
      const rightPupil = findPupilCenter(rightEyeBox);

      // Blink detection
      const isBlinking = !leftPupil.isOpen || !rightPupil.isOpen;

      // Calibration setup
      if (!isCalibratedRef.current && leftPupil.isOpen && rightPupil.isOpen) {
        baselineRef.current = {
          leftX: leftPupil.x,
          leftY: leftPupil.y,
          rightX: rightPupil.x,
          rightY: rightPupil.y,
          eyeDist: Math.hypot(rightPupil.x - leftPupil.x, rightPupil.y - leftPupil.y),
        };
        isCalibratedRef.current = true;
      }

      // Calculate relative gaze displacement in pixels
      let rawGazeX = 0;
      let rawGazeY = 0;
      let headRoll = 0;
      let headPitch = 0;
      let confidence = 0;

      if (isCalibratedRef.current && !isBlinking) {
        const curCenterX = (leftPupil.x + rightPupil.x) / 2;
        const curCenterY = (leftPupil.y + rightPupil.y) / 2;
        const baseCenterX = (baselineRef.current.leftX + baselineRef.current.rightX) / 2;
        const baseCenterY = (baselineRef.current.leftY + baselineRef.current.rightY) / 2;

        // Scaling factor from camera coords to screen displacement pixels
        const scale = 5.0 * config.eyeSensitivity;
        rawGazeX = (curCenterX - baseCenterX) * scale;
        rawGazeY = (curCenterY - baseCenterY) * scale;

        // Head tilt
        const dx = rightPupil.x - leftPupil.x;
        const dy = rightPupil.y - leftPupil.y;
        headRoll = Math.atan2(dy, dx) * (180 / Math.PI);
        headPitch = (curCenterY - baseCenterY) * 1.5;

        confidence = Math.min(100, Math.max(30, Math.round(100 - Math.abs(rawGazeX) * 0.5)));
      }

      // Filter gaze movement
      const filteredGazeX = kalmanGazeX.current.update(rawGazeX);
      const filteredGazeY = kalmanGazeY.current.update(rawGazeY);

      // Calculate FPS
      frameCountRef.current++;
      const now = performance.now();
      if (now - lastFpsTimeRef.current >= 1000) {
        currentFpsRef.current = frameCountRef.current;
        frameCountRef.current = 0;
        lastFpsTimeRef.current = now;
      }

      if (frameCountRef.current % 2 === 0) {
        setData({
          isActive: true,
          hasCameraPermission: true,
          isCalibrated: isCalibratedRef.current,
          leftEye: {
            x: Number(leftPupil.x.toFixed(1)),
            y: Number(leftPupil.y.toFixed(1)),
            pupilSize: 14,
            open: leftPupil.isOpen,
          },
          rightEye: {
            x: Number(rightPupil.x.toFixed(1)),
            y: Number(rightPupil.y.toFixed(1)),
            pupilSize: 14,
            open: rightPupil.isOpen,
          },
          gazeVector: {
            x: Number(filteredGazeX.toFixed(1)),
            y: Number(filteredGazeY.toFixed(1)),
          },
          headTilt: {
            roll: Number(headRoll.toFixed(1)),
            pitch: Number(headPitch.toFixed(1)),
          },
          confidence: isBlinking ? 10 : confidence,
          fps: currentFpsRef.current,
          isBlinking,
          cameraError: null,
        });
      }

      animFrameRef.current = requestAnimationFrame(processFrame);
    };

    animFrameRef.current = requestAnimationFrame(processFrame);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [config.enabled, config.trackingMode, config.eyeSensitivity]);

  return {
    eyeData: data,
    videoRef,
    startCamera,
    stopCamera,
    calibrateEyeBaseline,
  };
}
