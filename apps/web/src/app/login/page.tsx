'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) { setError('Email is required.'); return; }
    if (!password.trim()) { setError('Password is required.'); return; }

    setIsLoading(true);
    try {
      await login({ email: email.trim(), password });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      if (msg.includes('401') || msg.toLowerCase().includes('invalid')) {
        setError('Invalid email or password. Please try again.');
      } else if (msg.toLowerCase().includes('network') || msg.toLowerCase().includes('fetch')) {
        setError('Cannot reach the server. Check your connection or try again shortly.');
      } else {
        setError(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: '100vh',
      background: '#F8F9FA', fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '1rem',
    }}>
      <div style={{
        width: '100%', maxWidth: '400px',
        background: '#fff', borderRadius: '12px',
        border: '0.5px solid #E5E7EB', padding: '2rem',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            fontSize: '22px', fontWeight: '700',
            color: '#0057FF', letterSpacing: '-0.5px',
          }}>
            WATERTING
          </div>
          <p style={{ fontSize: '13px', color: '#6B7280', marginTop: '4px' }}>
            AI-Powered Real Estate CRM
          </p>
        </div>

        <h1 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '1.5rem' }}>
          Sign in to your workspace
        </h1>

        {error && (
          <div style={{
            background: '#FEF2F2', border: '0.5px solid #FECACA',
            borderRadius: '8px', padding: '10px 14px',
            fontSize: '13px', color: '#B91C1C', marginBottom: '1rem',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
              Work email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@company.com"
              autoComplete="email"
              style={{
                width: '100%', padding: '10px 12px', fontSize: '14px',
                color: '#111827', background: '#fff',
                border: '0.5px solid #D1D5DB', borderRadius: '8px',
                outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '500', color: '#374151' }}>
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                style={{ fontSize: '12px', color: '#6B7280', background: 'none', border: 'none', cursor: 'pointer', padding: '0' }}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              style={{
                width: '100%', padding: '10px 12px', fontSize: '14px',
                color: '#111827', background: '#fff',
                border: '0.5px solid #D1D5DB', borderRadius: '8px',
                outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%', padding: '11px', fontSize: '14px',
              fontWeight: '600', color: '#fff',
              background: isLoading ? '#93C5FD' : '#0057FF',
              border: 'none', borderRadius: '8px', cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'background 0.15s',
            }}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '13px', color: '#6B7280' }}>
          Don't have an account?{' '}
          <a href="/signup" style={{ color: '#0057FF', textDecoration: 'none', fontWeight: '500' }}>
            Start free trial
          </a>
        </p>
      </div>
    </div>
  );
}
