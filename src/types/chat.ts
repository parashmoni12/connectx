// src/types/chat.ts

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  text: string;
  timestamp: string;
  attachments?: {
    type: 'image' | 'file';
    url: string;
    name?: string;
  }[];
  isMe?: boolean;
}

export interface Conversation {
  id: string;
  name: string;
  avatar?: string;
  type: 'channel' | 'dm' | 'group';
  isOnline?: boolean;
  unreadCount?: number;
  lastMessage?: string;
  lastMessageTime?: string;
}