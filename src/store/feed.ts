// src/types/feed.ts
export interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: string;
}

export interface Post {
  id: string;
  author: string;
  content: string;
  likes: number;
  comments: Comment[]; // Array of comment objects
  // ... other fields
}