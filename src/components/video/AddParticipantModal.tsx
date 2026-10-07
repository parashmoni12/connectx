import React, { useState } from 'react';
import { X, Copy, Check, Search, UserPlus } from 'lucide-react';
import { Avatar } from '../common/Avatar';

interface Friend {
  id: string;
  name: string;
  username: string;
  avatar: string;
  isOnline: boolean;
}

interface AddParticipantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInviteFriend: (friend: Friend) => void;
}

export const AddParticipantModal: React.FC<AddParticipantModalProps> = ({
  isOpen,
  onClose,
  onInviteFriend,
}) => {
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [invitedIds, setInvitedIds] = useState<string[]>([]);

  if (!isOpen) return null;

  const roomLink = 'https://connectx.app/calls/room-x92f8a';

  const mockFriends: Friend[] = [
    { id: 'f-1', name: 'John Doe', username: 'johndoe', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', isOnline: true },
    { id: 'f-2', name: 'Emma Watson', username: 'emmaw', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', isOnline: true },
    { id: 'f-3', name: 'Liam Neeson', username: 'liamn', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', isOnline: false },
  ];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(roomLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInvite = (friend: Friend) => {
    setInvitedIds((prev) => [...prev, friend.id]);
    onInviteFriend(friend);
  };

  const filteredFriends = mockFriends.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl max-w-md w-full shadow-2xl space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-slate-100">Add Participants</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Copy Call Link Section */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-400">Invite via Room Link</label>
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 p-2 rounded-2xl">
            <input
              type="text"
              readOnly
              value={roomLink}
              className="bg-transparent text-xs text-slate-300 px-2 flex-1 outline-none truncate"
            />
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-medium transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Invite Friends Section */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-slate-400">Direct Invite Friends</label>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search friends..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-1">
            {filteredFriends.map((friend) => {
              const isInvited = invitedIds.includes(friend.id);
              return (
                <div
                  key={friend.id}
                  className="flex items-center justify-between p-2 rounded-xl bg-slate-950/50 border border-slate-800/60"
                >
                  <div className="flex items-center gap-2.5">
                    <Avatar name={friend.name} src={friend.avatar} isOnline={friend.isOnline} size="sm" />
                    <div>
                      <p className="text-xs font-bold text-slate-200">{friend.name}</p>
                      <p className="text-[10px] text-slate-400">@{friend.username}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleInvite(friend)}
                    disabled={isInvited}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                      isInvited
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                    }`}
                  >
                    {isInvited ? 'Invited' : 'Invite'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};