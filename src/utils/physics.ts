import { FilterAlgorithm, VehicleType } from '../types';

/**
 * 1D Kalman filter state
 */
export class KalmanFilter1D {
  private q: number; // process noise covariance
  private r: number; // measurement noise covariance
  private x: number; // estimated value
  private p: number; // estimation error covariance
  private k: number; // kalman gain

  constructor(q = 0.1, r = 0.8, initialValue = 0) {
    this.q = q;
    this.r = r;
    this.x = initialValue;
    this.p = 1.0;
    this.k = 0;
  }

  update(measurement: number): number {
    // Prediction update
    this.p = this.p + this.q;

    // Measurement update
    this.k = this.p / (this.p + this.r);
    this.x = this.x + this.k * (measurement - this.x);
    this.p = (1 - this.k) * this.p;

    return this.x;
  }

  reset(val = 0) {
    this.x = val;
    this.p = 1.0;
  }
}

/**
 * 2D Spring-Damper System to smoothly return text to center
 */
export class SpringDamper2D {
  public x = 0;
  public y = 0;
  private vx = 0;
  private vy = 0;
  private stiffness: number;
  private damping: number;

  constructor(stiffness = 180, damping = 18) {
    this.stiffness = stiffness;
    this.damping = damping;
  }

  update(targetX: number, targetY: number, dt: number): { x: number; y: number } {
    const clampedDt = Math.min(dt, 0.05); // prevent exploding on tab switch

    const fx = this.stiffness * (targetX - this.x) - this.damping * this.vx;
    const fy = this.stiffness * (targetY - this.y) - this.damping * this.vy;

    this.vx += fx * clampedDt;
    this.vy += fy * clampedDt;

    this.x += this.vx * clampedDt;
    this.y += this.vy * clampedDt;

    return { x: this.x, y: this.y };
  }

  reset() {
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
  }
}

/**
 * Synthetic Vehicle Motion Generator for desktop/room testing
 */
export class VehicleVibrationSynthesizer {
  private time = 0;
  private lastShockTime = 0;
  private shockDecayX = 0;
  private shockDecayY = 0;

  // Preset configuration
  public type: VehicleType = 'car';
  public intensity = 1.0; // 0.0 to 2.5
  public customFreq = 12;
  public customAmp = 15;
  public customRoughness = 0.5;

  generate(dt: number): {
    screenShakeX: number;
    screenShakeY: number;
    simulatedAx: number;
    simulatedAy: number;
    intensityPct: number;
  } {
    this.time += dt;

    let baseFreq = 8;
    let baseAmp = 14;
    let roughness = 0.6;
    let shockProb = 0.008;

    switch (this.type) {
      case 'car':
        // High frequency gravel vibrations + random medium road swells
        baseFreq = 14;
        baseAmp = 12 * this.intensity;
        roughness = 0.7;
        shockProb = 0.015;
        break;
      case 'bus':
        // Low frequency diesel rumble + large braking/lurching swells
        baseFreq = 6;
        baseAmp = 18 * this.intensity;
        roughness = 0.45;
        shockProb = 0.02;
        break;
      case 'train':
        // Rhythmic track oscillations with harmonic frequency
        baseFreq = 9;
        baseAmp = 10 * this.intensity;
        roughness = 0.3;
        shockProb = 0.005;
        break;
      case 'walk':
        // Walking/jogging harmonic bobbing (vertical dominant)
        baseFreq = 2.8;
        baseAmp = 22 * this.intensity;
        roughness = 0.25;
        shockProb = 0.002;
        break;
      case 'offroad':
        // Heavy rock crawling / severe bumps
        baseFreq = 11;
        baseAmp = 28 * this.intensity;
        roughness = 0.95;
        shockProb = 0.04;
        break;
      case 'custom':
        baseFreq = this.customFreq;
        baseAmp = this.customAmp * this.intensity;
        roughness = this.customRoughness;
        shockProb = 0.01;
        break;
    }

    if (this.intensity === 0) {
      return {
        screenShakeX: 0,
        screenShakeY: 0,
        simulatedAx: 0,
        simulatedAy: 0,
        intensityPct: 0,
      };
    }

    // Harmonic Sine waves
    const t = this.time;
    const w1 = 2 * Math.PI * baseFreq;
    const w2 = 2 * Math.PI * (baseFreq * 1.618); // Golden ratio harmonic
    const w3 = 2 * Math.PI * (baseFreq * 0.42);

    // Multi-layered oscillation
    let noiseX =
      Math.sin(w1 * t) * 0.5 +
      Math.sin(w2 * t * 1.3 + 1.2) * 0.3 +
      (Math.random() - 0.5) * roughness * 0.8;

    let noiseY =
      Math.cos(w1 * t * 0.9) * 0.6 +
      Math.sin(w3 * t * 2.1 + 0.8) * 0.4 +
      (Math.random() - 0.5) * roughness * 0.9;

    // Special behavior for walking (vertical emphasis)
    if (this.type === 'walk') {
      noiseY = Math.abs(Math.sin(w1 * t)) * 1.4 - 0.7 + (Math.random() - 0.5) * 0.2;
      noiseX = Math.sin(w1 * t * 0.5) * 0.5;
    }

    // Sudden pothole / bump impulse
    if (Math.random() < shockProb && t - this.lastShockTime > 1.2) {
      this.lastShockTime = t;
      this.shockDecayX = (Math.random() - 0.5) * baseAmp * 2.2;
      this.shockDecayY = (Math.random() * 2 - 0.5) * baseAmp * 2.8;
    }

    // Decay shocks
    this.shockDecayX *= 0.88;
    this.shockDecayY *= 0.88;

    const totalShakeX = noiseX * baseAmp + this.shockDecayX;
    const totalShakeY = noiseY * baseAmp + this.shockDecayY;

    // Simulated acceleration (m/s^2) roughly proportional to displacement * omega^2
    const simulatedAx = (totalShakeX / 10) * (baseFreq / 5);
    const simulatedAy = (totalShakeY / 10) * (baseFreq / 5);

    const currentAmp = Math.sqrt(totalShakeX * totalShakeX + totalShakeY * totalShakeY);
    const intensityPct = Math.min(100, Math.round((currentAmp / 35) * 100));

    return {
      screenShakeX: totalShakeX,
      screenShakeY: totalShakeY,
      simulatedAx,
      simulatedAy,
      intensityPct,
    };
  }

  reset() {
    this.time = 0;
    this.lastShockTime = 0;
    this.shockDecayX = 0;
    this.shockDecayY = 0;
  }
}

/**
 * Bionic reading helper: Highlights initial letters of words
 */
export function formatBionicText(text: string): string {
  if (!text) return '';
  return text
    .split(' ')
    .map((word) => {
      if (word.length <= 1) return word;
      const mid = Math.ceil(word.length * 0.45);
      const start = word.slice(0, mid);
      const end = word.slice(mid);
      return `<strong>${start}</strong>${end}`;
    })
    .join(' ');
}
