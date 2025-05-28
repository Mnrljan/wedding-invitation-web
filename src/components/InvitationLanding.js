// src/components/InvitationLanding.js
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './InvitationLanding.css';

import bunga1 from '../images/bunga1.png';
import bunga2 from '../images/bunga2.png';
import bunga3 from '../images/bunga3.svg';
import landingImage from '../images/4.jpeg';

function InvitationLanding({ audioRef }) {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [guestName, setGuestName] = useState('Tamu Undangan');

    useEffect(() => {
        const nameFromUrl = searchParams.get('to');
        if (nameFromUrl) {
            setGuestName(decodeURIComponent(nameFromUrl));
        }
    }, [searchParams]);

    const handleOpenInvitation = () => {
        // Play audio setelah klik tombol
        if (audioRef?.current) {
            audioRef.current.play().catch(err => console.log("Audio play failed", err));
        }

        navigate('/main');
    };

    return (
        <div className="invitation-landing-container">
            <img src={bunga1} alt="Dekorasi Bunga 1" className="decor-bunga1" />
            <img src={bunga2} alt="Dekorasi Bunga 2" className="decor-bunga2" />
            <img src={bunga3} alt="Dekorasi Bunga 3" className="decor-bunga3" />

            <div className="invitation-card">
                <div className="card-left">
                    <p className="greeting-text">Yth. Bapak/Ibu/Rekan</p>
                    <h2 className="guest-name-display">{guestName}</h2>
                    <h1 className="main-title">The Wedding Of</h1>
                    <h1 className="couple-names" style={{ fontFamily: 'Great Vibes, cursive' }}>
                        Ipan & Risma
                    </h1>
                    <p className="quote-text">"Together through the good times and the bad"</p>
                </div>

                <div className="card-right">
                    <div className="couple-image-frame">
                        <img src={landingImage} alt="Foto Pasangan" className="couple-image" />
                    </div>
                    <p className="love-you-text">I Love You</p>
                </div>

                <div className="button-container">
                    <button className="open-invitation-button" onClick={handleOpenInvitation}>
                        Open Invitation
                    </button>
                </div>
            </div>
        </div>
    );
}

export default InvitationLanding;
