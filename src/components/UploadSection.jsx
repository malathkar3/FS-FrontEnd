import React, { useState, useContext, useRef } from 'react';
import {
  UploadCloud,
  CheckCircle,
  FileText,
  AlertCircle,
  Loader2,
  Calendar,
  ShieldCheck,
} from 'lucide-react';
import { TimetableContext } from '../context/TimetableContext';

const Upload = () => {
  const { uploadFile, loading, error, setError } = useContext(TimetableContext);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    setError(null);
    if (!file.name.endsWith('.docx')) {
      setError('Please select a .docx file.');
      setSelectedFile(null);
      return;
    }
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    await uploadFile(selectedFile);
  };

  const scrollToUpload = () => {
    document.getElementById('upload-zone')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{ backgroundColor: '#F8F9FC', fontFamily: "'Inter', sans-serif" }}
    >

      {/* ─── NAVBAR ─── */}
      <nav className="w-full py-6 px-8 max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2 font-bold text-indigo-600 text-xl">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
            <Calendar className="w-5 h-5" />
          </div>
          <span>Timetablely</span>
        </div>
      </nav>

      {/* ─── HERO SECTION ─── */}
      <main className="max-w-7xl mx-auto px-6 pt-12 pb-24 grid lg:grid-cols-2 gap-16 items-center">

        {/* Left: Text Content */}
        <section className="flex flex-col gap-8">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-semibold w-fit">
            ✦ Smart Timetable Analyzer
          </div>

          <div className="flex flex-col gap-4">
            <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Understand Your{' '}
              <span className="text-indigo-600">Timetable</span>{' '}
              Instantly
            </h1>
            <p className="text-lg text-slate-600 max-w-lg leading-relaxed">
              Upload your college timetable in .docx format. Instantly see every
              faculty member's schedule, occupied periods, and free slots — all
              in one clean dashboard.
            </p>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap gap-3">
            {['📅 Faculty Schedules', '🟢 Free Slot Detection', '⚡ Instant Analysis'].map((pill) => (
              <span
                key={pill}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-slate-100 text-sm font-medium text-slate-700"
              >
                {pill}
              </span>
            ))}
          </div>

          <button
            onClick={scrollToUpload}
            className="flex items-center gap-2 text-indigo-600 font-semibold text-sm w-fit animate-bounce mt-2 cursor-pointer bg-transparent border-none"
          >
            ↓ Upload your file below to get started
          </button>
        </section>

        {/* Right: Abstract UI Mockup */}
        <section className="relative h-[500px] flex items-center justify-center">
          {/* Background Blob */}
          <div
            className="absolute w-[400px] h-[400px] bg-indigo-200/40 rounded-full"
            style={{ filter: 'blur(80px)', zIndex: 0 }}
          />

          <div className="relative w-full h-full" style={{ zIndex: 1 }}>
            {/* Faculty Card */}
            <div
              className="absolute top-10 left-0 p-5 rounded-2xl shadow-xl border-l-4 border-l-indigo-500 w-64"
              style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)', borderLeft: '4px solid #6366F1' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
                  DS
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">Dr. Sharma</p>
                  <p className="text-xs text-green-600 font-medium">3 free slots today</p>
                </div>
              </div>
            </div>

            {/* Mini Grid Card */}
            <div
              className="absolute bottom-10 left-10 p-6 rounded-2xl shadow-xl w-72"
              style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)' }}
            >
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                Weekly Density
              </p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  'bg-indigo-600', 'bg-indigo-300', 'bg-indigo-100',
                  'bg-indigo-400', 'bg-indigo-200', 'bg-indigo-600',
                  'bg-indigo-100', 'bg-indigo-500', 'bg-indigo-50 border border-dashed border-indigo-200',
                ].map((cls, i) => (
                  <div key={i} className={`h-10 rounded-md ${cls}`} />
                ))}
              </div>
            </div>

            {/* Stats Card */}
            <div
              className="absolute top-1/2 right-4 p-5 rounded-2xl shadow-xl w-56 flex flex-col items-center gap-2"
              style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)', transform: 'translateY(-50%)' }}
            >
              <div className="text-4xl font-black text-indigo-600">12</div>
              <p className="text-sm font-medium text-slate-500 text-center">
                Faculty Members Loaded
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* ─── UPLOAD CARD SECTION ─── */}
      <section
        id="upload-zone"
        className="max-w-7xl mx-auto px-6 py-12 flex flex-col items-center"
      >
        {/* Section Label */}
        <p className="text-xs text-slate-400 font-semibold uppercase tracking-[0.2em] mb-8">
          — Get Started —
        </p>

        <div className="w-full max-w-[560px] bg-white rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.06)] p-8 md:p-10 border border-slate-50">

          {/* Card Header */}
          <header className="text-center mb-10">
            <div className="mx-auto w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-4 shadow-sm">
              <Calendar className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Upload Your Timetable</h2>
            <p className="text-slate-500 mt-2 text-sm">
              We'll handle the rest — schedules, free slots, everything.
            </p>
          </header>

          {/* Drop Zone */}
          <div
            className="relative group"
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <label
              htmlFor="file-upload"
              className={`flex flex-col items-center justify-center w-full h-56 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 ${dragActive
                  ? 'border-indigo-500 bg-indigo-50/60 scale-[1.01]'
                  : selectedFile
                    ? 'border-emerald-400 bg-emerald-50/30'
                    : 'border-indigo-200 bg-indigo-50/30 hover:bg-indigo-50 hover:border-indigo-400'
                }`}
            >
              <div className="flex flex-col items-center justify-center px-8 text-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md mb-4 transition-all duration-300 ${selectedFile
                      ? 'bg-emerald-100 text-emerald-600 scale-110'
                      : 'bg-white text-indigo-500 group-hover:scale-110 group-hover:rotate-6'
                    }`}
                >
                  {selectedFile ? (
                    <FileText className="w-6 h-6" />
                  ) : (
                    <UploadCloud className="w-6 h-6" />
                  )}
                </div>

                {!selectedFile ? (
                  <>
                    <p className="mb-1 text-sm text-slate-700 font-semibold">
                      Drag &amp; drop your .docx file here
                    </p>
                    <p className="text-xs text-slate-400 mb-4">
                      or select a file from your computer
                    </p>
                    <div className="px-6 py-2 bg-indigo-600 text-white rounded-full text-sm font-semibold shadow-md hover:bg-indigo-700 transition-colors">
                      Browse File
                    </div>
                  </>
                ) : (
                  <>
                    <p className="mb-1 text-sm text-emerald-800 font-bold truncate max-w-[240px]">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-emerald-500/80 font-medium mb-4">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • Ready for analysis
                    </p>
                    <button
                      type="button"
                      className="px-5 py-1.5 bg-white text-emerald-600 border border-emerald-200 rounded-lg text-xs font-semibold hover:bg-emerald-50 transition-colors"
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedFile(null);
                        setError(null);
                      }}
                    >
                      Change File
                    </button>
                  </>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".docx"
                onChange={handleChange}
                className="hidden"
                id="file-upload"
              />
            </label>
          </div>

          {/* Hint */}
          <div className="mt-4 text-center">
            <p className="text-[11px] text-slate-400 font-medium tracking-widest uppercase">
              .DOCX FILES ONLY • MAX 10MB
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-6 w-full p-4 rounded-xl bg-red-50 border border-red-100 flex items-center gap-3">
              <div className="bg-white p-1.5 rounded-lg shadow-sm shrink-0">
                <AlertCircle className="h-4 w-4 text-red-500" />
              </div>
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={loading || !selectedFile}
            className={`w-full mt-8 py-4 px-6 flex items-center justify-center gap-3 font-bold text-base rounded-xl shadow-lg transition-all active:scale-[0.98] ${loading
                ? 'bg-indigo-400 text-white cursor-wait'
                : !selectedFile
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                  : 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5'
              }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Parsing Schedule...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Upload &amp; Analyze Timetable
              </>
            )}
          </button>

          {/* Footer Tags */}
          <footer className="mt-8 pt-8 border-t border-slate-100 flex flex-wrap justify-center gap-x-4 gap-y-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3 h-3 text-indigo-300" /> College Secure
            </span>
            <span>•</span>
            <span>Ultra Fast</span>
            <span>•</span>
            <span>Private</span>
            <span>•</span>
            <span>No Data Stored</span>
          </footer>
        </div>
      </section>

      {/* ─── PAGE FOOTER ─── */}
      <footer className="w-full py-10 px-6 text-center text-slate-400 text-sm">
        <p>Built for colleges • Fast • Private • No data stored</p>
      </footer>

    </div>
  );
};

export default Upload;