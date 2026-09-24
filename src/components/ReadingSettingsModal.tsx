import React from 'react';
import { EyeTrackingConfig, FontFamily, ReadingTheme, StabilizationConfig, TypographySettings } from '../types';
import { AlignLeft, Sliders, Type, X, Eye, Sparkles, Camera, Crosshair } from 'lucide-react';

interface ReadingSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  typography: TypographySettings;
  onUpdateTypography: (updated: Partial<TypographySettings>) => void;
  config: StabilizationConfig;
  onUpdateConfig: (updated: Partial<StabilizationConfig>) => void;
  eyeConfig: EyeTrackingConfig;
  onUpdateEyeConfig: (updated: Partial<EyeTrackingConfig>) => void;
  onCalibrateEyes: () => void;
}

export const ReadingSettingsModal: React.FC<ReadingSettingsModalProps> = ({
  isOpen,
  onClose,
  typography,
  onUpdateTypography,
  config,
  onUpdateConfig,
  eyeConfig,
  onUpdateEyeConfig,
  onCalibrateEyes,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white font-['Plus_Jakarta_Sans']">
              Okuyucu, Sensör ve Göz Takibi Ayarları
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300 custom-scrollbar">
          {/* Section 0: Front Camera Eye Tracking (Göz Takibi & Füzyon) */}
          <div className="space-y-4 p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/30">
            <div className="flex items-center justify-between pb-1 border-b border-indigo-900/40">
              <div className="flex items-center gap-2 font-bold text-indigo-300 uppercase tracking-wider text-[11px]">
                <Camera className="w-4 h-4 text-indigo-400" />
                <span>Ön Kamera Optik Göz Takibi (Retinal Lock)</span>
              </div>
              <button
                onClick={onCalibrateEyes}
                className="px-2.5 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 text-[11px] font-semibold flex items-center gap-1 transition-colors"
              >
                <Crosshair className="w-3 h-3" />
                <span>Gözü Sıfırla</span>
              </button>
            </div>

            {/* Tracking Mode */}
            <div className="space-y-1.5">
              <span>Stabilizasyon Kaynağı / Modu</span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'sensor-fusion', label: 'Sensör Füzyonu', desc: 'İvme + Kamera' },
                  { id: 'eye-camera', label: 'Sadece Göz', desc: 'Ön Kamera' },
                  { id: 'imu-only', label: 'Sadece İvme', desc: 'MEMS Sensör' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onUpdateEyeConfig({ trackingMode: item.id as any })}
                    className={`py-2 px-1.5 rounded-xl text-center font-medium transition-colors ${
                      eyeConfig.trackingMode === item.id
                        ? 'bg-indigo-600/30 text-indigo-200 border border-indigo-500/50 shadow-sm'
                        : 'bg-slate-800/60 text-slate-400 hover:text-white border border-slate-700/40'
                    }`}
                  >
                    <div className="font-semibold">{item.label}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Fusion Weight Slider */}
            {eyeConfig.trackingMode === 'sensor-fusion' && (
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span>Füzyon Ağırlık Dengesi</span>
                  <span className="font-mono text-indigo-400 font-bold tabular-nums">
                    %{Math.round((1 - eyeConfig.fusionWeight) * 100)} İvme / %{Math.round(eyeConfig.fusionWeight * 100)} Göz
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={eyeConfig.fusionWeight}
                  onChange={(e) => onUpdateEyeConfig({ fusionWeight: Number(e.target.value) })}
                  className="w-full accent-indigo-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>
            )}

            {/* Eye Sensitivity Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span>Göz Hareketi Hassasiyeti</span>
                <span className="font-mono text-indigo-400 font-bold tabular-nums">
                  {eyeConfig.eyeSensitivity.toFixed(2)}x
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="3.0"
                step="0.1"
                value={eyeConfig.eyeSensitivity}
                onChange={(e) => onUpdateEyeConfig({ eyeSensitivity: Number(e.target.value) })}
                className="w-full accent-indigo-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/40 cursor-pointer">
              <div>
                <div className="font-medium text-slate-200">Kamera Önizleme Penceresi (PIP)</div>
                <div className="text-[11px] text-slate-500">
                  Göz bebeği ve baş eğimi vizörünü ekranda gösterir
                </div>
              </div>
              <input
                type="checkbox"
                checked={eyeConfig.showCameraPreview}
                onChange={(e) => onUpdateEyeConfig({ showCameraPreview: e.target.checked })}
                className="w-4 h-4 accent-indigo-400 rounded cursor-pointer"
              />
            </label>
          </div>

          {/* Section 1: Stabilization Parameters */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-bold text-slate-100 uppercase tracking-wider text-[11px] pb-1 border-b border-slate-800">
              <Eye className="w-4 h-4 text-emerald-400" />
              <span>Optik Titreşim Sönümleme</span>
            </div>

            {/* Sensitivity */}
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span>Dengeleme Hassasiyeti (Ters Çarpan)</span>
                <span className="font-mono text-emerald-400 font-bold tabular-nums">
                  {config.sensitivity.toFixed(2)}x
                </span>
              </div>
              <input
                type="range"
                min="0.2"
                max="2.5"
                step="0.05"
                value={config.sensitivity}
                onChange={(e) => onUpdateConfig({ sensitivity: Number(e.target.value) })}
                className="w-full accent-emerald-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Max Displacement Envelope */}
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span>Maksimum Kayma Zarfı (Clamping)</span>
                <span className="font-mono text-emerald-400 font-bold tabular-nums">
                  {config.maxEnvelopePx} px
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="80"
                step="2"
                value={config.maxEnvelopePx}
                onChange={(e) => onUpdateConfig({ maxEnvelopePx: Number(e.target.value) })}
                className="w-full accent-emerald-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <p className="text-[11px] text-slate-500">
                Aşırı şiddetli sarsıntılarda yazının ekran dışına fırlamasını sınırlar.
              </p>
            </div>

            {/* Deadband Noise Threshold */}
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span>Ölü Bölge / Parmak Titreme Filtresi</span>
                <span className="font-mono text-emerald-400 font-bold tabular-nums">
                  {config.deadbandPx} px
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="5"
                step="0.5"
                value={config.deadbandPx}
                onChange={(e) => onUpdateConfig({ deadbandPx: Number(e.target.value) })}
                className="w-full accent-emerald-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Axis Lock */}
            <div className="space-y-1.5">
              <span>Eksen Sabitleme</span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'both', label: 'X & Y (Tam)' },
                  { id: 'vertical-only', label: 'Y (Düşey)' },
                  { id: 'horizontal-only', label: 'X (Yatay)' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onUpdateConfig({ axisLock: item.id as any })}
                    className={`py-2 px-2 rounded-xl text-center font-medium transition-colors ${
                      config.axisLock === item.id
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-slate-800/60 text-slate-400 hover:text-white border border-slate-700/40'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-2 pt-2">
              <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/40 cursor-pointer">
                <div>
                  <div className="font-medium text-slate-200">Çevresel Araç Hareketi İpuçları</div>
                  <div className="text-[11px] text-slate-500">
                    Araç tutmasını önleyen Apple tarzı vizör noktaları
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={config.peripheralMotionCues}
                  onChange={(e) => onUpdateConfig({ peripheralMotionCues: e.target.checked })}
                  className="w-4 h-4 accent-emerald-400 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/40 cursor-pointer">
                <div>
                  <div className="font-medium text-slate-200">Odak Satırı Cetveli</div>
                  <div className="text-[11px] text-slate-500">
                    Okunan paragrafa otomatik vurgu şeridi çeker
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={config.readingRulerEnabled}
                  onChange={(e) => onUpdateConfig({ readingRulerEnabled: e.target.checked })}
                  className="w-4 h-4 accent-emerald-400 rounded cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Section 2: Typography & Readability */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 font-bold text-slate-100 uppercase tracking-wider text-[11px] pb-1 border-b border-slate-800">
              <Type className="w-4 h-4 text-cyan-400" />
              <span>Tipografi ve Görünüm</span>
            </div>

            {/* Font Family */}
            <div className="space-y-1.5">
              <span>Yazı Tipi</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'sans', label: 'Plus Jakarta' },
                  { id: 'serif', label: 'Lora Serif' },
                  { id: 'dyslexic', label: 'Sora Focus' },
                  { id: 'mono', label: 'JetBrains Mono' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => onUpdateTypography({ fontFamily: f.id as FontFamily })}
                    className={`py-2 px-2 rounded-xl text-center font-medium transition-colors ${
                      typography.fontFamily === f.id
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'bg-slate-800/60 text-slate-400 hover:text-white border border-slate-700/40'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Line Height & Letter Spacing */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Satır Yüksekliği</span>
                  <span className="font-mono text-cyan-400">{typography.lineHeight}</span>
                </div>
                <input
                  type="range"
                  min="1.4"
                  max="2.3"
                  step="0.1"
                  value={typography.lineHeight}
                  onChange={(e) => onUpdateTypography({ lineHeight: Number(e.target.value) })}
                  className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Harf Aralığı</span>
                  <span className="font-mono text-cyan-400">{typography.letterSpacing}em</span>
                </div>
                <input
                  type="range"
                  min="-0.02"
                  max="0.08"
                  step="0.01"
                  value={typography.letterSpacing}
                  onChange={(e) => onUpdateTypography({ letterSpacing: Number(e.target.value) })}
                  className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-950/80 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors"
          >
            Ayarları Kaydet ve Kapat
          </button>
        </div>
      </div>
    </div>
  );
};

