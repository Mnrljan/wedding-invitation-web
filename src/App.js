// src/App.js
import React, { useRef, useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import InvitationLanding from './components/InvitationLanding';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import CoupleInfo from './components/CoupleInfo';
import WeddingDetails from './components/WeddingDetails';
import Gallery from './components/Gallery';
import RSVP from './components/RSVP';
import Footer from './components/Footer';
import './App.css';

import weddingSong from './assets/audio/badai.mp3';

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
      {/* Audio Player */}
      <audio ref={audioRef} loop preload="auto" style={{ display: 'none' }}>
        <source src={weddingSong} type="audio/mp3" />
        Browser Anda tidak mendukung audio.
      </audio>

      <Routes>
        <Route path="/" element={<InvitationLanding audioRef={audioRef} />} />
        <Route path="/main" element={<MainInvitationContent audioRef={audioRef} isMuted={isMuted} setIsMuted={setIsMuted} />} />
      </Routes>
    </>
  );
}

export default App;
