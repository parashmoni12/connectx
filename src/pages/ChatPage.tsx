import React, { useState } from 'react';
import { Send, Paperclip, Smile, Phone, Video, MoreVertical, Hash } from 'lucide-react';
import { ChatSidebar } from '../components/chat/ChatSidebar';
import { ChatMessage } from '../components/chat/ChatMessage';
import type { Conversation, Message } from '../types/chat';

export const ChatPage: React.FC = () => {
  const [activeConversationId, setActiveConversationId] = useState('c1');
  const [inputText, setInputText] = useState('');

  const [conversations] = useState<Conversation[]>([
    { id: 'c1', name: 'general', type: 'channel', unreadCount: 2 },
    { id: 'c2', name: 'announcements', type: 'channel' },
    { id: 'c3', name: 'dev-team', type: 'channel' },
    { id: 'dm1', name: 'Sarah Connor', type: 'dm', isOnline: true, lastMessage: 'See you in the audio call!' },
    { id: 'dm2', name: 'Alex Mercer', type: 'dm', isOnline: false, lastMessage: 'Updated the repository.' },
  ]);

  const [messages, setMessages] = useState<Record<string, Message[]>>({
    c1: [
      {
        id: 'm1',
        senderId: 'u2',
        senderName: 'Sarah Connor',
        text: 'Hey everyone, welcome to the new ConnectX workspace!',
        timestamp: '10:42 AM',
      },
      {
        id: 'm2',
        senderId: 'u1',
        senderName: 'Alex Mercer',
        text: 'Looks awesome! Voice and video pages are working great.',
        timestamp: '10:44 AM',
        isMe: true,
      },
    ],
    dm1: [
      {
        id: 'm3',
        senderId: 'u2',
        senderName: 'Sarah Connor',
        text: 'See you in the audio call!',
        timestamp: '09:15 AM',
      },
    ],
  });

  const activeConv = conversations.find((c) => c.id === activeConversationId);
  const currentMessages = messages[activeConversationId] || [];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'u1',
      senderName: 'You',
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
    };

    setMessages((prev) => ({
      ...prev,
      [activeConversationId]: [...(prev[activeConversationId] || []), newMessage],
    }));

    setInputText('');
  };

  return (
    <div className="fixed inset-0 z-50 md:static md:z-auto flex h-screen md:h-[calc(100vh-5rem)] bg-slate-950 overflow-hidden md:rounded-2xl md:border md:border-slate-800">
      {/* 1. Left Channel/DM Sidebar */}
      <ChatSidebar
        conversations={conversations}
        activeId={activeConversationId}
        onSelect={setActiveConversationId}
      />

      {/* 2. Main Chat Area */}
      <div className="flex-1 flex flex-col h-full bg-slate-950/60 min-w-0">
        {/* Header */}
        <div className="flex-none px-4 py-3 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Hash className="w-4 h-4 text-slate-400" />
            <div>
              <h2 className="text-xs font-bold text-slate-100">{activeConv?.name || 'Chat'}</h2>
              <p className="text-[10px] text-slate-400">Active conversation thread</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-colors">
              <Phone className="w-4 h-4" />
            </button>
            <button className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-colors">
              <Video className="w-4 h-4" />
            </button>
            <button className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-colors">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          {currentMessages.length > 0 ? (
            currentMessages.map((msg) => <ChatMessage key={msg.id} message={msg} />)
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500 text-xs">
              No messages yet. Send a greeting!
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="flex-none p-3 bg-slate-900/80 border-t border-slate-800 flex items-center gap-2">
          <button
            type="button"
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-colors"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Message #${activeConv?.name || 'chat'}...`}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />

          <button
            type="button"
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-colors"
          >
            <Smile className="w-4 h-4" />
          </button>

          <button
            type="submit"
            className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all active:scale-95 shadow-md shadow-indigo-600/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};