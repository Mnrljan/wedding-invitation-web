// src/components/admin/AdminPage.js
import React, { useState, useEffect, useRef } from 'react';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { collection, addDoc, query, orderBy, onSnapshot, deleteDoc, doc, writeBatch, getDocs } from 'firebase/firestore'; // <<< PASTIKAN getDocs diimpor
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx'; // Pastikan library xlsx terinstal: npm install xlsx
import './admin.css';

// =========================================================
// Komponen Pembantu: AddGuestForm
// =========================================================
const AddGuestForm = ({ onAddGuest }) => {
  const [guestName, setGuestName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddGuest(guestName.trim());
    setGuestName('');
  };

  return (
    <div className="admin-card add-guest-card">
      <h3 className="card-title">Tambah Tamu Manual</h3>
      <form onSubmit={handleSubmit} className="add-guest-form">
        <input
          type="text"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          placeholder="Nama Tamu (misal: Bapak/Ibu Keluarga Budi)"
          required
        />
        <button type="submit" className="add-guest-button">Tambahkan Tamu</button>
      </form>
    </div>
  );
};

// =========================================================
// Komponen Pembantu: UploadGuestExcel
// =========================================================
const UploadGuestExcel = ({ onUploadGuests }) => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage('');
    setIsError(false);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Pilih file Excel/CSV terlebih dahulu.');
      setIsError(true);
      return;
    }

    setMessage('Memproses file...');
    setIsError(false);

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        // Asumsi kolom nama tamu ada di kolom pertama (indeks 0)
        // json: array of arrays. header: 1 berarti baris pertama adalah header
        const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (json.length < 2) { // Minimal 2 baris (header + 1 data)
          setMessage('File Excel/CSV kosong atau tidak memiliki data.');
          setIsError(true);
          return;
        }

        const guestNames = json.slice(1) // Lewati baris header
                              .map(row => row[0]) // Ambil kolom pertama
                              .filter(name => typeof name === 'string' && name.trim() !== ''); // Filter nama yang valid

        if (guestNames.length === 0) {
          setMessage('Tidak ada nama tamu yang ditemukan di kolom pertama.');
          setIsError(true);
          return;
        }

        await onUploadGuests(guestNames); // Panggil fungsi upload di parent
        setMessage(`Berhasil menambahkan ${guestNames.length} tamu.`);
        setIsError(false);
        setFile(null); // Reset input file
        document.getElementById('excel-upload-input').value = ''; // Clear file input
      } catch (err) {
        console.error("Error processing Excel file:", err);
        setMessage('Gagal memproses file. Pastikan formatnya benar (kolom nama di A1).');
        setIsError(true);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="admin-card upload-excel-card">
      <h3 className="card-title">Upload Tamu dari Excel/CSV</h3>
      <input
        type="file"
        id="excel-upload-input"
        accept=".xlsx, .xls, .csv" // Hanya terima format ini
        onChange={handleFileChange}
      />
      <button onClick={handleUpload} className="upload-button" disabled={!file}>
        Upload File
      </button>
      {message && (
        <p className={`upload-message ${isError ? 'error' : 'success'}`}>
          {message}
        </p>
      )}
    </div>
  );
};

