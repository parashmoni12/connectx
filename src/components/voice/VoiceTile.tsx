import React from 'react';
import { MicOff } from 'lucide-react';
import { Avatar } from '../common/Avatar';



interface VoiceTileProps {
  participant: VoiceParticipant;
  isLocal?: boolean;
}

export const VoiceTile: React.FC<VoiceTileProps> = ({ participant, isLocal }) => {
  return (
    <div className="flex flex-col items-center gap-3 group relative">
      {/* Avatar Container with Active Speaker Pulse */}
      <div className="relative">
        {participant.isSpeaking && !participant.isMuted && (
          <>
            <span className="absolute -inset-2 rounded-full bg-emerald-500/20 animate-ping opacity-75" />
            <span className="absolute -inset-1 rounded-full bg-emerald-500/30 animate-pulse" />
          </>
        )}

        <div
          className={`relative p-1 rounded-full transition-all duration-300 ${
            participant.isSpeaking && !participant.isMuted
              ? 'ring-4 ring-emerald-500 shadow-lg shadow-emerald-500/20'
              : 'ring-2 ring-slate-700/60'
          }`}
        >
          <Avatar name={participant.name} size="lg" />

          {/* Host Badge */}
          {participant.isHost && (
            <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full bg-indigo-600 text-white text-[9px] font-bold border border-slate-900">
              HOST
            </span>
          )}

          {/* Mute Indicator */}
          {participant.isMuted && (
            <div className="absolute bottom-0 right-0 p-1 bg-red-500/90 text-white rounded-full border-2 border-slate-900 shadow-md">
              <MicOff className="w-3 h-3" />
            </div>
          )}
        </div>
      </div>

      {/* Name & Status */}
      <div className="text-center">
        <p className="text-xs font-semibold text-slate-200">
          {participant.name} {isLocal && '(You)'}
        </p>
        <p className="text-[10px] text-slate-400 mt-0.5">
          {participant.isMuted
            ? 'Muted'
            : participant.isSpeaking
            ? 'Speaking...'
            : 'Listening'}
        </p>
      </div>
    </div>
  );
};