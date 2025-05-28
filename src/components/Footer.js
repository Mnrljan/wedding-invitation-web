// src/components/Footer.js
import React from 'react';
import './Footer.css';
import useInView from '../hooks/useInView'; // Import useInView hook
import footerImage from '../images/2.jpeg'; // Gambar referensi footer

function Footer() {
    const [ref, isInView] = useInView({ threshold: 0.1 }); // Sesuaikan threshold

    return (
        <footer
            id="footer"
            className={`main-footer ${isInView ? 'is-visible' : ''}`} // Tambahkan kelas is-visible
            ref={ref} // Pasang ref ke elemen footer
        >
            <div className="footer-image-background">
                <img src={footerImage} alt="Mempelai di Footer" className="footer-bg-img" />
                <div className="footer-image-overlay"></div> {/* Overlay gradasi di atas gambar */}
            </div>

            <div className="footer-content-wrapper">
                <p className="footer-greeting-text">
                    Merupakan suatu kehormatan dan kebahagiaan bagi kami,<br />
                    apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu.
                </p>
                <p className="footer-salam">Wassalamualaikum Wr. Wb.</p>

                <h2 className="footer-thanks-title" style={{ fontFamily: 'Playfair Display, serif' }}>
                    Terima Kasih
                </h2>
                <p className="footer-names" style={{ fontFamily: 'Great Vibes, cursive' }}>
                    Ipan & Risma {/* Ganti dengan nama kalian */}
                </p>
            </div>

            <div className="footer-bottom-bar">
                <p className="footer-design-by">
                    Design By : Manaruljan {/* Ganti dengan nama Anda */}
                </p>
                <a
                    href="https://manaruljan-portofolio.netlify.app/" // Ganti dengan URL website Anda yang sebenarnya
                    target="_blank" // Membuka link di tab baru
                    rel="noopener noreferrer" // Penting untuk keamanan
                    className="footer-website-link"
                >
                    www.manaruljan.com
                </a>
            </div>
        </footer>
    );
}

export default Footer;