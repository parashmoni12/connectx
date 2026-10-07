import React, { useState } from 'react';
import { Image, Smile, Tag, Globe, Lock, Send, X } from 'lucide-react';
import { Avatar } from '../common/Avatar';

export interface NewPostData {
  content: string;
  mediaUrl?: string;
  tag?: string;
  privacy: 'public' | 'friends';
}

interface CreatePostProps {
  currentUser: {
    name: string;
    avatar: string;
  };
  onSubmitPost: (post: NewPostData) => void;
}

export const CreatePost: React.FC<CreatePostProps> = ({ currentUser, onSubmitPost }) => {
  const [content, setContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [showMediaInput, setShowMediaInput] = useState(false);
  const [tag, setTag] = useState('');
  const [privacy, setPrivacy] = useState<'public' | 'friends'>('public');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !mediaUrl.trim()) return;

    onSubmitPost({
      content,
      mediaUrl: mediaUrl.trim() || undefined,
      tag: tag.trim() || undefined,
      privacy,
    });

    // Reset Form
    setContent('');
    setMediaUrl('');
    setShowMediaInput(false);
    setTag('');
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-4">
      <div className="flex gap-3">
        <Avatar name={currentUser.name} src={currentUser.avatar} size="md" />
        
        <div className="flex-1 space-y-2">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`What's on your mind, ${currentUser.name.split(' ')[0]}?`}
            rows={3}
            className="w-full bg-slate-950 border border-slate-800/80 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 resize-none transition-all"
          />

          {/* Optional Media URL Input */}
          {showMediaInput && (
            <div className="relative flex items-center bg-slate-950 border border-slate-800 rounded-xl p-2 animate-in fade-in duration-150">
              <input
                type="text"
                placeholder="Paste image or media URL..."
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                className="w-full bg-transparent text-xs text-slate-200 placeholder-slate-500 outline-none px-2"
              />
              <button
                type="button"
                onClick={() => {
                  setShowMediaInput(false);
                  setMediaUrl('');
                }}
                className="text-slate-500 hover:text-slate-300 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Media Preview */}
          {mediaUrl && (
            <div className="relative rounded-xl overflow-hidden max-h-48 bg-slate-950 border border-slate-800">
              <img src={mediaUrl} alt="Attachment preview" className="w-full h-48 object-cover" />
            </div>
          )}
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setShowMediaInput(!showMediaInput)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
              showMediaInput || mediaUrl
                ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Image className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Photo / Video</span>
          </button>

          <button
            type="button"
            onClick={() => setPrivacy(privacy === 'public' ? 'friends' : 'public')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            {privacy === 'public' ? (
              <>
                <Globe className="w-4 h-4 text-sky-400" />
                <span className="hidden sm:inline">Public</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">Friends</span>
              </>
            )}
          </button>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!content.trim() && !mediaUrl.trim()}
          className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/20 transition-all"
        >
          <span>Post</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};