import React, { useState, useContext, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Upload, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  BarChart3,
  CheckCircle2,
  Zap,
  Clock,
  UploadCloud,
  CheckCircle,
  FileText,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { TimetableContext } from '../context/TimetableContext';

// --- Sub-component: UploadSection ---
export const UploadSection = () => {
  const { uploadFile, loading, error, setError } = useContext(TimetableContext);
  const navigate = useNavigate();
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
    const success = await uploadFile(selectedFile);
    if (success) {
      if (window.location.pathname === '/') {
        navigate('/app');
      }
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-[560px] bg-white rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.06)] p-8 md:p-10 border border-slate-50 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <header className="text-center mb-10">
          <div className="mx-auto w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-4 shadow-sm">
            <Calendar className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Analyze Timetable</h2>
          <p className="text-slate-500 mt-2 text-sm leading-relaxed">
            Upload your college schedule (.docx) and we'll extract every faculty's timetable instantly.
          </p>
        </header>

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
                    Drag & drop your .docx file here
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

        <div className="mt-4 text-center">
          <p className="text-[11px] text-slate-400 font-medium tracking-widest uppercase">
            .DOCX FILES ONLY • MAX 10MB
          </p>
        </div>

        {error && (
          <div className="mt-6 w-full p-4 rounded-xl bg-red-50 border border-red-100 flex items-center gap-3">
            <div className="bg-white p-1.5 rounded-lg shadow-sm shrink-0">
              <AlertCircle className="h-4 w-4 text-red-500" />
            </div>
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        )}

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
              Processing...
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5" />
              Analyze Timetable
            </>
          )}
        </button>

        <footer className="mt-8 pt-8 border-t border-slate-100 flex flex-wrap justify-center gap-x-4 gap-y-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3 h-3 text-indigo-300" /> Secure
          </span>
          <span>•</span>
          <span>Fast</span>
          <span>•</span>
          <span>Private</span>
        </footer>
      </div>
    </div>
  );
};

// --- Sub-component: FeatureCard ---
const FeatureCard = ({ icon, title, description, color = "bg-indigo-50" }) => (
  <div className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-100/30 transition-all duration-500 group hover:-translate-y-3">
    <div className={`w-16 h-16 ${color} rounded-2xl flex items-center justify-center mb-10 group-hover:rotate-6 transition-transform duration-500 shadow-inner`}>
      {icon}
    </div>
    <h3 className="text-2xl font-black text-slate-900 mb-6">{title}</h3>
    <p className="text-slate-500 font-medium leading-relaxed text-lg">{description}</p>
  </div>
);

