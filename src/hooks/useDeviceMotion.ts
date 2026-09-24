import { useState, useEffect, useRef, useCallback } from 'react';
import { EyeTrackingConfig, EyeTrackingData, MotionData, StabilizationConfig, VehicleType } from '../types';
import { KalmanFilter1D, SpringDamper2D, VehicleVibrationSynthesizer } from '../utils/physics';

interface UseDeviceMotionReturn {
  motionData: MotionData;
  screenShake: { x: number; y: number }; // The vehicle vibration applied to the container
  contentOffset: { x: number; y: number }; // The counter-stabilization applied to text
  isHardwareAvailable: boolean;
  isPermissionGranted: boolean;
  requestPermission: () => Promise<boolean>;
  calibrate: () => void;
  // Simulator controls
  simulatorActive: boolean;
  setSimulatorActive: (active: boolean) => void;
  vehicleType: VehicleType;
  setVehicleType: (type: VehicleType) => void;
  simIntensity: number;
  setSimIntensity: (intensity: number) => void;
  triggerManualBump: () => void;
  rawHistory: { x: number; y: number; t: number }[];
  stabilizedHistory: { x: number; y: number; t: number }[];
  efficiencyPct: number;
}

export function useDeviceMotion(
  config: StabilizationConfig,
  eyeData?: EyeTrackingData,
  eyeConfig?: EyeTrackingConfig
): UseDeviceMotionReturn {
  const [isHardwareAvailable, setIsHardwareAvailable] = useState<boolean>(false);
  const [isPermissionGranted, setIsPermissionGranted] = useState<boolean>(false);
  const [simulatorActive, setSimulatorActive] = useState<boolean>(true); // Default to on for immediate testing
  const [vehicleType, setVehicleType] = useState<VehicleType>('car');
  const [simIntensity, setSimIntensity] = useState<number>(1.0);
  const [efficiencyPct, setEfficiencyPct] = useState<number>(92);

  // Output states
  const [motionData, setMotionData] = useState<MotionData>({
    ax: 0,
    ay: 0,
    az: 0,
    rotAlpha: 0,
    rotBeta: 0,
    rotGamma: 0,
    offsetX: 0,
    offsetY: 0,
    residualJitter: 0,
    shakeIntensity: 0,
    isHardwareSensor: false,
    timestamp: Date.now(),
  });

  const [screenShake, setScreenShake] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [contentOffset, setContentOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Refs for high performance 60fps loop
  const kalmanX = useRef(new KalmanFilter1D(0.15, 0.6));
  const kalmanY = useRef(new KalmanFilter1D(0.15, 0.6));
  const springDamper = useRef(new SpringDamper2D(160, 20));
  const synthRef = useRef(new VehicleVibrationSynthesizer());

  // Eye gaze ref to avoid re-renders inside 60fps physics loop
  const eyeGazeRef = useRef({ x: 0, y: 0, active: false, weight: 0.5 });
  useEffect(() => {
    if (eyeData && eyeConfig && eyeConfig.enabled) {
      eyeGazeRef.current = {
        x: eyeData.gazeVector.x,
        y: eyeData.gazeVector.y,
        active: eyeData.isActive && !eyeData.isBlinking,
        weight:
          eyeConfig.trackingMode === 'eye-camera'
            ? 1.0
            : eyeConfig.trackingMode === 'imu-only'
            ? 0.0
            : eyeConfig.fusionWeight,
      };
    } else {
      eyeGazeRef.current.active = false;
    }
  }, [eyeData, eyeConfig]);

  // Hardware sensor readings
  const rawAx = useRef(0);
  const rawAy = useRef(0);
  const rawAz = useRef(0);
  const gravX = useRef(0);
  const gravY = useRef(0);
  const hasReceivedHardware = useRef(false);

  // Calibration bias
  const biasX = useRef(0);
  const biasY = useRef(0);

  // Waveform histories
  const rawHistRef = useRef<{ x: number; y: number; t: number }[]>([]);
  const stabHistRef = useRef<{ x: number; y: number; t: number }[]>([]);
  const [rawHistory, setRawHistory] = useState<{ x: number; y: number; t: number }[]>([]);
  const [stabilizedHistory, setStabilizedHistory] = useState<{ x: number; y: number; t: number }[]>([]);

  // Update synthesizer parameters
  useEffect(() => {
    synthRef.current.type = vehicleType;
    synthRef.current.intensity = simulatorActive ? simIntensity : 0;
  }, [vehicleType, simIntensity, simulatorActive]);

  // Request iOS Sensor Permissions
  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (
      typeof window !== 'undefined' &&
      typeof (DeviceMotionEvent as unknown as { requestPermission?: () => Promise<string> }).requestPermission === 'function'
    ) {
      try {
        const permission = await (DeviceMotionEvent as unknown as { requestPermission: () => Promise<string> }).requestPermission();
        if (permission === 'granted') {
          setIsPermissionGranted(true);
          setIsHardwareAvailable(true);
          setSimulatorActive(false); // Switch to real sensor once permission is given
          return true;
        }
      } catch (err) {
        console.warn('Sensor permission error:', err);
      }
      return false;
    } else if (typeof window !== 'undefined' && 'DeviceMotionEvent' in window) {
      setIsPermissionGranted(true);
      setIsHardwareAvailable(true);
      return true;
    }
    return false;
  }, []);

  // Check hardware availability on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'DeviceMotionEvent' in window) {
      setIsHardwareAvailable(true);
    }
  }, []);

  // Hardware event listener
  useEffect(() => {
    const handleMotion = (event: DeviceMotionEvent) => {
      hasReceivedHardware.current = true;
      const acc = event.acceleration;
      const accGrav = event.accelerationIncludingGravity;

      if (acc && acc.x !== null && acc.y !== null) {
        rawAx.current = acc.x;
        rawAy.current = acc.y;
        rawAz.current = acc.z || 0;
      } else if (accGrav && accGrav.x !== null && accGrav.y !== null) {
        // High-pass filter gravity isolation: alpha = 0.8
        const alpha = 0.8;
        gravX.current = alpha * gravX.current + (1 - alpha) * (accGrav.x || 0);
        gravY.current = alpha * gravY.current + (1 - alpha) * (accGrav.y || 0);
        rawAx.current = (accGrav.x || 0) - gravX.current;
        rawAy.current = (accGrav.y || 0) - gravY.current;
      }
    };

    window.addEventListener('devicemotion', handleMotion);
    return () => {
      window.removeEventListener('devicemotion', handleMotion);
    };
  }, []);

  // Calibrate baseline
  const calibrate = useCallback(() => {
    biasX.current = rawAx.current;
    biasY.current = rawAy.current;
    kalmanX.current.reset();
    kalmanY.current.reset();
    springDamper.current.reset();
  }, []);

  const triggerManualBump = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.generate(0.016);
      // Inject sudden shock
      synthRef.current.reset();
    }
  }, []);

  // Main 60fps Physics & Stabilization Loop
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();
    let frameCount = 0;

    const loop = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.05);
      lastTime = currentTime;
      frameCount++;

      // 1. Get Simulation Vibration
      const synth = synthRef.current.generate(dt);

      // 2. Combine Hardware + Simulation
      let totalShakeX = synth.screenShakeX;
      let totalShakeY = synth.screenShakeY;
      let effAx = synth.simulatedAx;
      let effAy = synth.simulatedAy;

      if (hasReceivedHardware.current && isPermissionGranted) {
        const hwX = (rawAx.current - biasX.current) * 8.0;
        const hwY = -(rawAy.current - biasY.current) * 8.0; // Invert Y for screen coords
        totalShakeX += hwX;
        totalShakeY += hwY;
        effAx += rawAx.current;
        effAy += rawAy.current;
      }

      // 3. Stabilization Math (Counter-Motion + Sensor Fusion)
      let targetCompX = 0;
      let targetCompY = 0;

      if (config.enabled) {
        const rawCompX = -totalShakeX * config.sensitivity * (config.invertX ? -1 : 1);
        const rawCompY = -totalShakeY * config.sensitivity * (config.invertY ? -1 : 1);

        // Apply Axis Lock
        let candidateX = config.axisLock === 'vertical-only' ? 0 : rawCompX;
        let candidateY = config.axisLock === 'horizontal-only' ? 0 : rawCompY;

        // Apply Deadband
        if (Math.abs(candidateX) < config.deadbandPx) candidateX = 0;
        if (Math.abs(candidateY) < config.deadbandPx) candidateY = 0;

        // Apply Filter Algorithm
        if (config.filterAlgorithm === 'kalman') {
          targetCompX = kalmanX.current.update(candidateX);
          targetCompY = kalmanY.current.update(candidateY);
        } else if (config.filterAlgorithm === 'spring') {
          const spring = springDamper.current.update(candidateX, candidateY, dt);
          targetCompX = spring.x;
          targetCompY = spring.y;
        } else if (config.filterAlgorithm === 'adaptive') {
          // Adaptive: mixes kalman for small vibrations and fast inertial for sudden bumps
          const kX = kalmanX.current.update(candidateX);
          const kY = kalmanY.current.update(candidateY);
          const speed = Math.sqrt(effAx * effAx + effAy * effAy);
          const blend = Math.min(1, speed / 5);
          targetCompX = kX * (1 - blend) + candidateX * blend;
          targetCompY = kY * (1 - blend) + candidateY * blend;
        } else {
          // Raw Inertial
          targetCompX = candidateX;
          targetCompY = candidateY;
        }

        // 4. Sensor Fusion: Blend with Front Camera Eye Gaze Vector
        if (eyeGazeRef.current.active) {
          const w = eyeGazeRef.current.weight; // 0 to 1
          const eyeCompX = -eyeGazeRef.current.x * (config.invertX ? -1 : 1);
          const eyeCompY = -eyeGazeRef.current.y * (config.invertY ? -1 : 1);

          targetCompX = (1 - w) * targetCompX + w * eyeCompX;
          targetCompY = (1 - w) * targetCompY + w * eyeCompY;
        }

        // Apply Max Envelope Clamp with soft knee
        const dist = Math.sqrt(targetCompX * targetCompX + targetCompY * targetCompY);
        if (dist > config.maxEnvelopePx) {
          const ratio = config.maxEnvelopePx / dist;
          targetCompX *= ratio;
          targetCompY *= ratio;
        }
      }

      // Net residual jitter seen by eye
      const netX = totalShakeX + targetCompX;
      const netY = totalShakeY + targetCompY;
      const residualMag = Math.sqrt(netX * netX + netY * netY);
      const rawMag = Math.sqrt(totalShakeX * totalShakeX + totalShakeY * totalShakeY);

      // Store in high-frequency history for oscilloscope
      const now = performance.now();
      rawHistRef.current.push({ x: totalShakeX, y: totalShakeY, t: now });
      stabHistRef.current.push({ x: netX, y: netY, t: now });

      if (rawHistRef.current.length > 90) rawHistRef.current.shift();
      if (stabHistRef.current.length > 90) stabHistRef.current.shift();

      // Update React state at ~30-60fps
      setScreenShake({ x: totalShakeX, y: totalShakeY });
      setContentOffset({ x: targetCompX, y: targetCompY });

      if (frameCount % 3 === 0) {
        const shakeIntensity = Math.min(100, Math.round((rawMag / 30) * 100));
        const computedEfficiency =
          rawMag > 0.5
            ? Math.max(10, Math.min(98, Math.round((1 - residualMag / (rawMag + 0.001)) * 100)))
            : 95;

        setEfficiencyPct(config.enabled ? computedEfficiency : 0);

        setMotionData({
          ax: Number(effAx.toFixed(2)),
          ay: Number(effAy.toFixed(2)),
          az: Number(rawAz.current.toFixed(2)),
          rotAlpha: 0,
          rotBeta: 0,
          rotGamma: 0,
          offsetX: Number(targetCompX.toFixed(1)),
          offsetY: Number(targetCompY.toFixed(1)),
          residualJitter: Number(residualMag.toFixed(1)),
          shakeIntensity,
          isHardwareSensor: hasReceivedHardware.current,
          timestamp: Date.now(),
        });

        setRawHistory([...rawHistRef.current]);
        setStabilizedHistory([...stabHistRef.current]);
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [config, isPermissionGranted]);

  return {
    motionData,
    screenShake,
    contentOffset,
    isHardwareAvailable,
    isPermissionGranted,
    requestPermission,
    calibrate,
    simulatorActive,
    setSimulatorActive,
    vehicleType,
    setVehicleType,
    simIntensity,
    setSimIntensity,
    triggerManualBump,
    rawHistory,
    stabilizedHistory,
    efficiencyPct,
  };
}

