'use client';

import { useState } from 'react';
import portalApiClient from '@/lib/portal-api-client';
import { useRouter } from 'next/navigation';

export default function PortalLoginPage() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await portalApiClient.post('/portal/request-otp', { phone });
      setStep('OTP');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await portalApiClient.post('/portal/verify-otp', { phone, otp });
      localStorage.setItem('client_accessToken', res.data.accessToken);
      router.push('/portal/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900">Client Portal</h1>
          <p className="text-sm text-slate-500 mt-2">Enter your registered phone number to log in.</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        {step === 'PHONE' ? (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Phone Number</label>
              <input 
                type="tel" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                required 
                placeholder="e.g., 919876543210" 
                className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-3 border"
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-xl shadow-sm transition disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Request OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">6-Digit OTP</label>
              <input 
                type="text" 
                maxLength={6} 
                value={otp} 
                onChange={(e) => setOtp(e.target.value)} 
                required 
                placeholder="123456" 
                className="mt-1 block w-full text-center text-2xl tracking-widest rounded-xl border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-3 border"
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-xl shadow-sm transition disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify & Log In'}
            </button>
            <button 
              type="button" 
              onClick={() => setStep('PHONE')}
              className="w-full text-sm text-slate-500 hover:underline text-center"
            >
              Change Phone Number
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
