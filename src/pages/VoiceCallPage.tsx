import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { VoiceTile} from '../components/voice/VoiceTile';
import { VoiceControls } from '../components/voice/VoiceControls';
import { AddParticipantModal } from '../components/video/AddParticipantModal';
import type { VoiceParticipant } from '../types/video';

interface VoiceCallPageProps {
  onBack?: () => void;
}

export const VoiceCallPage: React.FC<VoiceCallPageProps> = ({ onBack }) => {
  const currentUserId = 'user-1';

  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [participants, setParticipants] = useState<VoiceParticipant[]>([
    {
      id: 'user-1',
      name: 'Alex Mercer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      isMuted: false,
      isSpeaking: true,
      isHost: true,
    },
    {
      id: 'user-2',
      name: 'Sarah Connor',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      isMuted: true,
      isSpeaking: false,
    },
  ]);

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
    setParticipants((prev) =>
      prev.map((p) => (p.id === currentUserId ? { ...p, isMuted: !p.isMuted } : p))
    );
  };

  const handleInviteFriend = (friend: { id: string; name: string; avatar: string }) => {
    setParticipants((prev) => [
      ...prev,
      {
        id: friend.id,
        name: friend.name,
        avatar: friend.avatar,
        isMuted: false,
        isSpeaking: false,
      },
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 md:static md:z-auto flex flex-col h-screen md:h-[calc(100vh-5rem)] bg-slate-950 p-3 sm:p-4 gap-3 overflow-hidden md:rounded-2xl md:border md:border-slate-800">
      
      {/* 1. Header Info Bar */}
      <div className="flex-none flex items-center justify-between bg-slate-900/80 border border-slate-800/80 px-3 sm:px-4 py-2 rounded-2xl backdrop-blur-md z-10">
        <div className="flex items-center gap-2.5">
          {onBack && (
            <button
              onClick={onBack}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors"
              title="Leave call"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <h1 className="text-xs font-bold text-slate-100">ConnectX Audio Room</h1>
            <p className="text-[10px] text-slate-400">
              {participants.length} Participants Connected
            </p>
          </div>
        </div>

        <span className="flex px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold border border-emerald-500/20 items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Encrypted Voice HD
        </span>
      </div>

      {/* 2. Main Stage */}
      <div className="relative flex-1 min-h-0 h-full w-full rounded-2xl overflow-hidden bg-slate-900/80 border border-slate-800/80 flex items-center justify-center p-6">
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 via-transparent to-sky-500/5 pointer-events-none" />

        <div className="flex flex-wrap items-center justify-center gap-8 max-w-4xl z-10">
          {participants.map((participant) => (
            <VoiceTile
              key={participant.id}
              participant={participant}
              isLocal={participant.id === currentUserId}
            />
          ))}
        </div>
      </div>

      {/* 3. Controls Bar */}
      <div className="flex-none pb-1 sm:pb-2 z-10 flex justify-center">
        <VoiceControls
          isMuted={isMuted}
          isDeafened={isDeafened}
          onToggleMute={toggleMute}
          onToggleDeafen={() => setIsDeafened(!isDeafened)}
          onAddParticipant={() => setIsAddModalOpen(true)}
          onEndCall={() => {
            if (onBack) onBack();
            else alert('Voice call ended');
          }}
        />
      </div>

      {/* Add Participant Modal */}
      <AddParticipantModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onInviteFriend={handleInviteFriend}
      />
    </div>
  );
};