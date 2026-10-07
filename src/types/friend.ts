export type FriendTab = 'all' | 'requests' | 'suggestions';

export interface FriendUser {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  mutualFriendsCount?: number;
  isOnline?: boolean;
  status: 'friend' | 'pending_incoming' | 'pending_outgoing' | 'none';
}