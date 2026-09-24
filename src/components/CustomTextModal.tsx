import React, { useState } from 'react';
import { ArticleItem } from '../types';
import { FileText, Upload, X } from 'lucide-react';

interface CustomTextModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddArticle: (article: ArticleItem) => void;
}

export const CustomTextModal: React.FC<CustomTextModalProps> = ({
  isOpen,
  onClose,
  onAddArticle,
}) => {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setText(content);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
    };
    reader.readAsText(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    const paragraphs = text
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    const wordCount = text.split(/\s+/).filter(Boolean).length;
    const readTime = Math.max(1, Math.round(wordCount / 200));

    const newArticle: ArticleItem = {
      id: `custom-${Date.now()}`,
      title: title.trim() || 'Kullanıcı Metni',
      category: 'Özel Okuma',
      readTimeMin: readTime,
      author: 'Kullanıcı',
      date: 'Bugün',
      summary: paragraphs[0] ? `${paragraphs[0].slice(0, 120)}...` : '',
      content: paragraphs.length > 0 ? paragraphs : [text],
    };

    onAddArticle(newArticle);
    setTitle('');
    setText('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white font-['Plus_Jakarta_Sans']">
              Kendi Metnini veya Kitabını Yükle
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* File Upload Trigger */}
          <div className="p-4 rounded-2xl border-2 border-dashed border-slate-700 bg-slate-950/40 hover:border-cyan-500/50 transition-colors text-center cursor-pointer relative">
            <input
              type="file"
              accept=".txt,.md,.text"
              onChange={handleFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <Upload className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
            <span className="text-slate-300 font-medium block">
              .TXT veya .MD dosyası sürükleyip bırakın ya da seçin
            </span>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Tüm makaleler cihazınızda yerel olarak işlenir
            </span>
          </div>

          {/* Title Input */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-medium">Başlık</label>
            <input
              type="text"
              placeholder="Örn: Yapay Zeka Notları veya Kitap Bölümü"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Textarea */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-medium">Metin İçeriği</label>
            <textarea
              rows={8}
              placeholder="Okumak istediğiniz yazıyı buraya yapıştırın..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 font-sans leading-relaxed"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={!text.trim()}
              className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:pointer-events-none text-slate-950 font-bold text-xs transition-colors shadow-lg shadow-cyan-500/20"
            >
              Okumaya Aktar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
