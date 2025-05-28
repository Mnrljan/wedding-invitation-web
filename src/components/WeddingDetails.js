// src/components/WeddingDetails.js
import React, { useState, useEffect } from 'react';
import './WeddingDetails.css';

const WeddingDetails = () => {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    // Set tanggal wedding - ganti sesuai kebutuhan
    const weddingDate = new Date('2025-06-15T08:00:00');

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = weddingDate.getTime() - now;

            if (distance > 0) {
                setTimeLeft({
                    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((distance % (1000 * 60)) / 1000)
                });
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [weddingDate]);

    const handleSaveDate = () => {
        // Buat event calendar
        const event = {
            title: 'Wedding Ceremony',
            start: weddingDate,
            end: new Date(weddingDate.getTime() + (4 * 60 * 60 * 1000)), // 4 jam
            description: 'Wedding Ceremony - Akad Nikah'
        };

        // Format untuk Google Calendar
        const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${weddingDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${new Date(weddingDate.getTime() + (4 * 60 * 60 * 1000)).toISOString().replace(/[-:]/g, '').split('.')[0]}Z&details=${encodeURIComponent(event.description)}`;

        window.open(googleCalendarUrl, '_blank');
    };

    const handleOpenMaps = () => {
        // Ganti dengan koordinat atau alamat venue sebenarnya
        const address = "Kediaman Mempelai Wanita, Kp.Ciparay Wetan RT 03 RW 010 Ds. Cisarua, Kec. Nanggung, Kab. Bogor 16650";
        const mapsUrl = `https://www.google.com/maps/place/6%C2%B035'30.5%22S+106%C2%B032'44.6%22E/@-6.591815,106.5431557,17z/data=!3m1!4b1!4m4!3m3!8m2!3d-6.591815!4d106.5457306?hl=id&entry=ttu&g_ep=EgoyMDI1MDUyMS4wIKXMDSoASAFQAw%3D%3D`;
        window.open(mapsUrl, '_blank');
    };

    return (
        <section id='details' className="wedding-details">
            {/* Hero Image Section */}
            <div className="wedding-hero">
                <div className="hero-overlay">
                    <div className="hero-content">
                        <h1 className="couple-names">Akad Nikah</h1>
                        <div className="wedding-date-main">
                            <div className="date-block">
                                <span className="day-name">Sabtu</span>
                                <span className="month-year">Juni 2025</span>
                                <div className="date-number">15</div>
                                <span className="time-range">08:00 WIB - SELESAI</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Countdown Timer */}
            <div className="countdown-section">
                <h2 className="countdown-title">Menuju Hari Bahagia</h2>
                <div className="countdown-timer">
                    <div className="time-unit">
                        <span className="time-number">{timeLeft.days}</span>
                        <span className="time-label">Hari</span>
                    </div>
                    <div className="time-unit">
                        <span className="time-number">{timeLeft.hours}</span>
                        <span className="time-label">Jam</span>
                    </div>
                    <div className="time-unit">
                        <span className="time-number">{timeLeft.minutes}</span>
                        <span className="time-label">Menit</span>
                    </div>
                    <div className="time-unit">
                        <span className="time-number">{timeLeft.seconds}</span>
                        <span className="time-label">Detik</span>
                    </div>
                </div>
            </div>

            {/* Event Details */}
            <div className="event-details">
                <div className="event-card">
                    <div className="event-icon">💒</div>
                    <h3 className="event-title">Akad Nikah</h3>
                    <div className="event-info">
                        <p className="event-time">🕗 08:00 WIB - Selesai</p>
                        <p className="event-date">📅 Sabtu, 15 Juni 2025</p>
                    </div>
                </div>

                <div className="location-card">
                    <h3 className="location-title">Lokasi Acara</h3>
                    <div className="location-info">
                        <p className="venue-name">Kediaman Mempelai Wanita</p>
                        <p className="venue-address">
                            kp.bongas rt03/05 desa kalongliud,<br />
                            Kec. Nanggung, Kab. Bogor 16650
                        </p>
                    </div>
                    <button className="maps-button" onClick={handleOpenMaps}>
                        📍 Buka di Maps
                    </button>
                </div>
            </div>
        </section>
    );
};

export default WeddingDetails;