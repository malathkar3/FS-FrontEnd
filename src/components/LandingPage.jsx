import React from 'react';
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
  Clock
} from 'lucide-react';
import UploadSection from './UploadSection';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    // Scroll to upload section
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
        {/* Background Blobs */}
        <div className="absolute top-0 right-0 -z-10 w-[600px] h-[600px] bg-indigo-200/40 rounded-full blur-[100px] -mr-48 -mt-48 transition-all duration-1000"></div>
        <div className="absolute bottom-0 left-0 -z-10 w-[500px] h-[500px] bg-emerald-100/30 rounded-full blur-[100px] -ml-48 -mb-48"></div>

        {/* Left Column: Content */}
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

        {/* Right Column: Abstract UI Mockup */}
        <section className="relative h-[600px] flex items-center justify-center animate-in fade-in zoom-in duration-1000 delay-200">
          <div className="w-full h-full relative">
            {/* Main Faculty Card */}
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

            {/* Weekly Density Card */}
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

            {/* Stats Card */}
            <div className="absolute top-1/2 -right-4 bg-white/80 backdrop-blur-md p-8 rounded-[2.5rem] shadow-2xl w-64 flex flex-col items-center gap-4 border border-white/50 transition-all hover:scale-110">
              <div className="text-6xl font-black text-indigo-600 bg-clip-text">12</div>
              <p className="text-sm font-bold text-slate-500 text-center leading-relaxed">Faculty Members<br/>Successfully Loaded</p>
            </div>
          </div>
        </section>
      </main>

      {/* Upload Section Wrapper */}
      <section id="upload-zone" className="py-24 bg-white relative">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#F8F9FC] to-transparent"></div>
        <div className="max-w-7xl mx-auto px-6">
          <UploadSection />
        </div>
      </section>

      {/* Features Grid */}
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

      {/* About Section */}
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

const FeatureCard = ({ icon, title, description, color = "bg-indigo-50" }) => (
  <div className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-100/30 transition-all duration-500 group hover:-translate-y-3">
    <div className={`w-16 h-16 ${color} rounded-2xl flex items-center justify-center mb-10 group-hover:rotate-6 transition-transform duration-500 shadow-inner`}>
      {icon}
    </div>
    <h3 className="text-2xl font-black text-slate-900 mb-6">{title}</h3>
    <p className="text-slate-500 font-medium leading-relaxed text-lg">{description}</p>
  </div>
);

export default LandingPage;
