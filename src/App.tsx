import React, { useState } from 'react';
import { ArticleItem, StabilizationConfig, TypographySettings, ViewMode } from './types';
import { SAMPLE_ARTICLES } from './data/sampleArticles';
import { useDeviceMotion } from './hooks/useDeviceMotion';
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
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-['Plus_Jakarta_Sans',sans-serif]">
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
      />

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
    </div>
  );
}
