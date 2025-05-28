// src/components/admin/LoginPage.js
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth'; // Import fungsi login
import { auth } from '../../firebase'; // Import objek auth dari firebase.js
import { useNavigate } from 'react-router-dom'; // Untuk redirect setelah login
import './admin.css'; // Akan kita buat nanti untuk styling admin

function LoginPage() {
    const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [error, setError] = useState(''); // Untuk menampilkan pesan error
      const navigate = useNavigate();
  
    const handleLogin = async (e) => {
          e.preventDefault();
          setError(''); // Reset error message

          try {
              await signInWithEmailAndPassword(auth, email, password);
                // Jika login berhasil, arahkan ke halaman admin utama
                navigate('/admin');
            } catch (err) {
                // Tangani error login
                console.error("Login error:", err.code, err.message);
            switch (err.code) {
                    case 'auth/user-not-found':
                    setError('Email tidak terdaftar.');
                        break;
                      case 'auth/wrong-password':
                            setError('Password salah.');
                            break;
                      case 'auth/invalid-email':
                          setError('Format email tidak valid.');
                          break;
                    default:
                          setError('Terjadi kesalahan saat login. Silakan coba lagi.');
                          break;
                  }
            }
    };
    
      return (
        <div className="admin-page-wrapper">
            <div className="login-container">
                  <h2 className="login-title" style={{ fontFamily: 'Playfair Display, serif' }}>Admin Login</h2>
                  <p className="login-subtitle">Masuk untuk mengelola undangan Anda</p>
    
                    <form onSubmit={handleLogin} className="login-form">
                    <div className="form-group">
                            <label htmlFor="email">Email</label>
                              <input
                                    type="email"
                                    id="email"
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                  required
                                placeholder="admin@example.com"
                              />
                          </div>
                        <div className="form-group">
                          <label htmlFor="password">Password</label>
                        <input
                              type="password"
                              id="password"
                                value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="••••••••"
                              />
                            </div>
                            {error && <p className="login-error-message">{error}</p>}
                          <button type="submit" className="login-button">Login</button>
                    </form>
              </div>
        </div>
      );
}  
    
export       default LoginPage;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      