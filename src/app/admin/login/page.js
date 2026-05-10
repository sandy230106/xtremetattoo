'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Check if already logged in
    const auth = localStorage.getItem('admin_auth');
    if (auth === 'true') {
      router.push('/admin');
    }
  }, [router]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginId === 'xtreme' && password === 'muthu.k') {
      localStorage.setItem('admin_auth', 'true');
      router.push('/admin');
    } else {
      setError('Invalid ID or Password');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#050505',
      fontFamily: 'Inter, sans-serif',
      color: '#fff'
    }}>
      <div className="login-card glass" style={{
        width: '100%',
        maxWidth: '400px',
        padding: '3rem',
        borderRadius: '20px',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontFamily: 'Bebas Neue, sans-serif',
          fontSize: '2.5rem',
          letterSpacing: '2px',
          color: '#E5B942',
          marginBottom: '0.5rem'
        }}>XTREME</h1>
        <p style={{ color: '#888', marginBottom: '2.5rem', fontSize: '0.9rem' }}>ADMIN DASHBOARD ACCESS</p>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div style={{ textAlign: 'left' }}>
            <label style={{ fontSize: '0.8rem', color: '#aaa', marginBottom: '0.5rem', display: 'block', marginLeft: '5px' }}>Login ID</label>
            <input
              type="text"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              placeholder="Enter ID"
              required
              style={{
                width: '100%',
                padding: '1rem',
                background: '#121212',
                border: '1px solid #333',
                borderRadius: '10px',
                color: '#fff',
                outline: 'none',
                transition: 'border-color 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#E5B942'}
              onBlur={(e) => e.target.style.borderColor = '#333'}
            />
          </div>

          <div style={{ textAlign: 'left' }}>
            <label style={{ fontSize: '0.8rem', color: '#aaa', marginBottom: '0.5rem', display: 'block', marginLeft: '5px' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              required
              style={{
                width: '100%',
                padding: '1rem',
                background: '#121212',
                border: '1px solid #333',
                borderRadius: '10px',
                color: '#fff',
                outline: 'none',
                transition: 'border-color 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#E5B942'}
              onBlur={(e) => e.target.style.borderColor = '#333'}
            />
          </div>

          {error && <p style={{ color: '#ff4444', fontSize: '0.85rem', margin: '0' }}>{error}</p>}

          <button
            type="submit"
            style={{
              marginTop: '1rem',
              padding: '1rem',
              background: '#E5B942',
              color: '#000',
              border: 'none',
              borderRadius: '10px',
              fontWeight: 'bold',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'transform 0.2s, background 0.2s'
            }}
            onMouseOver={(e) => e.target.style.background = '#d4a835'}
            onMouseOut={(e) => e.target.style.background = '#E5B942'}
            onMouseDown={(e) => e.target.style.transform = 'scale(0.98)'}
            onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
          >
            LOGIN
          </button>
        </form>
      </div>
    </div>
  );
}
