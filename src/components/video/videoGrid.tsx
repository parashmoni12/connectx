import React from 'react';
import { VideoTile } from './VideoTile';
import type { Participant } from '../../types/video';

interface VideoGridProps {
  participants: Participant[];
  currentUserId: string;
}

export const VideoGrid: React.FC<VideoGridProps> = ({ participants, currentUserId }) => {
  // Automatically adjust grid layout based on number of active participants
  const gridColsClass =
    participants.length <= 1
      ? 'grid-cols-1'
      : participants.length <= 4
      ? 'grid-cols-1 md:grid-cols-2'
      : 'grid-cols-2 md:grid-cols-3';

  return (
    <div className={`grid ${gridColsClass} gap-4 flex-1 w-full bg-slate-950 border border-slate-800/80 rounded-2xl p-4 overflow-y-auto custom-scrollbar min-h-[350px]`}>
      {participants.map((participant) => (
        <VideoTile
          key={participant.id}
          participant={participant}
          isLocal={participant.id === currentUserId}
        />
      ))}
    </div>
  );
};