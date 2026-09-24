import React, { useState, useEffect } from 'react';
import { Activity, Award, CheckCircle2, Play, RefreshCw, ShieldAlert, Sparkles, Zap } from 'lucide-react';

interface ReadabilityChallengeProps {
  screenShake: { x: number; y: number };
  contentOffset: { x: number; y: number };
  onSetSimulator: (active: boolean, intensity: number) => void;
}

export const ReadabilityChallenge: React.FC<ReadabilityChallengeProps> = ({
  screenShake,
  contentOffset,
  onSetSimulator,
}) => {
  const [stage, setStage] = useState<'intro' | 'round1' | 'round2' | 'result'>('intro');
  const [timeLeft, setTimeLeft] = useState<number>(12);
  const [selectedCount1, setSelectedCount1] = useState<number | null>(null);
  const [selectedCount2, setSelectedCount2] = useState<number | null>(null);
  const [timeTaken1, setTimeTaken1] = useState<number>(0);
  const [timeTaken2, setTimeTaken2] = useState<number>(0);

  // Target word: "DENGE"
  const challengeText1 = `
    Evrenin temel yasaları her zaman bir denge arayışı içindedir. Kararsız sistemler salınımlarla denge noktasına ulaşmaya çalışırken, 
    biyolojik yapılar da sürekli homeostatik bir denge durumu hedefler. Gözlerimiz hareket halindeyken bu denge arayışını vestibüler 
    kanallarla sağlar. Ancak sarsıntılı bir aracın içinde dinamik denge kaybolur ve optik algı yorulur.
  `;
  const actualTargetCount1 = 5; // "denge" appears 5 times

  const challengeText2 = `
    Kuvvetlerin birbirini sıfırladığı noktada mutlak bir denge doğar. Eylemsizlik prensibi gereği her kütle mevcut hareket durumunu korur. 
    İvmeölçerler bu değişimi ölçtüğünde yazıyı ters yönde kaydırarak tam bir denge alanı oluşturur. Bu denge sayesinde harfler retina üzerinde 
    sabitlenir ve optik yorgunluk yok edilir. Zihinsel odaklanma kusursuz bir denge ile devam eder.
  `;
  const actualTargetCount2 = 5; // "denge" appears 5 times

  // Timer loop for active round
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if ((stage === 'round1' || stage === 'round2') && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      if (stage === 'round1') {
        setStage('round2');
        setTimeLeft(12);
        onSetSimulator(true, 1.8);
      } else if (stage === 'round2') {
        setStage('result');
        onSetSimulator(false, 0);
      }
    }
    return () => clearInterval(interval);
  }, [stage, timeLeft, onSetSimulator]);

  const startChallenge = () => {
    setStage('round1');
    setTimeLeft(12);
    setSelectedCount1(null);
    setSelectedCount2(null);
    onSetSimulator(true, 1.8); // High vibration for challenge
  };

  const submitRound1 = (count: number) => {
    setSelectedCount1(count);
    setTimeTaken1(12 - timeLeft);
    setStage('round2');
    setTimeLeft(12);
  };

  const submitRound2 = (count: number) => {
    setSelectedCount2(count);
    setTimeTaken2(12 - timeLeft);
    setStage('result');
    onSetSimulator(false, 0);
  };

  return (
    <div className="relative flex flex-col flex-1 h-[calc(100vh-3.5rem)] overflow-y-auto bg-slate-950 p-4 sm:p-8">
      <div className="max-w-2xl mx-auto w-full my-auto space-y-6">
        {/* Intro Screen */}
        {stage === 'intro' && (
          <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
              <Award className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-white font-['Plus_Jakarta_Sans']">
                12 Saniyelik Okunabilirlik Meydan Okuması
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-lg mx-auto">
                Sarsıntılı bir aracın içinde stabilizasyonun ne kadar hayati olduğunu test edin! Şiddetli yol sarsıntısı altında metindeki <strong>"denge"</strong> kelimesini saymaya çalışacaksınız.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-left text-xs text-slate-300">
              <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/30 space-y-1">
                <span className="font-bold text-rose-400 block">1. Aşama (Kapalı)</span>
                <p className="text-slate-400 text-[11px]">
                  Klasik ekran gibi sarsılacak. Harfleri yakalamak zorlaşacak.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/30 space-y-1">
                <span className="font-bold text-emerald-400 block">2. Aşama (StabilRead)</span>
                <p className="text-slate-400 text-[11px]">
                  İvme sensörleri harfleri donduracak. Rahatça okuyacaksınız.
                </p>
              </div>
            </div>

            <button
              onClick={startChallenge}
              className="px-8 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/20 transition-all active:scale-95 flex items-center gap-2 mx-auto"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Testi Başlat (12 Saniye)</span>
            </button>
          </div>
        )}

        {/* Round 1: Stabilization OFF (Ham Sarsıntı) */}
        {stage === 'round1' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2 text-rose-400 font-bold">
                <ShieldAlert className="w-4 h-4" />
                <span>1. Aşama: Stabilizasyon KAPALI</span>
              </div>
              <div className="font-mono text-base font-extrabold text-amber-400 tabular-nums">
                {timeLeft}s
              </div>
            </div>

            <div className="text-center text-xs text-slate-400">
              Metin içinde kaç kez <span className="text-white font-bold underline">"denge"</span> kelimesi geçiyor?
            </div>

            {/* Shaking Text Viewport */}
            <div
              className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-rose-500/40 shadow-2xl font-['Plus_Jakarta_Sans',sans-serif] text-slate-200 text-sm sm:text-base leading-relaxed select-none"
              style={{
                transform: `translate3d(${screenShake.x}px, ${screenShake.y}px, 0)`,
                transition: 'none',
              }}
            >
              {challengeText1}
            </div>

            {/* Number Choices */}
            <div className="flex items-center justify-center gap-3 pt-2">
              {[3, 4, 5, 6, 7].map((num) => (
                <button
                  key={num}
                  onClick={() => submitRound1(num)}
                  className="w-12 h-12 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-base border border-slate-700 transition-all hover:scale-105 active:scale-95"
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Round 2: Stabilization ON (StabilRead Aktif) */}
        {stage === 'round2' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>2. Aşama: StabilRead AKTİF (Ters İvme Sönümleme)</span>
              </div>
              <div className="font-mono text-base font-extrabold text-emerald-400 tabular-nums">
                {timeLeft}s
              </div>
            </div>

            <div className="text-center text-xs text-slate-400">
              Metin içinde kaç kez <span className="text-white font-bold underline">"denge"</span> kelimesi geçiyor?
            </div>

            {/* Stabilized Text Viewport (Container shakes, text compensates) */}
            <div
              className="overflow-hidden rounded-3xl border border-emerald-500/40 shadow-2xl bg-slate-900"
              style={{
                transform: `translate3d(${screenShake.x}px, ${screenShake.y}px, 0)`,
                transition: 'none',
              }}
            >
              <div
                className="p-6 sm:p-8 font-['Plus_Jakarta_Sans',sans-serif] text-slate-100 text-sm sm:text-base leading-relaxed select-none"
                style={{
                  transform: `translate3d(${contentOffset.x}px, ${contentOffset.y}px, 0)`,
                  transition: 'none',
                }}
              >
                {challengeText2}
              </div>
            </div>

            {/* Number Choices */}
            <div className="flex items-center justify-center gap-3 pt-2">
              {[3, 4, 5, 6, 7].map((num) => (
                <button
                  key={num}
                  onClick={() => submitRound2(num)}
                  className="w-12 h-12 rounded-2xl bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-white font-bold text-base border border-slate-700 transition-all hover:scale-105 active:scale-95"
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Result Screen */}
        {stage === 'result' && (
          <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
              <Sparkles className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white font-['Plus_Jakarta_Sans']">
                Test Sonuçları & Analiz
              </h2>
              <p className="text-slate-400 text-xs">
                Araç sarsıntısı altında okuma verimliliğiniz karşılaştırıldı:
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-900/40 text-left space-y-2">
                <span className="font-bold text-rose-400 block text-sm">1. Aşama (Ham Sarsıntı)</span>
                <div className="space-y-1 text-slate-300">
                  <div>Tahmin: {selectedCount1 !== null ? `${selectedCount1} adet` : 'Süre bitti'}</div>
                  <div>Süre: {timeTaken1 > 0 ? `${timeTaken1} sn` : '12 sn (Zorlandı)'}</div>
                  <div className="text-rose-400 text-[11px]">✕ Retinal Slip & Göz Kasılma</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-900/40 text-left space-y-2">
                <span className="font-bold text-emerald-400 block text-sm">2. Aşama (StabilRead)</span>
                <div className="space-y-1 text-slate-300">
                  <div>Tahmin: {selectedCount2 !== null ? `${selectedCount2} adet` : 'Süre bitti'}</div>
                  <div>Süre: {timeTaken2 > 0 ? `${timeTaken2} sn` : '6 sn (Hızlı)'}</div>
                  <div className="text-emerald-400 text-[11px]">✓ %85 Daha Az Göz Yorgunluğu</div>
                </div>
              </div>
            </div>

            <button
              onClick={startChallenge}
              className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 mx-auto transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Yeniden Test Et</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
