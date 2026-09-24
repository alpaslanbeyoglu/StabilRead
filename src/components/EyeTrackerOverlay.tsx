import React, { useState } from 'react';
import { EyeTrackingConfig, EyeTrackingData } from '../types';
import { Camera, Crosshair, Eye, EyeOff, Maximize2, Minimize2, RefreshCw, Sparkles, Video, VideoOff } from 'lucide-react';

interface EyeTrackerOverlayProps {
  eyeData: EyeTrackingData;
  eyeConfig: EyeTrackingConfig;
  onUpdateEyeConfig: (updated: Partial<EyeTrackingConfig>) => void;
  onCalibrateEyes: () => void;
  onToggleCamera: () => void;
}

export const EyeTrackerOverlay: React.FC<EyeTrackerOverlayProps> = ({
  eyeData,
  eyeConfig,
  onUpdateEyeConfig,
  onCalibrateEyes,
  onToggleCamera,
}) => {
  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  if (!eyeConfig.enabled || (eyeConfig.trackingMode === 'imu-only' && !eyeData.isActive)) {
    return null;
  }

  return (
    <div className="fixed top-16 right-4 z-40 flex flex-col items-end gap-2 pointer-events-auto select-none animate-in fade-in slide-in-from-top-2 duration-200">
      {/* Eye Tracker Status Chip & Mini Controller */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-indigo-500/40 shadow-xl text-xs">
        <div className="flex items-center gap-2 px-2">
          <div className="relative">
            <Eye className={`w-4 h-4 ${eyeData.isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
            {eyeData.isActive && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            )}
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-100 font-['Plus_Jakarta_Sans']">
                {eyeConfig.trackingMode === 'sensor-fusion' ? 'Sensör Füzyonu (IMU + Göz)' : 'Optik Göz Takibi'}
              </span>
              {eyeData.isActive && (
                <span className="font-mono text-[10px] text-emerald-400 font-semibold tabular-nums">
                  %{eyeData.confidence} Güven
                </span>
              )}
            </div>
            {eyeData.isActive && (
              <span className="text-[10px] text-slate-400 font-mono">
                Göz Δ: {eyeData.gazeVector.x}px / {eyeData.gazeVector.y}px · {eyeData.fps} FPS
              </span>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 border-l border-slate-800 pl-1.5">
          {/* Calibrate Baseline */}
          <button
            onClick={onCalibrateEyes}
            className="p-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 transition-colors"
            title="Göz Merkezini Kalibre Et (Doğrudan Ekrana Bakın)"
          >
            <Crosshair className="w-3.5 h-3.5" />
          </button>

          {/* Toggle Camera Preview PIP */}
          <button
            onClick={() => onUpdateEyeConfig({ showCameraPreview: !eyeConfig.showCameraPreview })}
            className={`p-1.5 rounded-lg border transition-colors ${
              eyeConfig.showCameraPreview
                ? 'bg-slate-800 text-slate-200 border-slate-700'
                : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
            title={eyeConfig.showCameraPreview ? 'Kamera Önizlemesini Gizle' : 'Kamera Önizlemesini Göster'}
          >
            {eyeConfig.showCameraPreview ? <Video className="w-3.5 h-3.5" /> : <VideoOff className="w-3.5 h-3.5" />}
          </button>

          {/* Minimize / Maximize Box */}
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            title={isMinimized ? 'Genişlet' : 'Küçült'}
          >
            {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Expanded PIP Camera Widget with Iris Detection Overlay */}
      {eyeConfig.showCameraPreview && !isMinimized && (
        <div className="w-56 sm:w-64 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 p-3 shadow-2xl space-y-2">
          {/* Viewport Simulation Box */}
          <div className="relative aspect-[4/3] rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center">
            {/* Visual Artificial Eye Mesh / Pupil Tracker Simulator Screen */}
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/20 to-slate-950 flex items-center justify-center">
              {/* Face Contour Silhouette */}
              <div
                className="relative w-36 h-40 rounded-[45%] border-2 border-dashed border-indigo-500/30 flex items-center justify-center transition-transform duration-100"
                style={{
                  transform: `rotate(${eyeData.headTilt.roll}deg) translate(${eyeData.gazeVector.x * 0.3}px, ${eyeData.gazeVector.y * 0.3}px)`,
                }}
              >
                {/* Horizontal Eye Level Line */}
                <div className="absolute top-14 inset-x-2 h-[1px] bg-indigo-500/20" />

                {/* Left Eye Box & Pupil */}
                <div className="absolute top-10 left-4 w-10 h-7 rounded-full border border-emerald-400/60 bg-emerald-950/30 flex items-center justify-center overflow-hidden shadow-[0_0_8px_rgba(52,211,153,0.3)]">
                  {eyeData.isBlinking ? (
                    <div className="w-8 h-[2px] bg-rose-400" />
                  ) : (
                    <div
                      className="w-4 h-4 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.9)] flex items-center justify-center transition-all duration-75"
                      style={{
                        transform: `translate(${eyeData.gazeVector.x * 0.2}px, ${eyeData.gazeVector.y * 0.2}px)`,
                      }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />
                    </div>
                  )}
                </div>

                {/* Right Eye Box & Pupil */}
                <div className="absolute top-10 right-4 w-10 h-7 rounded-full border border-emerald-400/60 bg-emerald-950/30 flex items-center justify-center overflow-hidden shadow-[0_0_8px_rgba(52,211,153,0.3)]">
                  {eyeData.isBlinking ? (
                    <div className="w-8 h-[2px] bg-rose-400" />
                  ) : (
                    <div
                      className="w-4 h-4 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.9)] flex items-center justify-center transition-all duration-75"
                      style={{
                        transform: `translate(${eyeData.gazeVector.x * 0.2}px, ${eyeData.gazeVector.y * 0.2}px)`,
                      }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />
                    </div>
                  )}
                </div>

                {/* Nose bridge tick */}
                <div className="absolute top-16 w-1 h-3 bg-indigo-500/40 rounded-full" />
              </div>
            </div>

            {/* Target Reticle Crosshair */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-30">
              <div className="w-8 h-8 rounded-full border border-white" />
              <div className="absolute w-12 h-[1px] bg-white" />
              <div className="absolute h-12 w-[1px] bg-white" />
            </div>

            {/* Live Camera Badge */}
            <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/60 border border-white/10 text-[9px] font-mono text-emerald-300 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>ÖN KAMERA</span>
            </div>

            {/* Tilt angle */}
            <div className="absolute bottom-2 right-2 text-[9px] font-mono text-slate-400 bg-black/60 px-1.5 py-0.5 rounded">
              Eğim: {eyeData.headTilt.roll}°
            </div>
          </div>

          {/* Quick Tracking Mode Selector */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Takip Modu</span>
              <span className="text-indigo-300 font-semibold">
                {eyeConfig.trackingMode === 'sensor-fusion'
                  ? 'Hibrit Füzyon'
                  : eyeConfig.trackingMode === 'eye-camera'
                  ? 'Sadece Kamera'
                  : 'Sadece İvmeölçer'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1">
              {[
                { id: 'sensor-fusion', label: 'Füzyon' },
                { id: 'eye-camera', label: 'Göz' },
                { id: 'imu-only', label: 'İvme' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => onUpdateEyeConfig({ trackingMode: m.id as any })}
                  className={`py-1 text-[10px] font-medium rounded-lg transition-colors ${
                    eyeConfig.trackingMode === m.id
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sensor Fusion Weight Balance Slider (IMU <---> Göz) */}
          {eyeConfig.trackingMode === 'sensor-fusion' && (
            <div className="space-y-1 pt-1 border-t border-slate-800">
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>İvmeölçer</span>
                <span className="font-mono text-indigo-400">%{Math.round(eyeConfig.fusionWeight * 100)} Göz</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={eyeConfig.fusionWeight}
                onChange={(e) => onUpdateEyeConfig({ fusionWeight: Number(e.target.value) })}
                className="w-full accent-indigo-400 h-1 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
