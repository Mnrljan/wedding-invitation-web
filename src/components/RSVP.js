// src/components/RSVP.js
import React, { useState, useEffect } from 'react';
import './RSVP.css';

// Import Firebase Firestore functions
import { db } from '../firebase'; // Sesuaikan path jika firebase.js ada di folder lain (misal: ../config/firebase)
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';


const RSVP = () => {
    const [activeTab, setActiveTab] = useState('rsvp');
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
    const [wishes, setWishes] = useState([]); // Akan diisi dari Firebase
    const [submittedRsvp, setSubmittedRsvp] = useState(false);
    const [submittedWish, setSubmittedWish] = useState(false);
    const [loadingWishes, setLoadingWishes] = useState(true); // State untuk loading wishes

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

    // --- useEffect untuk Mengambil Ucapan dari Firebase (Realtime) ---
    useEffect(() => {
        // Buat query untuk koleksi 'greetings', diurutkan berdasarkan tanggal dibuat terbaru
        const q = query(collection(db, 'greetings'), orderBy('timestamp', 'desc'));

        // onSnapshot akan mendengarkan perubahan data secara realtime
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedWishes = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setWishes(fetchedWishes);
            setLoadingWishes(false); // Selesai loading
        }, (error) => {
            console.error("Error fetching wishes: ", error);
            setLoadingWishes(false);
        });

        // Cleanup function: hentikan langganan saat komponen di-unmount
        return () => unsubscribe();
    }, []); // [] agar hanya berjalan sekali saat komponen mount

    // --- Fungsi untuk Mengirim RSVP ke Firebase ---
    const handleRsvpSubmit = async (e) => {
        e.preventDefault();
        try {
            // Mengirim data ke koleksi 'rsvps'
            await addDoc(collection(db, 'rsvps'), {
                name: rsvpForm.name,
                attendance: rsvpForm.attendance,
                guestCount: rsvpForm.guestCount,
                message: rsvpForm.message,
                timestamp: serverTimestamp() // Otomatis menambahkan waktu server
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

    // --- Fungsi untuk Mengirim Ucapan ke Firebase ---
    const handleWishSubmit = async (e) => {
        e.preventDefault();
        if (wishForm.name.trim() && wishForm.message.trim()) {
            try {
                // Mengirim data ke koleksi 'greetings'
                await addDoc(collection(db, 'greetings'), {
                    name: wishForm.name,
                    message: wishForm.message,
                    timestamp: serverTimestamp() // Otomatis menambahkan waktu server
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
        // Jika dateString adalah Firebase Timestamp object, ubah dulu ke Date
        let date;
        if (dateString && dateString.toDate) { // Cek apakah ini objek Timestamp Firebase
            date = dateString.toDate();
        } else {
            date = new Date(dateString);
        }
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('id-ID', options);
    };

    return (
        <section id='rsvp' className="rsvp-section">
            <div className="rsvp-container">
                <div className="rsvp-header">
                    <h2 className="rsvp-title">Konfirmasi Kehadiran</h2>
                    <p className="rsvp-subtitle">Kehadiran Anda sangat berarti bagi kami</p>
                </div>

                {/* Tab Navigation */}
                <div className="rsvp-tabs">
                    <button
                        className={`tab-button ${activeTab === 'rsvp' ? 'active' : ''}`}
                        onClick={() => setActiveTab('rsvp')}
                    >
                        📝 RSVP
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'gift' ? 'active' : ''}`}
                        onClick={() => setActiveTab('gift')}
                    >
                        🎁 Wedding Gift
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'wishes' ? 'active' : ''}`}
                        onClick={() => setActiveTab('wishes')}
                    >
                        💌 Ucapan & Doa
                    </button>
                </div>

                {/* RSVP Form */}
                {activeTab === 'rsvp' && (
                    <div className="tab-content">
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
                )}

                {/* Wedding Gift */}
                {activeTab === 'gift' && (
                    <div className="tab-content">
                        <div className="gift-header">
                            <h3>Wedding Gift</h3>
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
                )}

                {/* Wishes & Messages */}
                {activeTab === 'wishes' && (
                    <div className="tab-content">
                        <div className="wishes-section">
                            <h3>Kirim Ucapan & Doa</h3>

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
                                                    <span className="wish-date">{formatDate(wish.timestamp)}</span> {/* Gunakan timestamp */}
                                                </div>
                                                <p className="wish-message">{wish.message}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default RSVP;