// --- Main Component: LandingPage ---
const LandingPage = () => {
  const navigate = useNavigate();
  const { isUploaded } = useContext(TimetableContext);

  useEffect(() => {
    if (isUploaded) {
      navigate('/app');
    }
  }, [isUploaded, navigate]);

  const handleGetStarted = () => {
    const element = document.getElementById('upload-zone');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden font-['Inter',_sans-serif]">
      {/* Navigation */}
      <nav className="w-full py-8 px-8 max-w-7xl mx-auto flex justify-between items-center bg-transparent relative z-20">
        <div className="flex items-center gap-3 font-bold text-indigo-600 text-2xl">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100 transition-transform hover:scale-105 active:scale-95 duration-300">
            <Calendar className="w-6 h-6" />
          </div>
          <span className="tracking-tight">Timetablely</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Features</a>
          <a href="#about" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">About</a>
          <button 
            onClick={() => navigate('/app')}
            className="px-6 py-2.5 bg-slate-900 text-white rounded-full font-bold hover:bg-slate-800 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-slate-200"
          >
            Launch App
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-20 pb-24 grid lg:grid-cols-2 gap-20 items-center relative">
        <section className="flex flex-col gap-10">
          <div className="inline-flex items-center px-5 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-bold w-fit animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Sparkles className="w-4 h-4 mr-2" />
            ✦ Smart Timetable Analyzer
          </div>
          
          <div className="flex flex-col gap-6">
            <h1 className="text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1] animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
              Understand Your <span className="text-indigo-600">Timetable</span> Instantly
            </h1>
            <p className="text-xl text-slate-600 max-w-xl leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-700 delay-200">
              Upload your college timetable in .docx format. Our AI identifies faculty schedules, detects free slots, and generates a clean dashboard for your entire department.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 animate-in fade-in slide-in-from-bottom-16 duration-700 delay-300">
            {[
              { icon: <Calendar className="w-4 h-4" />, text: "Faculty Schedules" },
              { icon: <CheckCircle2 className="w-4 h-4" />, text: "Free Slot Detection" },
              { icon: <Zap className="w-4 h-4" />, text: "Instant Analysis" }
            ].map((feature, i) => (
              <span key={i} className="flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow-sm border border-slate-100 text-sm font-semibold text-slate-700 hover:shadow-md hover:border-indigo-100 transition-all cursor-default">
                <span className="text-indigo-600">{feature.icon}</span>
                {feature.text}
              </span>
            ))}
          </div>

          <button 
            onClick={handleGetStarted}
            className="flex items-center gap-3 text-indigo-600 font-bold group mt-4 animate-bounce hover:scale-105 transition-transform"
          >
            <ArrowRight className="w-6 h-6 rotate-90" />
            <span className="text-lg">Upload your file below to get started</span>
          </button>
        </section>

        <section className="relative h-[600px] flex items-center justify-center animate-in fade-in zoom-in duration-1000 delay-200">
          <div className="w-full h-full relative">
            <div className="absolute top-10 left-0 bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-2xl border-l-[6px] border-l-indigo-600 w-80 animate-pulse duration-[3000ms] hover:animate-none group cursor-pointer transition-all hover:scale-105">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xl font-black">DS</div>
                <div>
                  <p className="font-black text-slate-800 text-lg">Dr. Sharma</p>
                  <p className="text-sm text-green-600 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
                    3 free slots today
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute bottom-10 left-12 bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-2xl w-[320px] transition-all hover:scale-105">
              <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Weekly Density</p>
              <div className="grid grid-cols-3 gap-3">
                <div className="h-12 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200"></div>
                <div className="h-12 bg-indigo-300 rounded-xl"></div>
                <div className="h-12 bg-indigo-100 rounded-xl"></div>
                <div className="h-12 bg-indigo-400 rounded-xl"></div>
                <div className="h-12 bg-indigo-200 rounded-xl"></div>
                <div className="h-12 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200"></div>
                <div className="h-12 bg-indigo-100 rounded-xl"></div>
                <div className="h-12 bg-indigo-500 rounded-xl shadow-md shadow-indigo-100"></div>
                <div className="h-12 bg-indigo-50 rounded-xl border-2 border-dashed border-indigo-200 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-indigo-200/50"></div>
                </div>
              </div>
            </div>

            <div className="absolute top-1/2 -right-4 bg-white/80 backdrop-blur-md p-8 rounded-[2.5rem] shadow-2xl w-64 flex flex-col items-center gap-4 border border-white/50 transition-all hover:scale-110">
              <div className="text-6xl font-black text-indigo-600 bg-clip-text">12</div>
              <p className="text-sm font-bold text-slate-500 text-center leading-relaxed">Faculty Members<br/>Successfully Loaded</p>
            </div>
          </div>
        </section>
      </main>

      <section id="upload-zone" className="py-24 bg-white relative">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#F8F9FC] to-transparent"></div>
        <div className="max-w-7xl mx-auto px-6">
          <UploadSection />
        </div>
      </section>

      <section id="features" className="py-32 bg-[#F8F9FC]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl lg:text-5xl font-black mb-6 tracking-tight text-slate-900 border-b-4 border-indigo-100 w-fit mx-auto pb-4">Experience Organizing 2.0</h2>
            <p className="text-slate-500 text-xl font-medium">Powerful features built to handle the complexities of academic scheduling without the headache.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <FeatureCard 
              icon={<Upload className="h-8 w-8 text-indigo-600" />}
              title="One-Click Import"
              description="Simply upload your .docx timetable and let our engine handle the parsing and structure automatically."
            />
            <FeatureCard 
              icon={<BarChart3 className="h-8 w-8 text-emerald-600" />}
              title="Faculty Insights"
              description="Get detailed schedules for every faculty member with a single click. No more searching through giant spreadsheets."
              color="bg-emerald-50"
            />
            <FeatureCard 
              icon={<Clock className="h-8 w-8 text-violet-600" />}
              title="Free Slots Finder"
              description="Instantly identify common free slots for meetings, substitute classes, or department syncs."
              color="bg-violet-50"
            />
          </div>
        </div>
      </section>

      <section id="about" className="py-32 bg-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-24">
            <div className="flex-1 relative group">
              <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]">
                 <img 
                   src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80" 
                   alt="Team working on scheduling" 
                   className="w-full h-full object-cover aspect-[4/3]"
                 />
              </div>
              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-indigo-600 rounded-[3rem] -z-10 animate-pulse delay-700 opacity-20"></div>
              <div className="absolute -top-10 -left-10 w-48 h-48 bg-emerald-500 rounded-[3rem] -z-10 opacity-10"></div>
            </div>
            <div className="flex-1">
              <h2 className="text-4xl lg:text-5xl font-black mb-10 tracking-tight leading-tight">Designed for <span className="text-indigo-600">Educational Excellence</span></h2>
              <div className="space-y-8">
                <p className="text-slate-600 text-xl leading-relaxed font-medium">
                  Timetablely was born out of the frustration shared by educators worldwide. We realized that while education is evolving, the tools used to manage it often lag behind.
                </p>
                <div className="grid gap-6">
                  {[
                    { title: "Privacy First", text: "Your data is parsed locally and never stored on our servers.", icon: <ShieldCheck className="h-6 w-6 text-emerald-600" /> },
                    { title: "Team Collaboration", text: "Share insights across departments effortlessly.", icon: <Sparkles className="h-6 w-6 text-indigo-600" /> }
                  ].map((item, i) => (
                    <div key={i} className="flex items-start space-x-5 p-6 rounded-3xl border border-slate-100 hover:border-indigo-100 transition-colors">
                      <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-50 mt-1">
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="font-black text-slate-900 text-lg mb-1">{item.title}</h4>
                        <p className="text-slate-500 font-medium leading-relaxed">{item.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="w-full py-16 px-8 text-center bg-[#F8F9FC] border-t border-slate-100">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-6">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-xl">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
              <Calendar className="w-5 h-5" />
            </div>
            <span>Timetablely</span>
          </div>
          <p className="text-slate-400 font-medium italic">© 2026 Timetablely Analyzer. All rights reserved. Crafted for excellence in education.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
