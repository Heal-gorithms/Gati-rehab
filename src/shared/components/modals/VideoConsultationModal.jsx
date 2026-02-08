
import { useState } from 'react';
import { X, Video, Shield, PhoneOff, Maximize2 } from 'lucide-react';
import { useEscapeKey } from '../../hooks/useEscapeKey';

const VideoConsultationModal = ({ isOpen, onClose, roomName = 'GatiRecoverySession' }) => {
  const [loading, setLoading] = useState(true);

  // Accessibility: Handle Escape key
  useEscapeKey(onClose, isOpen);

  if (!isOpen) return null;

  // Jitsi Meet URL
  const jitsiUrl = `https://meet.jit.si/${roomName}#config.prejoinPageEnabled=false&config.disableDeepLinking=true`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-md" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative bg-white w-full h-full md:w-[95vw] md:h-[90vh] md:rounded-[2.5rem] shadow-3xl overflow-hidden flex flex-col transform transition-all animate-in zoom-in duration-300">
        {/* Header */}
        <div className="p-6 bg-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Video className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white leading-none mb-1">Live Consultation</h2>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <Shield className="w-3 h-3 text-blue-400" /> Secure Clinical Encrypted
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg active:scale-95"
            >
              <PhoneOff className="w-4 h-4" /> End Session
            </button>
          </div>
        </div>

        {/* Video Iframe Container */}
        <div className="flex-1 relative bg-slate-100">
          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-white">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Connecting to Secure Session...</p>
            </div>
          )}
          <iframe
            src={jitsiUrl}
            allow="camera; microphone; fullscreen; display-capture; autoplay"
            className="w-full h-full border-none"
            onLoad={() => setLoading(false)}
            title="Video Consultation"
          />
        </div>

        {/* Footer Disclaimer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
            This session is private and intended for rehabilitation purposes only.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoConsultationModal;
