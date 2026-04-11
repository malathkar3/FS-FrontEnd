import React, { useState, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  UploadCloud, 
  FileText, 
  AlertCircle, 
  Loader2, 
  CheckCircle, 
  ShieldCheck 
} from 'lucide-react';
import { TimetableContext } from '../context/TimetableContext';

const UploadSection = ({ onUploadSuccess }) => {
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
      if (onUploadSuccess) {
        onUploadSuccess();
      } else {
        navigate('/faculty');
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

export default UploadSection;
