// src/App.js
import React, { useRef, useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; // <<< Tambahkan Navigate
import InvitationLanding from './components/InvitationLanding';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import CoupleInfo from './components/CoupleInfo';
import WeddingDetails from './components/WeddingDetails';
import Gallery from './components/Gallery';
import RSVP from './components/RSVP';
import Footer from './components/Footer';
import './App.css';

// --- Import komponen Admin ---
import LoginPage from './components/admin/LoginPage'; // Pastikan path ini benar
import AdminPage from './components/admin/AdminPage'; // Pastikan path ini benar
// ---

// --- Import Firebase Auth untuk PrivateRoute ---
import { auth } from './firebase'; // Pastikan auth diekspor dari firebase.js
import { onAuthStateChanged } from 'firebase/auth'; // Pastikan onAuthStateChanged diimpor
// ---

import weddingSong from './assets/audio/badai.mp3';

// --- Komponen PrivateRoute untuk melindungi rute admin ---
function PrivateRoute({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  if (loading) {
    // Tampilkan loading screen sederhana saat memeriksa status autentikasi
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '24px' }}>Loading...</div>;
  }

  // Jika user tidak ada (belum login), redirect ke halaman login
  return user ? children : <Navigate to="/admin/login" />;
}
// --- Akhir Komponen PrivateRoute ---


function MainInvitationContent({ audioRef, isMuted, setIsMuted }) {
  return (
    <div className="main-content-wrapper">
      <Header />
      <HeroSection />
      <CoupleInfo />
      <WeddingDetails />
      <Gallery />
      <RSVP />
      <Footer />

      {/* Tombol Mute/Unmute */}
      <button className="audio-control-button" onClick={() => {
        if (audioRef.current) {
          audioRef.current.muted = !audioRef.current.muted;
          setIsMuted(audioRef.current.muted);
        }
      }}>
        {isMuted ? '🔇' : '🔊'}
      </button>
    </div>
  );
}

function App() {
  const audioRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.load();
    }
  }, []);

  return (
    <>
      {/* Audio Player (diposisikan di App, tidak di MainContentWrapper) */}
      {/* Ini adalah elemen audio yang sebenarnya yang dikontrol oleh audioRef */}
      <audio ref={audioRef} loop preload="auto" style={{ display: 'none' }}>
        <source src={weddingSong} type="audio/mp3" />
        Browser Anda tidak mendukung audio.
      </audio>

      <Routes>
        <Route path="/" element={<InvitationLanding audioRef={audioRef} />} />
        <Route path="/main" element={<MainInvitationContent audioRef={audioRef} isMuted={isMuted} setIsMuted={setIsMuted} />} />

        {/* --- Rute untuk Halaman Admin --- */}
        <Route path="/admin/login" element={<LoginPage />} />
        {/* Rute Admin dilindungi oleh PrivateRoute */}
        <Route path="/admin" element={
          <PrivateRoute>
            <AdminPage />
          </PrivateRoute>
        } />
      </Routes>
    </>
  );
}

export default App;