import React, { useState } from 'react';
import { ArrowLeft, Maximize, Minimize } from 'lucide-react';
import { CallControls } from '../components/video/CallControls';
import { AddParticipantModal } from '../components/video/AddParticipantModal';
import { VideoTile } from '../components/video/VideoTile';
import type { Participant } from '../types/video';



export const VideoCallPage = () => {
  const currentUserId = 'user-1';

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [focusedParticipantId, setFocusedParticipantId] = useState<string | null>(null);

  const [participants, setParticipants] = useState<Participant[]>([
    {
      id: 'user-1',
      name: 'Alex Mercer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      isHost: true,
      isMuted: false,
      isVideoOff: false,
    },
    {
      id: 'user-2',
      name: 'Sarah Connor',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      isMuted: true,
      isVideoOff: false,
    },
  ]);

  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const localUser = participants.find((p) => p.id === currentUserId);
  const focusedParticipant = participants.find((p) => p.id === focusedParticipantId);

  // Helper function to return dynamic CSS grid classes based on participant count
  const getGridClasses = (count: number) => {
    if (count <= 1) return 'grid-cols-1 grid-rows-1';
    if (count === 2) return 'grid-cols-1 md:grid-cols-2 grid-rows-2 md:grid-rows-1';
    if (count <= 4) return 'grid-cols-2 grid-rows-2';
    if (count <= 6) return 'grid-cols-2 md:grid-cols-3 grid-rows-3 md:grid-rows-2';
    return 'grid-cols-3 md:grid-cols-4 grid-rows-auto';
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Fullscreen error: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const toggleParticipantFocus = (participantId: string) => {
    if (focusedParticipantId === participantId) {
      setFocusedParticipantId(null);
    } else {
      setFocusedParticipantId(participantId);
    }
  };

  const toggleMic = () => {
    setParticipants((prev) =>
      prev.map((p) => (p.id === currentUserId ? { ...p, isMuted: !p.isMuted } : p))
    );
  };

  const toggleCamera = () => {
    setParticipants((prev) =>
      prev.map((p) => (p.id === currentUserId ? { ...p, isVideoOff: !p.isVideoOff } : p))
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
        isVideoOff: false,
      },
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 md:static md:z-auto flex flex-col h-screen md:h-[calc(100vh-5rem)] bg-slate-950 p-3 sm:p-4 gap-3 overflow-hidden md:rounded-2xl md:border md:border-slate-800">
      
      {/* Header Info Bar */}
      <div className="flex-none flex items-center justify-between bg-slate-900/80 border border-slate-800/80 px-3 sm:px-4 py-2 rounded-2xl backdrop-blur-md z-10">
        <div className="flex items-center gap-2.5">
         
          <div>
            <h1 className="text-xs font-bold text-slate-100">ConnectX Live Session</h1>
            <p className="text-[10px] text-slate-400">
              {participants.length} Active Participants
            </p>
          </div>
        </div>

        <span className="flex px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold border border-emerald-500/20 items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          P2P Connected
        </span>
      </div>

      {/* Main Video Area */}
      <div className="relative flex-1 min-h-0 h-full w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800">
        
        {/* MODE 1: FOCUS / PINNED MODE */}
        {focusedParticipant ? (
          <div className="relative w-full h-full">
            <VideoTile
              participant={focusedParticipant}
              isLocal={focusedParticipant.id === currentUserId}
            />

            {/* Restore Grid Layout Button */}
            <button
              onClick={() => toggleParticipantFocus(focusedParticipant.id)}
              className="absolute bottom-3 right-3 z-30 p-2 bg-slate-950/80 hover:bg-slate-900 text-indigo-400 border border-indigo-500/40 rounded-xl backdrop-blur-md transition-all active:scale-95"
              title="Restore Grid Layout"
            >
              <Minimize className="w-4 h-4" />
            </button>

            {/* Floating PiP Sidebar for All Other Participants */}
            <div className="absolute bottom-14 right-3 z-20 flex flex-col gap-2 max-h-[70%] overflow-y-auto custom-scrollbar">
              {participants
                .filter((p) => p.id !== focusedParticipantId)
                .map((p) => (
                  <button
                    key={p.id}
                    onClick={() => toggleParticipantFocus(p.id)}
                    className="w-28 sm:w-36 h-28 sm:h-36 shadow-2xl rounded-2xl overflow-hidden border-2 border-slate-700/80 hover:border-indigo-500/80 transition-all text-left cursor-pointer focus:outline-none flex-none"
                    title={`Focus on ${p.name}`}
                  >
                    <VideoTile participant={p} isLocal={p.id === currentUserId} />
                  </button>
                ))}
            </div>
          </div>
        ) : (
          /* MODE 2: DYNAMIC ADAPTIVE GRID */
          <div className={`h-full w-full p-2 sm:p-3 gap-2 sm:gap-3 grid ${getGridClasses(participants.length)} overflow-hidden`}>
            {participants.map((participant) => (
              <div
                key={participant.id}
                className="relative flex-1 min-h-0 h-full w-full rounded-xl overflow-hidden"
              >
                <VideoTile
                  participant={participant}
                  isLocal={participant.id === currentUserId}
                />

                {/* Focus Expand Button */}
                <button
                  onClick={() => toggleParticipantFocus(participant.id)}
                  className="absolute bottom-3 right-3 z-20 p-2 bg-slate-950/80 hover:bg-slate-900 text-slate-200 border border-slate-700/60 rounded-xl backdrop-blur-md transition-all active:scale-95 hover:border-indigo-500/50"
                  title="Expand Video"
                >
                  <Maximize className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Controls Bar */}
      <div className="flex-none pb-1 sm:pb-2 z-10">
        <CallControls
          isMuted={localUser?.isMuted ?? false}
          isVideoOff={localUser?.isVideoOff ?? false}
          isScreenSharing={isScreenSharing}
          isFullscreen={isFullscreen}
          onToggleMic={toggleMic}
          onToggleCamera={toggleCamera}
          onToggleScreenShare={() => setIsScreenSharing(!isScreenSharing)}
          onToggleFullscreen={toggleFullscreen}
          onAddParticipant={() => setIsAddModalOpen(true)}
          onEndCall={() => {
            if (onBack) onBack();
            else alert('Call ended');
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