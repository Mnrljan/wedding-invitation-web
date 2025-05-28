// src/components/CoupleInfo.js
import React, { useState, useEffect } from 'react';
import './CoupleInfo.css';

// Impor gambar untuk masing-masing mempelai
import groomImage from '../images/4.jpeg'; // Ganti dengan gambar mempelai pria
import brideImage from '../images/5.jpeg'; // Ganti dengan gambar mempelai wanita

function CoupleInfo() {
    const [currentStory, setCurrentStory] = useState(0);
    const [isStoryVisible, setIsStoryVisible] = useState(false);

    const stories = [
        {
            title: "Awal Bertemu",
            date: "20 Mei 2020",
            icon: "💕",
            content: "Kami saling mengenal satu sama lain melalui media sosial! Kami bertemu dan mengenal satu sama lain, tak lama kemudian percakapan kami mengalir dengan mudah, belum ada benih cinta kala itu, hanya sebatas teman. 18 Juni 2020 kami memutuskan untuk menjaga komitmen."
        },
        {
            title: "Lamaran",
            date: "17 Mei 2025",
            icon: "💍",
            content: "Kehendak-Nya menuntun kami kepada sebuah pertemuan keluarga yang tak pernah disangka, hingga akhirnya membawa hubungan kami pada sebuah ikatan Sabtu, 17 Mei 2025. Dan dia bertanya kepadaku \"will you marry me?\" dan aku berkata \"yes\"."
        },
        {
            title: "Menikah",
            date: "15 Juni 2025",
            icon: "👰🤵",
            content: "Bukan karena bertemu lalu berjodoh, tapi karena berjodoh lah kami dipertemukan. Kami akan memulai kebahagiaan ini untuk membangun keluarga kecil kami. Semoga Allah SWT selalu memberikan keberkahan untuk pernikahan ini, amin."
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentStory((prev) => (prev + 1) % stories.length);
        }, 5000); // Change story every 5 seconds

        return () => clearInterval(timer);
    }, [stories.length]);

    useEffect(() => {
        // Trigger animation when story changes
        setIsStoryVisible(false);
        const timer = setTimeout(() => setIsStoryVisible(true), 100);
        return () => clearTimeout(timer);
    }, [currentStory]);

    const handleStoryClick = (index) => {
        setCurrentStory(index);
    };

    return (
        <section id="couple" className="couple-info-section">
            <div className="section-header">
                <h2 className="section-title" style={{ fontFamily: 'Playfair Display, serif' }}>
                    Our Story
                </h2>
                <p className="section-subtitle">A journey of two hearts</p>
            </div>

            <div className="couple-section-wrapper">
                {/* Bagian Mempelai Pria (The Groom) */}
                <div className="couple-block groom-block">
                    <div className="image-container">
                        <img src={groomImage} alt="Mempelai Pria" className="couple-portrait-img" />
                        <div className="overlay-info">
                            <h3 className="couple-full-name">Ipan Nahrowi</h3>
                            <p className="parents-info">
                                Putra dari <br />
                                Bapak Mamat & Ibu Yuyum
                            </p>
                        </div>
                    </div>
                </div>

                {/* Heart Connector */}
                <div className="heart-connector">
                    <div className="heart-icon">💕</div>
                    <div className="connecting-line"></div>
                </div>

                {/* Bagian Mempelai Wanita (The Bride) */}
                <div className="couple-block bride-block">
                    <div className="image-container">
                        <img src={brideImage} alt="Mempelai Wanita" className="couple-portrait-img" />
                        <div className="overlay-info">
                            <h3 className="couple-full-name">Risma Febri Yanti</h3>
                            <p className="parents-info">
                                Putri dari <br />
                                Bapak Sutono & Ibu Euis
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Love Story Section */}
            <div className="love-story-section">
                <div className="story-header">
                    <h3 className="story-main-title">Kisah Cinta Kami</h3>
                    <p className="story-subtitle">Perjalanan menuju hari bahagia</p>
                </div>

                {/* Story Navigation */}
                <div className="story-navigation">
                    {stories.map((story, index) => (
                        <button
                            key={index}
                            className={`story-nav-btn ${currentStory === index ? 'active' : ''}`}
                            onClick={() => handleStoryClick(index)}
                        >
                            <span className="story-nav-icon">{story.icon}</span>
                            <span className="story-nav-title">{story.title}</span>
                        </button>
                    ))}
                </div>

                {/* Story Content */}
                <div className="story-content-wrapper">
                    <div className={`story-content ${isStoryVisible ? 'visible' : ''}`}>
                        <div className="story-icon-large">
                            {stories[currentStory].icon}
                        </div>
                        <h4 className="story-title">
                            {stories[currentStory].title}
                        </h4>
                        <p className="story-date">
                            {stories[currentStory].date}
                        </p>
                        <p className="story-text">
                            {stories[currentStory].content}
                        </p>
                    </div>
                </div>

                {/* Story Progress Indicators */}
                <div className="story-indicators">
                    {stories.map((_, index) => (
                        <div
                            key={index}
                            className={`indicator ${currentStory === index ? 'active' : ''}`}
                            onClick={() => handleStoryClick(index)}
                        ></div>
                    ))}
                </div>
            </div>

            {/* Decorative Elements */}
            <div className="floating-hearts">
                <div className="floating-heart heart-1">💖</div>
                <div className="floating-heart heart-2">💕</div>
                <div className="floating-heart heart-3">💗</div>
                <div className="floating-heart heart-4">💓</div>
            </div>
        </section>
    );
}

export default CoupleInfo;