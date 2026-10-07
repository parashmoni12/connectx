import React, { useState } from 'react';
import { FriendsFilter } from '../components/friends/FriendsFilter';
import { FriendCard } from '../components/friends/FriendCard';
import { EmptyFriendsState } from '../components/friends/EmptyFriendsState';
import type { FriendUser, FriendTab } from '../types/friend';

export const FriendsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<FriendTab>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [users, setUsers] = useState<FriendUser[]>([
    {
      id: 'f1',
      name: 'Sarah Connor',
      username: 'sarah_c',
      mutualFriendsCount: 12,
      isOnline: true,
      status: 'friend',
    },
    {
      id: 'f2',
      name: 'Devon Knight',
      username: 'devon_k',
      mutualFriendsCount: 4,
      isOnline: false,
      status: 'friend',
    },
    {
      id: 'r1',
      name: 'Elena Rostova',
      username: 'elena_r',
      mutualFriendsCount: 8,
      status: 'pending_incoming',
    },
    {
      id: 's1',
      name: 'Marcus Vance',
      username: 'marcus_v',
      mutualFriendsCount: 15,
      status: 'none',
    },
  ]);

  const handleAcceptRequest = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: 'friend' } : u))
    );
  };

  const handleRejectRequest = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const handleAddFriend = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: 'pending_outgoing' } : u))
    );
  };

  const handleRemoveFriend = (id: string) => {
    if (confirm('Are you sure you want to remove this friend?')) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
    }
  };

  const friendsList = users.filter((u) => u.status === 'friend');
  const requestsList = users.filter((u) => u.status === 'pending_incoming');
  const suggestionsList = users.filter((u) => u.status === 'none' || u.status === 'pending_outgoing');

  const getDisplayedList = () => {
    let baseList = friendsList;
    if (activeTab === 'requests') baseList = requestsList;
    if (activeTab === 'suggestions') baseList = suggestionsList;

    return baseList.filter(
      (u) =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const currentList = getDisplayedList();

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 p-4 md:p-6 overflow-y-auto max-w-5xl mx-auto w-full space-y-6">
     

      <FriendsFilter
        activeTab={activeTab}
        onTabChange={setActiveTab}
        friendsCount={friendsList.length}
        requestsCount={requestsList.length}
        suggestionsCount={suggestionsList.length}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {currentList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentList.map((user) => (
            <FriendCard
              key={user.id}
              user={user}
              onAccept={handleAcceptRequest}
              onReject={handleRejectRequest}
              onAddFriend={handleAddFriend}
              onRemoveFriend={handleRemoveFriend}
              onMessage={(id) => alert(`Open direct message with user ${id}`)}
            />
          ))}
        </div>
      ) : (
        <EmptyFriendsState
          activeTab={activeTab}
          searchQuery={searchQuery}
          onClearSearch={() => setSearchQuery('')}
        />
      )}
    </div>
  );
};