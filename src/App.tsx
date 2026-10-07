
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { MainLayout } from './components/layout/MainLayout';
import { VideoCallPage } from './pages/VideoCallPage';
import { VoiceCallPage } from './pages/VoiceCallPage';
import { ChatPage } from './pages/ChatPage';
import { Feed } from './components/feed/Feed';
import { MyPostsPage } from './pages/MyPostsPage';
import { FriendsPage} from "./pages/FriendsPage";
import { SignUpPage } from './pages/SignUpPage';
import {SignInPage} from "./pages/SignInPage";




export default function App() {
  return (
    <Router>
      <Toaster position="top-right" richColors />
      <Routes>
        {/* Public Routes (Full Screen, No Sidebar/Header) */}
        <Route path="/" element={<Navigate to="/app/dashboard" replace />} />
        <Route path="/Signin" element={<SignInPage />} />
        <Route path="/register" element={<SignUpPage />} />

        {/* Protected Application Routes (Wrapped in MainLayout) */}
        <Route path="/app" element={<MainLayout />}>
          <Route path="dashboard" element={<Feed />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="videocall" element={<VideoCallPage />} />
          <Route path="voicecall" element={<VoiceCallPage />} />
          <Route path="friends" element={<FriendsPage />} />
          <Route path="profile" element={<FriendsPage />} />
          <Route path="mypost" element={<MyPostsPage />}  />
        </Route>

        {/* Fallback redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}