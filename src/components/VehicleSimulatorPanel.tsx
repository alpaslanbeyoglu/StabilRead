import React, { useState } from 'react';
import { VehicleType } from '../types';
import { Bus, Car, Flame, Footprints, Move, Sliders, Train, Zap } from 'lucide-react';

interface VehicleSimulatorPanelProps {
  simulatorActive: boolean;
  onToggleSimulator: (active: boolean) => void;
  vehicleType: VehicleType;
  onSelectVehicleType: (type: VehicleType) => void;
  intensity: number;
  onChangeIntensity: (intensity: number) => void;
  onTriggerBump: () => void;
}

export const VehicleSimulatorPanel: React.FC<VehicleSimulatorPanelProps> = ({
  simulatorActive,
  onToggleSimulator,
  vehicleType,
  onSelectVehicleType,
  intensity,
  onChangeIntensity,
  onTriggerBump,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const vehicleOptions = [
    { id: 'car', label: 'Binek Araç', icon: Car, desc: 'Gravel & Asfalt' },
    { id: 'bus', label: 'Otobüs', icon: Bus, desc: 'Dizel & Frenleme' },
    { id: 'train', label: 'Hızlı Tren', icon: Train, desc: 'Ray Titreşimi' },
    { id: 'walk', label: 'Yürüyüş', icon: Footprints, desc: 'Adım Salınımı' },
    { id: 'offroad', label: 'Off-Road', icon: Flame, desc: 'Sert Çukurlar' },
  ] as const;

  return (
    <div className="fixed bottom-16 sm:bottom-6 right-4 sm:right-6 z-40 max-w-sm w-full bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-800/80 border-b border-slate-700/80">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-xs font-bold text-slate-100 uppercase tracking-wider font-['Plus_Jakarta_Sans']">
            Yol & Titreşim Simülatörü
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleSimulator(!simulatorActive)}
            className={`px-2 py-1 text-[11px] font-semibold rounded-md transition-colors ${
              simulatorActive
                ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {simulatorActive ? 'Açık' : 'Kapalı'}
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-slate-400 hover:text-white text-xs px-1"
            title={isExpanded ? 'Küçült' : 'Genişlet'}
          >
            {isExpanded ? '▼' : '▲'}
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-4 space-y-4 text-xs">
          {/* Vehicle Selector Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
            {vehicleOptions.map((v) => {
              const Icon = v.icon;
              const isSelected = vehicleType === v.id && simulatorActive;
              return (
                <button
                  key={v.id}
                  onClick={() => {
                    onSelectVehicleType(v.id);
                    if (!simulatorActive) onToggleSimulator(true);
                  }}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
                    isSelected
                      ? 'bg-amber-500/20 border border-amber-500/50 text-amber-200 font-semibold'
                      : 'bg-slate-800/60 hover:bg-slate-800 text-slate-400 border border-slate-700/40'
                  }`}
                >
                  <Icon className="w-4 h-4 mb-1" />
                  <span className="text-[11px] leading-none">{v.label}</span>
                </button>
              );
            })}
          </div>

          {/* Intensity Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-slate-300">
              <span>Sarsıntı Şiddeti</span>
              <span className="font-mono text-amber-400 font-bold tabular-nums">
                {Math.round(intensity * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="2.5"
              step="0.1"
              value={intensity}
              onChange={(e) => {
                onChangeIntensity(Number(e.target.value));
                if (!simulatorActive) onToggleSimulator(true);
              }}
              className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Quick Impulse Bump / Pothole Button */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={onTriggerBump}
              className="flex-1 py-2 px-3 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-95"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Ani Çukura Gir / Şok Uygula</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
