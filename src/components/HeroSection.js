// src/components/HeroSection.js
import React from 'react';
import './HeroSection.css'; // Akan kita buat nanti
import heroImage from '../images/2.jpeg'; // Gunakan gambar ini sebagai contoh hero utama

function HeroSection() {
    return (
        <section id='home' className="hero-section">
            <div className="hero-overlay"></div> {/* Untuk efek overlay di atas gambar */}
            <img src={heroImage} alt="Mempelai Pengantin" className="hero-background-image" />

            <div className="hero-content">
                <p className="hero-subtitle">The Happy Day</p>
                <h1 className="hero-names" style={{ fontFamily: 'Great Vibes, cursive' }}>
                    Ipan & Risma
                </h1>
                <p className="hero-date">15 Juni 2025</p>
                <a href="#details" className="hero-cta-button">
                    See Wedding Details
                </a>
            </div>
        </section>
    );
}

export default HeroSection;