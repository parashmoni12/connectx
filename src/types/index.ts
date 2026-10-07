// src/types/index.ts

export interface User {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  isOnline?: boolean;
}

export interface Friend {
  id: number | string;
  name: string;
  avatar?: string;
  status: 'Online' | 'Offline' | 'In a call';
  isOnline: boolean;
}

export interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface VoiceParticipant {
  id: string;
  name: string;
  avatar?: string;
  isMuted: boolean;
  isSpeaking: boolean;
  isHost?: boolean;
}