import React from 'react';
import { ViewMode } from '../types';
import { Activity, BookOpen, Gauge, HelpCircle, Sliders, SplitSquareVertical, Zap } from 'lucide-react';

interface NavbarProps {
  currentView: ViewMode;
  onSelectView: (view: ViewMode) => void;
  stabilizationEnabled: boolean;
  onToggleStabilization: () => void;
  efficiencyPct: number;
  isHardwareSensor: boolean;
  onOpenSettings: () => void;
  onOpenHowItWorks: () => void;
  onCalibrate: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onSelectView,
  stabilizationEnabled,
  onToggleStabilization,
  efficiencyPct,
  isHardwareSensor,
  onOpenSettings,
  onOpenHowItWorks,
  onCalibrate,
}) => {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 h-14 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      {/* Zone 1: Wordmark */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onSelectView('reader')}
          className="flex items-center gap-2 text-left group"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:border-emerald-400 transition-colors">
            <Activity className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <span className="font-bold text-base sm:text-lg tracking-tight text-white font-['Plus_Jakarta_Sans']">
              Stabil<span className="text-emerald-400">Read</span>
            </span>
          </div>
        </button>

        {/* Live Hardware / Simulator indicator */}
        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-xs">
          <span className={`w-2 h-2 rounded-full ${isHardwareSensor ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
          <span className="text-slate-300">
            {isHardwareSensor ? 'Dahili Sensör (MEMS)' : 'Araç Simülatörü'}
          </span>
          {stabilizationEnabled && (
            <span className="font-mono text-emerald-400 tabular-nums font-semibold">
              %{efficiencyPct} İzolasyon
            </span>
          )}
        </div>
      </div>

      {/* Zone 2: Navigation Links / View Switcher */}
      <nav className="hidden md:flex items-center gap-1 p-1 bg-slate-950/60 rounded-xl border border-slate-800/80">
        <button
          onClick={() => onSelectView('reader')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
            currentView === 'reader'
              ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Okuyucu</span>
        </button>

        <button
          onClick={() => onSelectView('rsvp')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
            currentView === 'rsvp'
              ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>Hızlı RSVP</span>
        </button>

        <button
          onClick={() => onSelectView('split')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
            currentView === 'split'
              ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <SplitSquareVertical className="w-3.5 h-3.5 text-cyan-400" />
          <span>Karşılaştırma</span>
        </button>

        <button
          onClick={() => onSelectView('lab')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
            currentView === 'lab'
              ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Gauge className="w-3.5 h-3.5 text-indigo-400" />
          <span>Sensör Lab</span>
        </button>

        <button
          onClick={() => onSelectView('challenge')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
            currentView === 'challenge'
              ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span>Okuma Testi</span>
        </button>
      </nav>

      {/* Zone 3: Primary Actions (Stabilization Master Toggle & Settings) */}
      <div className="flex items-center gap-2">
        {/* Main Stabilizer Power Button */}
        <button
          onClick={onToggleStabilization}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            stabilizationEnabled
              ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-md shadow-emerald-500/20'
              : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700'
          }`}
          title={stabilizationEnabled ? 'Stabilizasyon Açık (Tıkla ve Kapat)' : 'Stabilizasyon Kapalı (Tıkla ve Aç)'}
        >
          <span className={`w-2 h-2 rounded-full ${stabilizationEnabled ? 'bg-slate-950 animate-ping' : 'bg-slate-500'}`} />
          <span>{stabilizationEnabled ? 'Stabilizasyon AKTİF' : 'Stabilizasyon KAPALI'}</span>
        </button>

        {/* Calibrate Sensor Button */}
        <button
          onClick={onCalibrate}
          className="hidden sm:flex items-center justify-center w-9 h-9 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
          title="Sensörü Sıfırla / Kalibre Et"
          aria-label="Sensörü Sıfırla"
        >
          <span className="text-xs font-mono font-bold">0g</span>
        </button>

        {/* How It Works Button */}
        <button
          onClick={onOpenHowItWorks}
          className="flex items-center justify-center w-9 h-9 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
          title="Sistem Nasıl Çalışır?"
          aria-label="Nasıl Çalışır"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* Settings Modal Button */}
        <button
          onClick={onOpenSettings}
          className="flex items-center justify-center w-9 h-9 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
          title="Okuyucu ve Sensör Ayarları"
          aria-label="Ayarlar"
        >
          <Sliders className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
