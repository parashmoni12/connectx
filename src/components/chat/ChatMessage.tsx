import React from 'react';
import { Avatar } from '../common/Avatar';
import type { Message } from '../../types/chat';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const { senderName, text, timestamp, isMe, attachments } = message;

  return (
    <div className={`flex items-end gap-2.5 my-3 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
      {!isMe && <Avatar name={senderName} size="sm" />}

      <div className={`flex flex-col max-w-[75%] sm:max-w-[65%] ${isMe ? 'items-end' : 'items-start'}`}>
        {!isMe && <span className="text-[11px] font-medium text-slate-400 mb-1 ml-1">{senderName}</span>}

        <div
          className={`px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
            isMe
              ? 'bg-indigo-600 text-white rounded-br-none'
              : 'bg-slate-800 text-slate-200 border border-slate-700/60 rounded-bl-none'
          }`}
        >
          {text}

          {attachments && attachments.length > 0 && (
            <div className="mt-2 flex flex-col gap-2">
              {attachments.map((item, idx) => (
                <div key={idx} className="overflow-hidden rounded-xl border border-white/10">
                  {item.type === 'image' && (
                    <img src={item.url} alt="Attachment" className="max-h-48 object-cover rounded-lg" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <span className="text-[9px] text-slate-500 mt-1 px-1">{timestamp}</span>
      </div>
    </div>
  );
};