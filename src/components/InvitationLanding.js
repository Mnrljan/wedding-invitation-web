// src/components/InvitationLanding.js
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './InvitationLanding.css'; // Import CSS untuk styling

// Import aset gambar dekoratif dan gambar couple
import bunga1 from '../images/bunga1.png';
import bunga2 from '../images/bunga2.png';
import bunga3 from '../images/bunga3.svg';
import landingImage from '../images/4.jpeg'; // Gambar couple sementara

function InvitationLanding() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [guestName, setGuestName] = useState('Tamu Undangan'); // Nama default jika tidak ada parameter

    // --- State untuk Countdown Timer ---
    const weddingDate = new Date('2025-06-15T00:00:00'); // Ganti dengan tanggal dan waktu pernikahan kalian
    const [timeLeft, setTimeLeft] = useState(getTimeDifference(weddingDate));

    useEffect(() => {
        const nameFromUrl = searchParams.get('to');
        if (nameFromUrl) {
            setGuestName(decodeURIComponent(nameFromUrl));
        }

        // --- Efek untuk Countdown Timer ---
        const timer = setInterval(() => {
            setTimeLeft(getTimeDifference(weddingDate));
        }, 1000);

        return () => clearInterval(timer); // Cleanup timer saat komponen di-unmount
    }, [searchParams, weddingDate]);

    // Fungsi untuk menghitung sisa waktu
    function getTimeDifference(targetDate) {
        const total = Date.parse(targetDate) - Date.parse(new Date());
        const seconds = Math.floor((total / 1000) % 60);
        const minutes = Math.floor((total / 1000 / 60) % 60);
        const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
        const days = Math.floor(total / (1000 * 60 * 60 * 24));

        return {
            total,
            days,
            hours,
            minutes,
            seconds,
        };
    }
    // --- End Countdown Timer Logic ---

    const handleOpenInvitation = () => {
        navigate('/main'); // Navigasi ke halaman utama undangan
    };

    return (
        <div className="invitation-landing-container">
            {/* Elemen dekoratif bunga, diposisikan absolut melalui CSS */}
            <img src={bunga1} alt="Dekorasi Bunga 1" className="decor-bunga1" />
            <img src={bunga2} alt="Dekorasi Bunga 2" className="decor-bunga2" />
            <img src={bunga3} alt="Dekorasi Bunga 3" className="decor-bunga3" />

            <div className="invitation-card">
                {/* Konten Sisi Kiri (Akan menjadi atas di mobile) */}
                <div className="card-left">
                    <p className="greeting-text">Yth. Bapak/Ibu/Rekan</p>
                    <h2 className="guest-name-display">{guestName}</h2>
                    <h1 className="main-title">The Wedding Of</h1>
                    <h1 className="couple-names" style={{ fontFamily: 'Great Vibes, cursive' }}>
                        Ipan & Risma {/* Ganti dengan nama kalian */}
                    </h1>
                    <p className="quote-text">"Together through the good times and the bad"</p>

                    {/* Lokasi Countdown Timer */}
                    

                    {/* Perhatikan: Tombol "Open Invitation" akan dipindahkan ke bawah via CSS order di mobile */}
                </div>

                {/* Konten Sisi Kanan (Akan menjadi bawah di mobile) */}
                <div className="card-right">
                    <div className="couple-image-frame">
                        <img src={landingImage} alt="Foto Pasangan" className="couple-image" />
                    </div>
                    <p className="love-you-text">I Love You</p>
                </div>

                {/* Tombol "Open Invitation" di luar card-left/right agar mudah diatur di mobile */}
                <div className="button-container">
                    {/* Pindahkan garis di dekat tombol */}
                    <button className="open-invitation-button" onClick={handleOpenInvitation}>
                        Open Invitation
                    </button>
                </div>
            </div>
        </div>
    );
}

export default InvitationLanding;