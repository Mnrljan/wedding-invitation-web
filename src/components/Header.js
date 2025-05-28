// src/components/Header.js
import React, { useState } from 'react';
import './Header.css'; // Akan kita buat nanti

function Header() {
    const [isOpen, setIsOpen] = useState(false); // State untuk mengontrol menu mobile

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <header className="main-header">
            <div className="header-content">
                <a href="#top" className="site-logo">
                    Ipan & Risma
                </a> {/* Logo atau nama singkat di Header */}

                {/* Tombol Hamburger Menu untuk Mobile */}
                <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle navigation">
                    ☰
                </button>

                {/* Navigasi Utama */}
                <nav className={`main-nav ${isOpen ? 'is-open' : ''}`}>
                    <ul>
                        <li><a href="#home" onClick={toggleMenu}>Home</a></li>
                        <li><a href="#couple" onClick={toggleMenu}>Our Story</a></li>
                        <li><a href="#details" onClick={toggleMenu}>Details</a></li>
                        <li><a href="#gallery" onClick={toggleMenu}>Gallery</a></li>
                        <li><a href="#rsvp" onClick={toggleMenu}>RSVP</a></li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}

export default Header;