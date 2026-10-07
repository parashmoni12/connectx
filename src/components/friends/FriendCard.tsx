import React from 'react';
import { UserCheck, UserX, UserPlus, MessageSquare, MoreVertical, Check } from 'lucide-react';
import { Avatar } from '../common/Avatar';
import type { FriendUser } from '../../types/friend';

interface FriendCardProps {
  user: FriendUser;
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
  onAddFriend?: (id: string) => void;
  onRemoveFriend?: (id: string) => void;
  onMessage?: (id: string) => void;
}

export const FriendCard: React.FC<FriendCardProps> = ({
  user,
  onAccept,
  onReject,
  onAddFriend,
  onRemoveFriend,
  onMessage,
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800/90 rounded-2xl p-4 shadow-lg flex items-center justify-between gap-4 relative group hover:border-slate-700/80 transition-all">
      {/* User Info */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="relative">
          <Avatar name={user.name} size="md" />
          {user.isOnline && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full" />
          )}
        </div>

        <div className="min-w-0">
          <h4 className="text-sm font-semibold text-slate-100 truncate">{user.name}</h4>
          <p className="text-xs text-slate-400 truncate">@{user.username}</p>
          {user.mutualFriendsCount !== undefined && (
            <p className="text-[11px] text-slate-500 mt-0.5">
              {user.mutualFriendsCount} mutual friends
            </p>
          )}
        </div>
      </div>

      {/* Dynamic Action Buttons */}
      <div className="flex items-center gap-2">
        {user.status === 'friend' && (
          <>
            <button
              onClick={() => onMessage?.(user.id)}
              className="p-2 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white rounded-xl text-xs font-medium transition-all"
              title="Send Message"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
            <button
              onClick={() => onRemoveFriend?.(user.id)}
              className="p-2 bg-slate-800 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 rounded-xl transition-all"
              title="Remove Friend"
            >
              <UserX className="w-4 h-4" />
            </button>
          </>
        )}

        {user.status === 'pending_incoming' && (
          <>
            <button
              onClick={() => onAccept?.(user.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-medium transition-all"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Accept</span>
            </button>
            <button
              onClick={() => onReject?.(user.id)}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-xl transition-all"
              title="Decline Request"
            >
              <UserX className="w-4 h-4" />
            </button>
          </>
        )}

        {user.status === 'pending_outgoing' && (
          <span className="px-3 py-1.5 bg-slate-800 text-slate-400 rounded-xl text-xs font-medium border border-slate-700/50">
            Requested
          </span>
        )}

        {user.status === 'none' && (
          <button
            onClick={() => onAddFriend?.(user.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white rounded-xl text-xs font-medium transition-all"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add Friend</span>
          </button>
        )}
      </div>
    </div>
  );
};