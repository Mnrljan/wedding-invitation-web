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

function MainInvitationContent() {
  const audioRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play().catch(error => {
        console.log("Autoplay was prevented. User interaction needed.", error);
      });
      audioRef.current.volume = 0.5;
    }
  }, []);

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setIsMuted(audioRef.current.muted);
    }
  };

  return (
    <div className="main-content-wrapper">
      <Header />
      <HeroSection />
      <CoupleInfo />
      <WeddingDetails />
      <Gallery />
      <RSVP />
      <Footer />

      {/* Elemen Audio */}
      <audio ref={audioRef} loop>
        <source src={weddingSong} type="audio/mp3" />
        Browser Anda tidak mendukung elemen audio.
      </audio>

      {/* Tombol Mute/Unmute */}
      <button className="audio-control-button" onClick={toggleMute}>
        {isMuted ? '🔇' : '🔊'}
      </button>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<InvitationLanding />} />
      <Route path="/main" element={<MainInvitationContent />} />
    </Routes>
  );
}

export default App;