import React, { useEffect, useState } from 'react';
import { Logo } from './Ui';

const PASSCODE = '110801';

const Lock: React.FC<{ onUnlock: () => void }> = ({ onUnlock }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (code.length < PASSCODE.length) return;
    if (code === PASSCODE) {
      const t = setTimeout(onUnlock, 180);
      return () => clearTimeout(t);
    }
    setError(true);
    const t = setTimeout(() => {
      setError(false);
      setCode('');
    }, 640);
    return () => clearTimeout(t);
  }, [code, onUnlock]);

  const press = (k: string) => {
    if (error) return;
    if (k === 'del') return setCode((c) => c.slice(0, -1));
    setCode((c) => (c.length >= PASSCODE.length ? c : c + k));
  };

  const filled = code.length;

  return (
    <div className="h-[100dvh] bg-[#0B0C0F] flex flex-col max-w-md mx-auto relative overflow-hidden">
      {/* Ambient brand glow */}
      <div
        className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[340px] h-[340px] rounded-full opacity-[0.18] blur-[90px]"
        style={{ background: 'radial-gradient(circle, #7C5CFF 0%, #16C784 65%, transparent 100%)' }}
      />

      <div className="flex-1 flex flex-col items-center justify-center px-8 relative z-10">
        <div className="relative">
          <div className="absolute inset-0 blur-xl opacity-40">
            <Logo size={56} />
          </div>
          <Logo size={56} />
        </div>

        <h1 className="text-[22px] font-semibold text-white mt-6 tracking-tight">OPR Wallet</h1>
        <p className="text-[13px] text-white/35 mt-1.5">
          {error ? 'Incorrect passcode' : 'Enter your passcode'}
        </p>

        <div className={`flex gap-4 mt-9 ${error ? 'animate-shake' : ''}`}>
          {Array.from({ length: PASSCODE.length }).map((_, i) => (
            <span
              key={i}
              className={`rounded-full transition-all duration-200 ${
                error
                  ? 'w-[11px] h-[11px] bg-[#EA3943]'
                  : i < filled
                  ? 'w-[11px] h-[11px] bg-white'
                  : 'w-[11px] h-[11px] bg-white/[0.14]'
              }`}
              style={i < filled && !error ? { boxShadow: '0 0 12px rgba(255,255,255,0.45)' } : undefined}
            />
          ))}
        </div>
      </div>

      <div className="px-10 pb-12 relative z-10">
        <div className="grid grid-cols-3 gap-x-6 gap-y-3">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'bio', '0', 'del'].map((k, i) => (
            <button
              key={i}
              onClick={() => (k === 'bio' ? onUnlock() : press(k))}
              aria-label={k === 'bio' ? 'Unlock with Face ID' : k === 'del' ? 'Delete' : k}
              className={`h-[68px] rounded-full flex items-center justify-center transition-all active:scale-90 ${
                k === 'bio' || k === 'del'
                  ? 'text-white/45 active:bg-white/[0.06]'
                  : 'text-[26px] font-light text-white bg-white/[0.045] active:bg-white/[0.12]'
              }`}
            >
              {k === 'bio' ? (
                <svg className="w-[26px] h-[26px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.6}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V6a2 2 0 012-2h2M16 4h2a2 2 0 012 2v2M20 16v2a2 2 0 01-2 2h-2M8 20H6a2 2 0 01-2-2v-2" />
                  <path strokeLinecap="round" d="M9 9.5a3.2 3.2 0 016 0v1.2M9 12.3V13a3 3 0 003 3M15 13.5a3 3 0 01-.4 1.5M12 9.8v3.4" />
                </svg>
              ) : k === 'del' ? (
                <svg className="w-[26px] h-[26px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.6}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414-6.414A2 2 0 0110.828 5H19a2 2 0 012 2v10a2 2 0 01-2 2h-8.172a2 2 0 01-1.414-.586L3 12z" />
                </svg>
              ) : (
                k
              )}
            </button>
          ))}
        </div>

        <button className="w-full text-center text-[13px] font-medium text-white/30 mt-7 active:text-white/50 transition-colors">
          Forgot passcode?
        </button>
      </div>
    </div>
  );
};

export default Lock;