// =========================================================
// Komponen Pembantu: GuestListTable (Daftar Tamu & Pagination)
// =========================================================
const GuestListTable = ({ guests, onDeleteGuest, baseUrl, onCopyLink, loadingGuests, onDownloadData, currentPage, totalPages, onPageChange, onGenerateFormattedInvitation, onDeleteAllGuests }) => {
    // Fungsi ini bisa dihapus dari sini karena sekarang generateFormattedInvitation ada di AdminPage dan diteruskan
    // const generatePersonalLink = (name) => {
    //     return `${baseUrl}?to=${encodeURIComponent(name)}`;
    // };

    return (
        <div className="admin-card guest-list-card">
            <div className="guest-list-header">
                <h3 className="card-title">Daftar Tamu & Link Undangan</h3>
                <div className="guest-list-actions">
                    <button onClick={onDownloadData} className="download-button">Download Data</button>
                    <button onClick={onDeleteAllGuests} className="delete-all-button">Hapus Semua Data</button>
                </div>
            </div>
            
            {loadingGuests ? (
                <p>Memuat daftar tamu...</p>
            ) : guests.length === 0 ? (
                <p>Belum ada tamu yang ditambahkan.</p>
            ) : (
                <>
                    <div className="guest-list-table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>No.</th>
                                    <th>Nama Tamu</th>
                                    <th>Format Undangan (untuk disalin)</th> {/* Ganti judul kolom */}
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {guests.map((guest, index) => {
                                    const personalLink = `${baseUrl}?to=${encodeURIComponent(guest.name)}`; // Masih perlu ini untuk membuat link
                                    // Panggil fungsi generateFormattedInvitation yang diteruskan dari prop
                                    const formattedInvitation = onGenerateFormattedInvitation(guest.name, personalLink);

                                    return (
                                        <tr key={guest.id}>
                                            <td>{(currentPage - 1) * 10 + index + 1}</td>
                                            <td>{guest.name}</td>
                                            <td>
                                                <div className="formatted-invitation-display">
                                                    {/* Menggunakan textarea agar teks bisa di-scroll jika panjang */}
                                                    <textarea readOnly value={formattedInvitation} className="formatted-invitation-textarea"></textarea>
                                                    <button onClick={() => onCopyLink(formattedInvitation)} className="copy-link-button">Salin Undangan</button> {/* Ganti teks tombol */}
                                                </div>
                                            </td>
                                            <td>
                                                <button onClick={() => onDeleteGuest(guest.id)} className="delete-guest-button">Hapus</button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="pagination-controls">
                            <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
                                Previous
                            </button>
                            <span>Page {currentPage} of {totalPages}</span>
                            <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};


// =========================================================
// Komponen Utama: AdminPage
// =========================================================
function AdminPage() {
    const [allGuests, setAllGuests] = useState([]); // Simpan semua tamu yang diambil dari Firebase
    const [loadingGuests, setLoadingGuests] = useState(true);
    const navigate = useNavigate();

    // --- State untuk Pagination ---
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Batas 10 data per halaman
    // ---

    // URL dasar undangan Anda (ganti dengan URL Netlify Anda!)
    const baseUrl = "https://wedding-invitations-web.netlify.app/";

    // --- Fungsi untuk Menggenerate Format Undangan Lengkap ---
    const generateFormattedInvitation = (guestName, personalLink) => {
        return `Assalamualaikum Wr. Wb

Kepada Yth : ${guestName}
    
Dengan segala kerendahan hati dan rasa syukur atas karunia Allah SWT yang senantiasa mencurahkan tetes kelembutan kasih sayang Nya.
            
Tanpa mengurangi rasa hormat, kami memohon doa restu serta mengundang Bapak/Ibu, Saudara/i untuk menghadiri acara pernikahan kami,
    
Ipan & Risma
            
Silakan klik link di bawah ini untuk mengetahui informasi selengkapnya mengenai acara pernikahan kami : 
    
${personalLink}
    
Atas kehadiran dan doa restu dari Bapak/Ibu, Saudara/i kami mengucapkan banyak terimakasih.
    
Wassalamualaikum Wr. Wb
    
Hormat Kami
Ipan & Risma`;
    };
    // --- AKHIR FUNGSI generateFormattedInvitation ---


    // --- useEffect untuk Mengambil Daftar Tamu dari Firebase (Realtime) ---
    useEffect(() => {
        if (!auth.currentUser) {
            setLoadingGuests(false);
            return;
        }

        const q = query(collection(db, 'guests'), orderBy('timestamp', 'desc'));

        // onSnapshot akan mendengarkan perubahan data secara realtime
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedGuests = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setAllGuests(fetchedGuests); // Set semua tamu
            setLoadingGuests(false);
            // Jika halaman saat ini menjadi kosong karena penghapusan, pindah ke halaman sebelumnya
            if (fetchedGuests.length > 0 && currentPage > Math.ceil(fetchedGuests.length / itemsPerPage)) {
                setCurrentPage(Math.ceil(fetchedGuests.length / itemsPerPage));
            } else if (fetchedGuests.length === 0 && currentPage > 1) {
                setCurrentPage(1); // Jika semua dihapus, kembali ke halaman 1
            }
        }, (error) => {
            console.error("Error fetching guests:", error);
            setLoadingGuests(false);
        });

        // Cleanup function: hentikan langganan saat komponen di-unmount
        return () => unsubscribe();
    }, [auth.currentUser, currentPage]); // Tambahkan currentPage agar update saat penghapusan


    // --- Logika Pagination ---
    const indexOfLastGuest = currentPage * itemsPerPage;
    const indexOfFirstGuest = indexOfLastGuest - itemsPerPage;
    const currentGuests = allGuests.slice(indexOfFirstGuest, indexOfLastGuest);
    const totalPages = Math.ceil(allGuests.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };
    // --- Akhir Logika Pagination ---


    // --- Fungsi untuk Menambahkan Tamu Manual ---
    const handleAddSingleGuest = async (name) => {
        try {
            await addDoc(collection(db, 'guests'), {
                name: name,
                timestamp: new Date(), // Gunakan serverTimestamp() jika mau lebih akurat dari server Firebase
            });
            alert('Tamu berhasil ditambahkan!');
        } catch (error) {
            console.error("Error adding guest:", error);
            alert('Gagal menambahkan tamu.');
        }
    };

    // --- Fungsi untuk Mengupload Tamu dari Excel ---
    const handleUploadMultipleGuests = async (names) => {
        if (names.length === 0) return;

        const batch = writeBatch(db); // Gunakan batch write untuk efisiensi
        const guestsRef = collection(db, 'guests');

        names.forEach(name => {
            const newGuestRef = doc(guestsRef); // Dapatkan reference dokumen baru
            batch.set(newGuestRef, {
                name: name,
                timestamp: new Date(), // Gunakan serverTimestamp() jika mau lebih akurat dari server Firebase
            });
        });

        try {
            await batch.commit();
            console.log(`Berhasil menambahkan ${names.length} tamu dari Excel.`);
            // Pesan sukses/error ditangani oleh komponen UploadGuestExcel
        } catch (error) {
            console.error("Error uploading guests batch:", error);
            alert('Gagal mengupload tamu dari Excel. Silakan cek konsol untuk detailnya.');
            throw error; // Lempar error agar komponen UploadGuestExcel tahu ada masalah
        }
    };

    // --- Fungsi untuk Menghapus Tamu Per Baris ---
    const handleDeleteGuest = async (id) => {
        if (window.confirm('Anda yakin ingin menghapus tamu ini?')) {
            try {
                await deleteDoc(doc(db, 'guests', id));
                alert('Tamu berhasil dihapus!');
                // Logika perpindahan halaman otomatis sudah di handle di useEffect onSnapshot
            } catch (error) {
                console.error("Error deleting guest:", error);
                alert('Gagal menghapus tamu.');
            }
        }
    };

    // --- Fungsi untuk Logout Admin ---
    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/admin/login'); // Redirect ke halaman login setelah logout
        } catch (error) {
            console.error("Error logging out:", error);
            alert('Gagal logout.');
        }
    };

    // --- Fungsi untuk Menyalin Link/Format Undangan ke Clipboard ---
    const copyLinkToClipboard = (link) => {
        navigator.clipboard.writeText(link).then(() => {
            alert('Link berhasil disalin!');
        }).catch(err => {
            console.error('Gagal menyalin link:', err);
        });
    };

    // --- Fungsi Download Data ke Excel/CSV ---
    const handleDownloadData = () => {
        const dataToExport = allGuests.map((guest, index) => {
            const personalLink = `${baseUrl}?to=${encodeURIComponent(guest.name)}`;
            const formattedInvitation = generateFormattedInvitation(guest.name, personalLink);

            return {
                'No.': index + 1,
                'Nama Tamu': guest.name,
                'Link Undangan Personal': personalLink, // Kolom ini untuk link saja
                'Format Undangan Lengkap': formattedInvitation, // Kolom ini untuk format lengkap
                'Tanggal Ditambahkan': guest.timestamp ? new Date(guest.timestamp.seconds * 1000).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A'
            };
        });

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Daftar Tamu");
        XLSX.writeFile(workbook, "Daftar_Tamu_Undangan.xlsx");
    };

    // --- FUNGSI UTAMA: Menghapus Semua Data Tamu ---
    const handleDeleteAllGuests = async () => {
        if (allGuests.length === 0) {
            alert("Tidak ada data tamu untuk dihapus.");
            return;
        }

        const confirm1 = window.confirm('ANDA YAKIN INGIN MENGHAPUS SEMUA DATA TAMU? Aksi ini TIDAK DAPAT DIBATALKAN!');
        if (!confirm1) {
            return;
        }
        const confirm2 = window.confirm('Peringatan: Ini akan menghapus PERMANEN SEMUA data tamu. Klik OK untuk melanjutkan penghapusan.');
        if (!confirm2) {
            return;
        }

        try {
            const collectionRef = collection(db, 'guests');
            const q = query(collectionRef);
            // Menggunakan getDocs untuk mendapatkan semua dokumen
            const snapshot = await getDocs(q);

            if (snapshot.empty) {
                alert("Tidak ada data tamu untuk dihapus.");
                return;
            }

            const batch = writeBatch(db);
            snapshot.docs.forEach((docRef) => {
                batch.delete(docRef.ref);
            });

            await batch.commit();
            alert(`Berhasil menghapus ${snapshot.size} data tamu.`)
            // setCurrentPage(1); // Perpindahan halaman otomatis sudah di handle di useEffect onSnapshot
        } catch (error) {
            console.error("Error deleting all guests:", error);
            alert('Gagal menghapus semua data tamu. Silakan cek konsol untuk detailnya.');
        }
    };
    // --- AKHIR FUNGSI UTAMA ---


    return (
        <div className="admin-page-wrapper">
            <div className="admin-header">
                <h2 className="admin-title">Admin Dashboard</h2>
                <button onClick={handleLogout} className="admin-logout-button">Logout</button>
            </div>

            <div className="admin-content">
                <AddGuestForm onAddGuest={handleAddSingleGuest} />
                <UploadGuestExcel onUploadGuests={handleUploadMultipleGuests} />
                <GuestListTable
                    guests={currentGuests} // Teruskan hanya data tamu halaman saat ini
                    onDeleteGuest={handleDeleteGuest}
                    baseUrl={baseUrl}
                    onCopyLink={copyLinkToClipboard}
                    loadingGuests={loadingGuests}
                    onDownloadData={handleDownloadData} // Teruskan fungsi download
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    onGenerateFormattedInvitation={generateFormattedInvitation} // Teruskan fungsi ini ke GuestListTable
                    onDeleteAllGuests={handleDeleteAllGuests} // Teruskan fungsi ini ke GuestListTable
                />
            </div>
        </div>
    );
}

export default AdminPage;