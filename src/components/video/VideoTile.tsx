import React from 'react';
import { MicOff, Crown } from 'lucide-react';
import { Avatar } from '../common/Avatar';
import type { Participant } from '../../types/video';

interface VideoTileProps {
  participant: Participant;
  isLocal?: boolean;
}

export const VideoTile: React.FC<VideoTileProps> = ({ participant, isLocal = false }) => {
  return (
    <div className="relative flex items-center justify-center bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden min-h-[200px] w-full shadow-lg group">
      
      {/* Video Stream or Avatar Fallback */}
      {participant.isVideoOff ? (
        <div className="flex flex-col items-center justify-center gap-3 p-4">
          <Avatar name={participant.name} src={participant.avatar} size="lg" />
          <span className="text-xs text-slate-400 font-medium">Camera is turned off</span>
        </div>
      ) : (
        /* If video is on, render placeholder/stream stream container */
        <div className="relative w-full h-full min-h-[220px] bg-slate-950 flex items-center justify-center overflow-hidden">
          {/* Avatar overlay background effect when camera is on */}
          <img
            src={participant.avatar}
            alt={participant.name}
            className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
        </div>
      )}

      {/* Host Badge */}
      {participant.isHost && (
        <div className="absolute top-3 left-3 flex items-center gap-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-1 rounded-lg text-[10px] font-semibold backdrop-blur-md">
          <Crown className="w-3 h-3" />
          <span>Host</span>
        </div>
      )}

      {/* Mute Indicator */}
      {participant.isMuted && (
        <div className="absolute top-3 right-3 p-1.5 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-lg backdrop-blur-md">
          <MicOff className="w-3.5 h-3.5" />
        </div>
      )}

      {/* Participant Name Tag */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-100 bg-slate-950/70 border border-slate-800/80 px-2.5 py-1 rounded-xl backdrop-blur-md truncate max-w-[80%]">
          {participant.name} {isLocal && '(You)'}
        </span>
      </div>
    </div>
  );
};