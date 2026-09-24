import React, { useState } from 'react';
import { ArticleItem, StabilizationConfig, TypographySettings, ViewMode } from './types';
import { SAMPLE_ARTICLES } from './data/sampleArticles';
import { useDeviceMotion } from './hooks/useDeviceMotion';
import { useWakeLock } from './hooks/useWakeLock';
import { Navbar } from './components/Navbar';
import { ReaderView } from './components/ReaderView';
import { RSVPReader } from './components/RSVPReader';
import { SplitComparisonView } from './components/SplitComparisonView';
import { SensorLab } from './components/SensorLab';
import { ReadabilityChallenge } from './components/ReadabilityChallenge';
import { VehicleSimulatorPanel } from './components/VehicleSimulatorPanel';
import { ReadingSettingsModal } from './components/ReadingSettingsModal';
import { HowItWorksModal } from './components/HowItWorksModal';
import { CustomTextModal } from './components/CustomTextModal';
import { MobileQRCodeModal } from './components/MobileQRCodeModal';
import { Activity, BookOpen, Gauge, Smartphone, SplitSquareVertical, Zap } from 'lucide-react';

export default function App() {
  // Navigation View
  const [currentView, setCurrentView] = useState<ViewMode>('reader');

  // Articles Library
  const [articles, setArticles] = useState<ArticleItem[]>(SAMPLE_ARTICLES);
  const [currentArticle, setCurrentArticle] = useState<ArticleItem>(SAMPLE_ARTICLES[0]);

  // Modals state
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState<boolean>(false);
  const [isCustomTextOpen, setIsCustomTextOpen] = useState<boolean>(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState<boolean>(false);

  // Keep screen awake while reading
  useWakeLock();

  // Typography Settings
  const [typography, setTypography] = useState<TypographySettings>({
    theme: 'dark',
    fontFamily: 'sans',
    fontSize: 18,
    lineHeight: 1.8,
    letterSpacing: 0.01,
    contentWidth: 'normal',
    bionicReading: false,
    paragraphSpacing: 2,
  });

  // Stabilization Configuration
  const [config, setConfig] = useState<StabilizationConfig>({
    enabled: true,
    sensitivity: 1.15,
    maxEnvelopePx: 45,
    deadbandPx: 0.5,
    filterAlgorithm: 'kalman',
    springReturnSpeed: 0.15,
    peripheralMotionCues: true,
    readingRulerEnabled: true,
    axisLock: 'both',
    invertX: false,
    invertY: false,
  });

  // Device Motion & Physics Hook
  const {
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
  } = useDeviceMotion(config);

  const handleToggleStabilization = () => {
    setConfig((prev) => ({ ...prev, enabled: !prev.enabled }));
  };

  const handleUpdateTypography = (updated: Partial<TypographySettings>) => {
    setTypography((prev) => ({ ...prev, ...updated }));
  };

  const handleUpdateConfig = (updated: Partial<StabilizationConfig>) => {
    setConfig((prev) => ({ ...prev, ...updated }));
  };

  const handleAddCustomArticle = (newArticle: ArticleItem) => {
    setArticles((prev) => [newArticle, ...prev]);
    setCurrentArticle(newArticle);
    setCurrentView('reader');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-['Plus_Jakarta_Sans',sans-serif] pb-14 md:pb-0">
      {/* 3-Zone Header Contract */}
      <Navbar
        currentView={currentView}
        onSelectView={setCurrentView}
        stabilizationEnabled={config.enabled}
        onToggleStabilization={handleToggleStabilization}
        efficiencyPct={efficiencyPct}
        isHardwareSensor={motionData.isHardwareSensor}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
        onCalibrate={calibrate}
        onOpenQRModal={() => setIsQRModalOpen(true)}
      />

      {/* Mobile Sensor Permission Activation Banner (if on mobile and not granted yet) */}
      {!isPermissionGranted && isHardwareAvailable && (
        <div className="z-20 bg-gradient-to-r from-emerald-950/90 to-indigo-950/90 border-b border-emerald-500/30 px-4 py-2 flex items-center justify-between text-xs animate-in slide-in-from-top-1">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-slate-200">
              Telefonun gerçek hareket sensörlerini bağlamak için onay verin:
            </span>
          </div>
          <button
            onClick={requestPermission}
            className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg shrink-0 transition-colors shadow-sm"
          >
            Sensörü Etkinleştir
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {currentView === 'reader' && (
          <ReaderView
            currentArticle={currentArticle}
            onSelectArticle={setCurrentArticle}
            articles={articles}
            typography={typography}
            onUpdateTypography={handleUpdateTypography}
            config={config}
            onToggleStabilization={handleToggleStabilization}
            screenShake={screenShake}
            contentOffset={contentOffset}
            efficiencyPct={efficiencyPct}
            onOpenCustomTextModal={() => setIsCustomTextOpen(true)}
            onSwitchToRSVP={() => setCurrentView('rsvp')}
          />
        )}

        {currentView === 'rsvp' && (
          <RSVPReader
            currentArticle={currentArticle}
            typography={typography}
            config={config}
            onToggleStabilization={handleToggleStabilization}
            screenShake={screenShake}
            contentOffset={contentOffset}
          />
        )}

        {currentView === 'split' && (
          <SplitComparisonView
            currentArticle={currentArticle}
            typography={typography}
            screenShake={screenShake}
            contentOffset={contentOffset}
            efficiencyPct={efficiencyPct}
          />
        )}

        {currentView === 'lab' && (
          <SensorLab
            motionData={motionData}
            rawHistory={rawHistory}
            stabilizedHistory={stabilizedHistory}
            config={config}
            onUpdateConfig={handleUpdateConfig}
            onCalibrate={calibrate}
            efficiencyPct={efficiencyPct}
            isHardwareSensor={motionData.isHardwareSensor}
            onRequestPermission={requestPermission}
          />
        )}

        {currentView === 'challenge' && (
          <ReadabilityChallenge
            screenShake={screenShake}
            contentOffset={contentOffset}
            onSetSimulator={(active, intensity) => {
              setSimulatorActive(active);
              setSimIntensity(intensity);
            }}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation Bar (Visible on phones & small screens) */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 flex items-center justify-around h-14 px-2">
        <button
          onClick={() => setCurrentView('reader')}
          className={`flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-medium transition-colors ${
            currentView === 'reader' ? 'text-emerald-400' : 'text-slate-400'
          }`}
        >
          <BookOpen className="w-4 h-4 mb-0.5" />
          <span>Okuyucu</span>
        </button>

        <button
          onClick={() => setCurrentView('rsvp')}
          className={`flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-medium transition-colors ${
            currentView === 'rsvp' ? 'text-amber-400' : 'text-slate-400'
          }`}
        >
          <Zap className="w-4 h-4 mb-0.5" />
          <span>RSVP</span>
        </button>

        <button
          onClick={() => setCurrentView('split')}
          className={`flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-medium transition-colors ${
            currentView === 'split' ? 'text-cyan-400' : 'text-slate-400'
          }`}
        >
          <SplitSquareVertical className="w-4 h-4 mb-0.5" />
          <span>Karşılaştır</span>
        </button>

        <button
          onClick={() => setCurrentView('lab')}
          className={`flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-medium transition-colors ${
            currentView === 'lab' ? 'text-indigo-400' : 'text-slate-400'
          }`}
        >
          <Gauge className="w-4 h-4 mb-0.5" />
          <span>Sensör</span>
        </button>

        <button
          onClick={() => setCurrentView('challenge')}
          className={`flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-medium transition-colors ${
            currentView === 'challenge' ? 'text-emerald-400' : 'text-slate-400'
          }`}
        >
          <Activity className="w-4 h-4 mb-0.5" />
          <span>Test</span>
        </button>
      </div>

      {/* Vehicle & Vibration Controller Widget (Active in reader / split / lab / rsvp) */}
      {currentView !== 'challenge' && (
        <VehicleSimulatorPanel
          simulatorActive={simulatorActive}
          onToggleSimulator={setSimulatorActive}
          vehicleType={vehicleType}
          onSelectVehicleType={setVehicleType}
          intensity={simIntensity}
          onChangeIntensity={setSimIntensity}
          onTriggerBump={triggerManualBump}
        />
      )}

      {/* Modals */}
      <ReadingSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        typography={typography}
        onUpdateTypography={handleUpdateTypography}
        config={config}
        onUpdateConfig={handleUpdateConfig}
      />

      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
      />

      <CustomTextModal
        isOpen={isCustomTextOpen}
        onClose={() => setIsCustomTextOpen(false)}
        onAddArticle={handleAddCustomArticle}
      />

      <MobileQRCodeModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
      />
    </div>
  );
}

