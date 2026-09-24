export type ReadingTheme = 'dark' | 'light' | 'sepia' | 'oled' | 'forest';

export type FontFamily = 'sans' | 'serif' | 'dyslexic' | 'mono';

export type VehicleType = 'car' | 'bus' | 'train' | 'walk' | 'offroad' | 'custom';

export type FilterAlgorithm = 'kalman' | 'inertial' | 'spring' | 'adaptive';

export type ViewMode = 'reader' | 'rsvp' | 'split' | 'lab' | 'challenge';

export interface MotionData {
  // Raw accelerometer in m/s^2
  ax: number;
  ay: number;
  az: number;
  // Rotation rate in deg/s
  rotAlpha: number;
  rotBeta: number;
  rotGamma: number;
  // Computed counter-shift in pixels
  offsetX: number;
  offsetY: number;
  // Residual perceived jitter
  residualJitter: number;
  // Shake intensity (0 to 100)
  shakeIntensity: number;
  // Is actual hardware sensor delivering data
  isHardwareSensor: boolean;
  timestamp: number;
}

export interface StabilizationConfig {
  enabled: boolean;
  sensitivity: number; // 0.2 to 2.5 multiplier
  maxEnvelopePx: number; // 10 to 100 px maximum displacement
  deadbandPx: number; // Ignore vibrations below this pixel threshold
  filterAlgorithm: FilterAlgorithm;
  springReturnSpeed: number; // 0.05 to 0.5
  peripheralMotionCues: boolean; // Anti-motion sickness peripheral reference dots
  readingRulerEnabled: boolean; // Pinned high-focus line highlighter
  axisLock: 'both' | 'vertical-only' | 'horizontal-only';
  invertX: boolean;
  invertY: boolean;
}

export interface TypographySettings {
  theme: ReadingTheme;
  fontFamily: FontFamily;
  fontSize: number; // 14 to 32 px
  lineHeight: number; // 1.4 to 2.4
  letterSpacing: number; // -0.02 to 0.1 em
  contentWidth: 'compact' | 'normal' | 'wide';
  bionicReading: boolean; // Bold starting letters of words
  paragraphSpacing: number; // 1 to 4
}

export interface ArticleItem {
  id: string;
  title: string;
  category: string;
  readTimeMin: number;
  author: string;
  date: string;
  summary: string;
  content: string[];
}

export interface VehiclePreset {
  id: VehicleType;
  name: string;
  icon: string;
  description: string;
  baseFreqHz: number;
  baseAmpPx: number;
  roughness: number; // 0 to 1 (adds high-frequency noise & sudden bump spikes)
  shockIntervalSec: number; // Chance of sudden potholes
}
