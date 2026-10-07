import React from 'react';
import { Mic, MicOff, Video, VideoOff, ScreenShare, PhoneOff, UserPlus, Maximize2, Minimize2 } from 'lucide-react';

interface CallControlsProps {
  isMuted: boolean;
  isVideoOff: boolean;
  isScreenSharing: boolean;
  isFullscreen?: boolean;
  onToggleMic: () => void;
  onToggleCamera: () => void;
  onToggleScreenShare: () => void;
  onToggleFullscreen?: () => void;
  onAddParticipant: () => void;
  onEndCall: () => void;
}


export const CallControls: React.FC<CallControlsProps> = ({
  isMuted,
  isVideoOff,
  isScreenSharing,
  isFullscreen = false,
  onToggleMic,
  onToggleCamera,
  onToggleScreenShare,
  onToggleFullscreen,
  onAddParticipant,
  onEndCall,
}) => {
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3 bg-slate-900/90 border border-slate-800/90 py-2.5 px-4 rounded-2xl max-w-xl mx-auto shadow-2xl backdrop-blur-xl">
      <button
        onClick={onToggleMic}
        className={`p-2.5 sm:p-3 rounded-xl transition-all ${
          isMuted
            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
            : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
        }`}
        title={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted ? <MicOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Mic className="w-4 h-4 sm:w-5 sm:h-5" />}
      </button>

      <button
        onClick={onToggleCamera}
        className={`p-2.5 sm:p-3 rounded-xl transition-all ${
          isVideoOff
            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
            : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
        }`}
        title={isVideoOff ? 'Turn Camera On' : 'Turn Camera Off'}
      >
        {isVideoOff ? <VideoOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Video className="w-4 h-4 sm:w-5 sm:h-5" />}
      </button>

      <button
        onClick={onToggleScreenShare}
        className={`p-2.5 sm:p-3 rounded-xl transition-all ${
          isScreenSharing
            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
            : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
        }`}
        title="Share Screen"
      >
        <ScreenShare className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      {/* 👈 Fullscreen Toggle Icon */}
      {onToggleFullscreen && (
        <button
          onClick={onToggleFullscreen}
          className="p-2.5 sm:p-3 bg-slate-800 text-slate-200 hover:bg-slate-700 rounded-xl transition-all"
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" /> : <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5" />}
        </button>
      )}

      {/* Add Participant Button */}
      <button
        onClick={onAddParticipant}
        className="p-2.5 sm:p-3 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 border border-indigo-500/30 rounded-xl transition-all"
        title="Add Participant"
      >
        <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      <button
        onClick={onEndCall}
        className="p-2.5 sm:p-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-lg shadow-rose-600/30 transition-all"
        title="End Call"
      >
        <PhoneOff className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
    </div>
  );
};