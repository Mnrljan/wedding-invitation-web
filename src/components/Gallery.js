// src/components/Gallery.js
import React, { useState } from 'react';
import './Gallery.css';

const Gallery = () => {
    const [selectedImage, setSelectedImage] = useState(null);

    // Array gambar - sesuaikan dengan nama file Anda (1.jpeg sampai 7.jpeg)
    const images = [
        {
            id: 2,
            src: require('../images/2.jpeg'),
            alt: 'Wedding Photo 2'
        },
        {
            id: 3,
            src: require('../images/3.jpeg'),
            alt: 'Wedding Photo 3'
        },
        {
            id: 4,
            src: require('../images/4.jpeg'),
            alt: 'Wedding Photo 4'
        },
        {
            id: 5,
            src: require('../images/5.jpeg'),
            alt: 'Wedding Photo 5'
        },
        {
            id: 6,
            src: require('../images/6.jpeg'),
            alt: 'Wedding Photo 6'
        },
        {
            id: 7,
            src: require('../images/7.jpeg'),
            alt: 'Wedding Photo 7'
        }
    ];

    const openModal = (image) => {
        setSelectedImage(image);
        document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    };

    const closeModal = () => {
        setSelectedImage(null);
        document.body.style.overflow = 'unset'; // Restore scrolling
    };

    const navigateImage = (direction) => {
        const currentIndex = images.findIndex(img => img.id === selectedImage.id);
        let newIndex;

        if (direction === 'next') {
            newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
        } else {
            newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
        }

        setSelectedImage(images[newIndex]);
    };

    return (
        <section id='gallery' className="gallery-section">
            <div className="gallery-container">
                <div className="gallery-header">
                    <h2 className="gallery-title">Gallery Moments</h2>
                    <p className="gallery-subtitle">Momen-momen indah perjalanan cinta kami</p>
                </div>

                <div className="gallery-grid">
                    {images.map((image) => (
                        <div
                            key={image.id}
                            className="gallery-item"
                            onClick={() => openModal(image)}
                        >
                            <img
                                src={image.src}
                                alt={image.alt}
                                className="gallery-image"
                                loading="lazy"
                            />
                            <div className="gallery-overlay">
                                <div className="gallery-icon">🔍</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal untuk tampilan full screen */}
            {selectedImage && (
                <div className="gallery-modal" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={closeModal}>
                            ✕
                        </button>

                        <button
                            className="modal-nav modal-prev"
                            onClick={() => navigateImage('prev')}
                        >
                            ‹
                        </button>

                        <img
                            src={selectedImage.src}
                            alt={selectedImage.alt}
                            className="modal-image"
                        />

                        <button
                            className="modal-nav modal-next"
                            onClick={() => navigateImage('next')}
                        >
                            ›
                        </button>

                        <div className="modal-info">
                            <span className="modal-counter">
                                {images.findIndex(img => img.id === selectedImage.id) + 1} / {images.length}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Gallery;