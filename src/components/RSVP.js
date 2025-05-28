// src/components/RSVP.js
import React, { useState, useEffect } from 'react';
import './RSVP.css';
import useInView from '../hooks/useInView'; // Import useInView hook

// Import Firebase Firestore functions
import { db } from '../firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';


const RSVP = () => {
    // Hapus state dan fungsi terkait tab
    // const [activeTab, setActiveTab] = useState('rsvp');

    const [rsvpForm, setRsvpForm] = useState({
        name: '',
        attendance: '',
        guestCount: 1,
        message: ''
    });
    const [wishForm, setWishForm] = useState({
        name: '',
        message: ''
    });
    const [wishes, setWishes] = useState([]);
    const [submittedRsvp, setSubmittedRsvp] = useState(false);
    const [submittedWish, setSubmittedWish] = useState(false);
    const [loadingWishes, setLoadingWishes] = useState(true);

    // Untuk reveal on scroll
    const [ref, isInView] = useInView({ threshold: 0.1 });


    // Wedding Gift Account Information (tetap sama)
    const giftAccounts = [
        {
            id: 1,
            type: 'dana',
            name: 'DANA',
            accountName: 'Ipan Nahrowi',
            accountNumber: '085718700571',
            logo: '💳',
            color: '#00A8D6'
        },
        {
            id: 2,
            type: 'bri',
            name: 'Bank BRI',
            accountName: 'Ipan Nahrowi',
            accountNumber: '1149-0101-2993-507',
            logo: '🏦',
            color: '#004B87'
        }
    ];

    useEffect(() => {
        const q = query(collection(db, 'greetings'), orderBy('timestamp', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedWishes = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setWishes(fetchedWishes);
            setLoadingWishes(false);
        }, (error) => {
            console.error("Error fetching wishes: ", error);
            setLoadingWishes(false);
        });
        return () => unsubscribe();
    }, []);

    const handleRsvpSubmit = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'rsvps'), {
                name: rsvpForm.name,
                attendance: rsvpForm.attendance,
                guestCount: rsvpForm.guestCount,
                message: rsvpForm.message,
                timestamp: serverTimestamp()
            });
            console.log('RSVP data sent to Firebase!');
            setSubmittedRsvp(true);
            setTimeout(() => {
                setSubmittedRsvp(false);
                setRsvpForm({
                    name: '',
                    attendance: '',
                    guestCount: 1,
                    message: ''
                });
            }, 3000);
        } catch (error) {
            console.error("Error sending RSVP data: ", error);
            alert("Terjadi kesalahan saat mengirim konfirmasi. Silakan coba lagi.");
        }
    };

    const handleWishSubmit = async (e) => {
        e.preventDefault();
        if (wishForm.name.trim() && wishForm.message.trim()) {
            try {
                await addDoc(collection(db, 'greetings'), {
                    name: wishForm.name,
                    message: wishForm.message,
                    timestamp: serverTimestamp()
                });
                console.log('Wish sent to Firebase!');
                setSubmittedWish(true);
                setTimeout(() => {
                    setSubmittedWish(false);
                    setWishForm({ name: '', message: '' });
                }, 2000);
            } catch (error) {
                console.error("Error sending wish: ", error);
                alert("Terjadi kesalahan saat mengirim ucapan. Silakan coba lagi.");
            }
        }
    };

    const copyToClipboard = (text, type) => {
        navigator.clipboard.writeText(text).then(() => {
            const button = document.querySelector(`[data-copy="${type}"]`);
            const originalText = button.textContent;
            button.textContent = 'Tersalin! ✓';
            button.style.backgroundColor = '#22c55e';
            setTimeout(() => {
                button.textContent = originalText;
                button.style.backgroundColor = '';
            }, 2000);
        });
    };

    const formatDate = (dateString) => {
        let date;
        if (dateString && dateString.toDate) {
            date = dateString.toDate();
        } else {
            date = new Date(dateString);
        }
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('id-ID', options);
    };

    return (
        <section id='rsvp' className={`rsvp-section ${isInView ? 'is-visible' : ''}`} ref={ref}> {/* Terapkan useInView */}
            <div className="rsvp-container">
                <div className="rsvp-header">
                    <h2 className="rsvp-title">Konfirmasi Kehadiran</h2>
                    <p className="rsvp-subtitle">Kehadiran Anda sangat berarti bagi kami</p>
                </div>

                {/* Hapus Tab Navigation */}
                {/* <div className="rsvp-tabs"> ... </div> */}

                {/* RSVP Form Section */}
                <div className="rsvp-form-section section-content-card"> {/* Tambahkan kelas untuk styling card */}
                    <h3 className="section-content-title">RSVP Form</h3> {/* Judul untuk bagian ini */}
                    {submittedRsvp ? (
                        <div className="success-message">
                            <div className="success-icon">✓</div>
                            <h3>Terima kasih!</h3>
                            <p>Konfirmasi kehadiran Anda telah diterima.</p>
                        </div>
                    ) : (
                        <form className="rsvp-form" onSubmit={handleRsvpSubmit}>
                            <div className="form-group">
                                <label htmlFor="name">Nama Lengkap</label>
                                <input
                                    type="text"
                                    id="name"
                                    value={rsvpForm.name}
                                    onChange={(e) => setRsvpForm({ ...rsvpForm, name: e.target.value })}
                                    required
                                    placeholder="Masukkan nama Anda"
                                />
                            </div>

                            <div className="form-group">
                                <label>Konfirmasi Kehadiran</label>
                                <div className="radio-group">
                                    <label className="radio-option">
                                        <input
                                            type="radio"
                                            name="attendance"
                                            value="hadir"
                                            onChange={(e) => setRsvpForm({ ...rsvpForm, attendance: e.target.value })}
                                            required
                                        />
                                        <span className="radio-custom"></span>
                                        Ya, saya akan hadir
                                    </label>
                                    <label className="radio-option">
                                        <input
                                            type="radio"
                                            name="attendance"
                                            value="tidak-hadir"
                                            onChange={(e) => setRsvpForm({ ...rsvpForm, attendance: e.target.value })}
                                            required
                                        />
                                        <span className="radio-custom"></span>
                                        Maaf, saya tidak bisa hadir
                                    </label>
                                </div>
                            </div>

                            {rsvpForm.attendance === 'hadir' && (
                                <div className="form-group">
                                    <label htmlFor="guestCount">Jumlah Tamu</label>
                                    <select
                                        id="guestCount"
                                        value={rsvpForm.guestCount}
                                        onChange={(e) => setRsvpForm({ ...rsvpForm, guestCount: parseInt(e.target.value) })}
                                    >
                                        <option value={1}>1 orang</option>
                                        <option value={2}>2 orang</option>
                                        <option value={3}>3 orang</option>
                                        <option value={4}>4 orang</option>
                                        <option value={5}>5+ orang</option>
                                    </select>
                                </div>
                            )}

                            <div className="form-group">
                                <label htmlFor="message">Pesan (Opsional)</label>
                                <textarea
                                    id="message"
                                    value={rsvpForm.message}
                                    onChange={(e) => setRsvpForm({ ...rsvpForm, message: e.target.value })}
                                    placeholder="Tuliskan pesan atau catatan khusus..."
                                    rows="3"
                                ></textarea>
                            </div>

                            <button type="submit" className="submit-button">
                                Kirim Konfirmasi
                            </button>
                        </form>
                    )}
                </div>

                {/* Wedding Gift Section */}
                <div className="wedding-gift-section section-content-card"> {/* Tambahkan kelas untuk styling card */}
                    <h3 className="section-content-title">Wedding Gift</h3> {/* Judul untuk bagian ini */}
                    <div className="gift-header">
                        <p>Doa restu Anda merupakan karunia yang sangat berarti bagi kami. Dan jika memberi adalah ungkapan tanda kasih Anda, Anda dapat memberikan kado secara cashless.</p>
                    </div>

                    <div className="gift-accounts">
                        {giftAccounts.map((account) => (
                            <div key={account.id} className="gift-card">
                                <div className="gift-header-info">
                                    <div className="gift-logo" style={{ color: account.color }}>
                                        {account.logo}
                                    </div>
                                    <div className="gift-details">
                                        <h4 className="gift-bank-name">{account.name}</h4>
                                        <p className="gift-account-name">{account.accountName}</p>
                                    </div>
                                </div>

                                <div className="gift-account-number">
                                    <span className="account-number">{account.accountNumber}</span>
                                </div>

                                <button
                                    className="copy-button"
                                    data-copy={account.type}
                                    onClick={() => copyToClipboard(account.accountNumber, account.type)}
                                >
                                    📋 Salin Nomor
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Wishes & Messages Section */}
                <div className="wishes-messages-section section-content-card"> {/* Tambahkan kelas untuk styling card */}
                    <h3 className="section-content-title">Kirim Ucapan & Doa</h3> {/* Judul untuk bagian ini */}
                    <div className="wishes-section">
                        {submittedWish ? (
                            <div className="success-message">
                                <div className="success-icon">✓</div>
                                <h4>Ucapan Terkirim!</h4>
                                <p>Terima kasih atas doa dan ucapannya.</p>
                            </div>
                        ) : (
                            <form className="wish-form" onSubmit={handleWishSubmit}>
                                <div className="form-group">
                                    <input
                                        type="text"
                                        value={wishForm.name}
                                        onChange={(e) => setWishForm({ ...wishForm, name: e.target.value })}
                                        placeholder="Nama Anda"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <textarea
                                        value={wishForm.message}
                                        onChange={(e) => setWishForm({ ...wishForm, message: e.target.value })}
                                        placeholder="Tuliskan ucapan dan doa terbaik untuk kami..."
                                        rows="4"
                                        required
                                    ></textarea>
                                </div>
                                <button type="submit" className="submit-button">
                                    Kirim Ucapan
                                </button>
                            </form>
                        )}

                        <div className="wishes-display">
                            <h4>Ucapan & Doa dari Tamu</h4>
                            {loadingWishes ? (
                                <p className="loading-text">Memuat ucapan...</p>
                            ) : wishes.length === 0 ? (
                                <p className="no-wishes-text">Belum ada ucapan.</p>
                            ) : (
                                <div className="wishes-list">
                                    {wishes.map((wish) => (
                                        <div key={wish.id} className="wish-card">
                                            <div className="wish-header">
                                                <h5 className="wish-name">{wish.name}</h5>
                                                <span className="wish-date">{formatDate(wish.timestamp)}</span>
                                            </div>
                                            <p className="wish-message">{wish.message}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default RSVP;