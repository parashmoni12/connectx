import React from 'react';
import { Mic, MicOff, Volume2, UserPlus, PhoneOff } from 'lucide-react';

interface VoiceControlsProps {
  isMuted: boolean;
  isDeafened: boolean;
  onToggleMute: () => void;
  onToggleDeafen: () => void;
  onAddParticipant: () => void;
  onEndCall: () => void;
}

export const VoiceControls: React.FC<VoiceControlsProps> = ({
  isMuted,
  isDeafened,
  onToggleMute,
  onToggleDeafen,
  onAddParticipant,
  onEndCall,
}) => {
  return (
    <div className="flex items-center gap-3 p-2 sm:p-2.5 rounded-2xl bg-slate-900/90 border border-slate-800/90 backdrop-blur-md shadow-2xl">
      {/* Mic Mute Button */}
      <button
        onClick={onToggleMute}
        className={`p-3 rounded-xl transition-all ${
          isMuted
            ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
            : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700/50'
        }`}
        title={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
      </button>

      {/* Deafen Button */}
      <button
        onClick={onToggleDeafen}
        className={`p-3 rounded-xl transition-all ${
          isDeafened
            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
            : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700/50'
        }`}
        title={isDeafened ? 'Undeafen' : 'Deafen'}
      >
        <Volume2 className={`w-5 h-5 ${isDeafened ? 'line-through text-amber-400' : ''}`} />
      </button>

      {/* Add Participant Button */}
      <button
        onClick={onAddParticipant}
        className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700/50 transition-all"
        title="Invite Friend"
      >
        <UserPlus className="w-5 h-5" />
      </button>

      {/* End Call Button */}
      <button
        onClick={onEndCall}
        className="p-3 bg-red-600 hover:bg-red-500 text-white rounded-xl shadow-lg shadow-red-600/20 transition-all active:scale-95"
        title="End Call"
      >
        <PhoneOff className="w-5 h-5" />
      </button>
    </div>
  );
};