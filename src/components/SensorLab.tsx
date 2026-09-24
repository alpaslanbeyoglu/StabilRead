import React, { useEffect, useRef } from 'react';
import { EyeTrackingConfig, EyeTrackingData, MotionData, StabilizationConfig } from '../types';
import { Activity, Camera, Cpu, Crosshair, Eye, Gauge, RefreshCw, Smartphone, Zap } from 'lucide-react';

interface SensorLabProps {
  motionData: MotionData;
  rawHistory: { x: number; y: number; t: number }[];
  stabilizedHistory: { x: number; y: number; t: number }[];
  config: StabilizationConfig;
  onUpdateConfig: (updated: Partial<StabilizationConfig>) => void;
  onCalibrate: () => void;
  efficiencyPct: number;
  isHardwareSensor: boolean;
  onRequestPermission: () => void;
  eyeData?: EyeTrackingData;
  eyeConfig?: EyeTrackingConfig;
  onUpdateEyeConfig?: (updated: Partial<EyeTrackingConfig>) => void;
  onCalibrateEyes?: () => void;
}

export const SensorLab: React.FC<SensorLabProps> = ({
  motionData,
  rawHistory,
  stabilizedHistory,
  config,
  onUpdateConfig,
  onCalibrate,
  efficiencyPct,
  isHardwareSensor,
  onRequestPermission,
  eyeData,
  eyeConfig,
  onUpdateEyeConfig,
  onCalibrateEyes,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Render Real-Time Oscilloscope Waveform on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const midY = height / 2;

    // Clear background
    ctx.fillStyle = '#090D16';
    ctx.fillRect(0, 0, width, height);

    // Draw Grid Lines
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 1;

    // Horizontal center line
    ctx.beginPath();
    ctx.moveTo(0, midY);
    ctx.lineTo(width, midY);
    ctx.stroke();

    // Secondary grid
    for (let y = midY - 60; y <= midY + 60; y += 30) {
      ctx.beginPath();
      ctx.setLineDash([4, 4]);
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    if (rawHistory.length < 2) return;

    const step = width / (rawHistory.length - 1);

    // 1. Draw Raw Shake Wave (Rose Red)
    ctx.strokeStyle = '#F43F5E';
    ctx.lineWidth = 2;
    ctx.beginPath();
    rawHistory.forEach((pt, i) => {
      const x = i * step;
      const y = midY - pt.y * 1.8;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // 2. Draw Compensated Counter-Offset Wave (Cyan / Green)
    ctx.strokeStyle = '#34D399';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    rawHistory.forEach((pt, i) => {
      const compY = config.enabled ? -pt.y * config.sensitivity : 0;
      const x = i * step;
      const y = midY - compY * 1.8;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // 3. Draw Net Residual Eye Jitter (Indigo)
    if (stabilizedHistory.length > 0) {
      ctx.strokeStyle = '#818CF8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      stabilizedHistory.forEach((pt, i) => {
        const x = i * step;
        const y = midY - pt.y * 1.8;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    }
  }, [rawHistory, stabilizedHistory, config]);

  return (
    <div className="relative flex flex-col flex-1 h-[calc(100vh-3.5rem)] overflow-y-auto bg-slate-950 p-4 sm:p-6 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2 font-['Plus_Jakarta_Sans']">
            <Cpu className="w-5 h-5 text-indigo-400" />
            <span>Sensör & Göz Takip Teşhis Laboratuvarı</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            MEMS İvmeölçer, Jiroskop sinyalleri, Ön Kamera Optik Göz Takibi ve Hibrit Sensör Füzyonu
          </p>
        </div>

        <div className="flex items-center gap-3">
          {onCalibrateEyes && (
            <button
              onClick={onCalibrateEyes}
              className="px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Crosshair className="w-3.5 h-3.5" />
              <span>Gözü Sıfırla</span>
            </button>
          )}

          <button
            onClick={onRequestPermission}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span>{isHardwareSensor ? 'Sensör Bağlı' : 'Telefon Sensörünü Bağla'}</span>
          </button>

          <button
            onClick={onCalibrate}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sıfır Noktası Kalibre Et</span>
          </button>
        </div>
      </div>

      {/* Main Oscilloscope Card */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 sm:p-6 space-y-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-semibold text-slate-200">
              Gerçek Zamanlı Dalga Formu Osiloskobu (60 FPS)
            </span>
          </div>

          {/* Waveform Legend */}
          <div className="flex items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-rose-500 rounded-full" />
              <span className="text-rose-300">Ham Yol Sarsıntısı (Ax/Ay)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-emerald-400 rounded-full" />
              <span className="text-emerald-300">Ters Dengeleme (-ΔY)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-indigo-400 rounded-full" />
              <span className="text-indigo-300">Net Algılanan Titreşim</span>
            </div>
          </div>
        </div>

        {/* Canvas Element */}
        <div className="rounded-xl overflow-hidden border border-slate-800 bg-[#090D16] shadow-inner">
          <canvas
            ref={canvasRef}
            width={900}
            height={220}
            className="w-full h-[220px] block"
          />
        </div>
      </div>

      {/* Grid: 3D Tilt Bubble + Eye Tracking Gaze Box + Real-Time Telemetry Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1. 3D Tilt & G-Force Bubble */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 flex flex-col items-center justify-center text-center">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Dinamik G-Kuvveti & Eğim Küresi
          </span>

          <div className="relative w-36 h-36 rounded-full bg-slate-950 border-2 border-slate-800 flex items-center justify-center shadow-inner overflow-hidden">
            {/* Crosshairs */}
            <div className="absolute inset-x-0 top-1/2 h-[1px] bg-slate-800" />
            <div className="absolute inset-y-0 left-1/2 w-[1px] bg-slate-800" />
            <div className="absolute w-20 h-20 rounded-full border border-slate-800/80" />

            {/* Bubble Indicator */}
            <div
              className="w-6 h-6 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)] transition-all duration-75 flex items-center justify-center text-[9px] font-bold text-slate-950"
              style={{
                transform: `translate(${Math.max(-50, Math.min(50, motionData.ax * 8))}px, ${Math.max(
                  -50,
                  Math.min(50, motionData.ay * 8)
                )}px)`,
              }}
            >
              G
            </div>
          </div>

          <div className="flex items-center gap-4 mt-4 font-mono text-xs text-slate-400 tabular-nums">
            <span>X: {motionData.ax} m/s²</span>
            <span>Y: {motionData.ay} m/s²</span>
          </div>
        </div>

        {/* 2. Front Camera Eye Tracking Telemetry */}
        <div className="rounded-2xl bg-slate-900 border border-indigo-500/30 p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-indigo-400" />
              <span>Göz Bakış Vektörü (Gaze)</span>
            </span>
            <span className="font-mono text-xs text-emerald-400 font-bold">
              {eyeData?.isActive ? `${eyeData.fps} FPS` : 'Beklemede'}
            </span>
          </div>

          <div className="my-auto text-center space-y-2">
            <div className="flex items-center justify-center gap-6">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Göz ΔX</span>
                <span className="font-mono text-lg font-bold text-indigo-300 tabular-nums">
                  {eyeData?.gazeVector.x || 0} px
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Göz ΔY</span>
                <span className="font-mono text-lg font-bold text-indigo-300 tabular-nums">
                  {eyeData?.gazeVector.y || 0} px
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 text-xs text-slate-400">
              <span>Baş Eğimi: {eyeData?.headTilt.roll || 0}°</span>
              <span>·</span>
              <span>Kırpma: {eyeData?.isBlinking ? 'Göz Kapalı' : 'Açık'}</span>
            </div>
          </div>

          {onUpdateEyeConfig && eyeConfig && (
            <div className="space-y-1 pt-2 border-t border-slate-800 text-[11px]">
              <div className="flex justify-between text-slate-400">
                <span>Füzyon Karışımı</span>
                <span className="text-indigo-300">%{Math.round(eyeConfig.fusionWeight * 100)} Göz Takibi</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={eyeConfig.fusionWeight}
                onChange={(e) => onUpdateEyeConfig({ fusionWeight: Number(e.target.value) })}
                className="w-full accent-indigo-400 h-1 bg-slate-800 rounded cursor-pointer"
              />
            </div>
          )}
        </div>

        {/* 3. Real-Time Efficiency & Isolation Gauge */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Titreşim Sönümleme Skoru
            </span>
            <Gauge className="w-4 h-4 text-emerald-400" />
          </div>

          <div className="my-auto text-center">
            <div className="font-['JetBrains_Mono',monospace] text-5xl font-extrabold text-emerald-400 tabular-nums">
              %{efficiencyPct}
            </div>
            <span className="text-xs text-slate-400 mt-2 block">
              Göz Kaslarını Koruma Verimliliği
            </span>
          </div>

          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full transition-all duration-300"
              style={{ width: `${efficiencyPct}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

