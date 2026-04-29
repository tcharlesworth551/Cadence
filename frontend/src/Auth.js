import { useState } from 'react';
import { supabase } from './supabase';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage('Check your email to confirm your account.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Syne', sans-serif",
      padding: '20px'
    }}>
      <div style={{ width: '100%', maxWidth: '380px' }}>

        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#f5f5f5', letterSpacing: '-0.5px' }}>
            cadence<span style={{ color: '#f0b429' }}>.</span>
          </div>
          <div style={{ fontSize: '13px', color: '#666', marginTop: '8px' }}>
            Build your trading discipline
          </div>
        </div>

        <div style={{
          background: '#111',
          border: '1px solid #222',
          borderRadius: '16px',
          padding: '32px'
        }}>
          <div style={{
            fontSize: '11px',
            fontWeight: '600',
            color: '#666',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: '24px'
          }}>
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </div>

          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Email</div>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{
                width: '100%', background: '#1a1a1a', border: '1px solid #222',
                borderRadius: '8px', padding: '11px 14px', color: '#f5f5f5',
                fontFamily: "'Syne', sans-serif", fontSize: '14px', outline: 'none', boxSizing: 'border-box'
              }}
              onFocus={e => e.target.style.borderColor = '#f0b429'}
              onBlur={e => e.target.style.borderColor = '#222'}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Password</div>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%', background: '#1a1a1a', border: '1px solid #222',
                borderRadius: '8px', padding: '11px 14px', color: '#f5f5f5',
                fontFamily: "'Syne', sans-serif", fontSize: '14px', outline: 'none', boxSizing: 'border-box'
              }}
              onFocus={e => e.target.style.borderColor = '#f0b429'}
              onBlur={e => e.target.style.borderColor = '#222'}
            />
          </div>

          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)', border: '1px solid #ef4444',
              borderRadius: '8px', padding: '10px 14px', color: '#ef4444',
              fontSize: '13px', marginBottom: '16px'
            }}>{error}</div>
          )}

          {message && (
            <div style={{
              background: 'rgba(34,197,94,0.1)', border: '1px solid #22c55e',
              borderRadius: '8px', padding: '10px 14px', color: '#22c55e',
              fontSize: '13px', marginBottom: '16px'
            }}>{message}</div>
          )}

          <button
            onClick={handleSubmit}
            disabled={!email || !password || loading}
            style={{
              width: '100%', background: '#f0b429', border: 'none',
              borderRadius: '8px', padding: '14px', color: '#0a0a0a',
              fontFamily: "'Syne', sans-serif", fontSize: '15px', fontWeight: '700',
              cursor: loading || !email || !password ? 'not-allowed' : 'pointer',
              opacity: loading || !email || !password ? 0.5 : 1,
              marginBottom: '16px'
            }}
          >
            {loading ? 'Loading...' : isSignUp ? 'Create Account' : 'Sign In'}
          </button>

          <div style={{ textAlign: 'center' }}>
            <button
              onClick={() => { setIsSignUp(!isSignUp); setError(''); setMessage(''); }}
              style={{
                background: 'none', border: 'none', color: '#666',
                fontFamily: "'Syne', sans-serif", fontSize: '13px', cursor: 'pointer'
              }}
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}