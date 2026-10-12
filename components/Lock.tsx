import React, { useEffect, useState } from 'react';
import { Logo } from './Ui';

const PASSCODE = '1304';

const Lock: React.FC<{ onUnlock: () => void }> = ({ onUnlock }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (code.length < PASSCODE.length) return;
    if (code === PASSCODE) {
      const t = setTimeout(onUnlock, 160);
      return () => clearTimeout(t);
    }
    setError(true);
    const t = setTimeout(() => {
      setError(false);
      setCode('');
    }, 620);
    return () => clearTimeout(t);
  }, [code, onUnlock]);

  const press = (k: string) => {
    if (error) return;
    if (k === 'del') return setCode((c) => c.slice(0, -1));
    setCode((c) => (c.length >= PASSCODE.length ? c : c + k));
  };

  return (
    <div className="min-h-screen bg-[#0B0C0F] flex flex-col max-w-md mx-auto">
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <Logo size={46} />
        <h1 className="text-[20px] font-semibold text-white mt-5 tracking-tight">OPR Wallet</h1>

        <p className="text-[13px] text-white/40 mt-8">Enter passcode</p>

        <div className={`flex gap-3.5 mt-5 ${error ? 'animate-shake' : ''}`}>
          {Array.from({ length: PASSCODE.length }).map((_, i) => (
            <span
              key={i}
              className={`w-3 h-3 rounded-full transition-all duration-150 ${
                error
                  ? 'bg-[#EA3943]'
                  : i < code.length
                  ? 'bg-white scale-110'
                  : 'bg-white/15'
              }`}
            />
          ))}
        </div>
        <p className={`text-[12px] mt-4 h-4 ${error ? 'text-[#EA3943]' : 'text-white/25'}`}>
          {error ? 'Incorrect passcode' : 'Passcode 1304'}
        </p>
      </div>

      <div className="px-8 pb-10">
        <div className="grid grid-cols-3 gap-2">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'].map((k, i) =>
            k === '' ? (
              <div key={i} />
            ) : (
              <button
                key={i}
                onClick={() => press(k)}
                className="h-16 rounded-2xl text-[24px] font-medium text-white active:bg-white/[0.08] transition-colors flex items-center justify-center"
              >
                {k === 'del' ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414-6.414A2 2 0 0110.828 5H19a2 2 0 012 2v10a2 2 0 01-2 2h-8.172a2 2 0 01-1.414-.586L3 12z" />
                  </svg>
                ) : (
                  k
                )}
              </button>
            ),
          )}
        </div>
      </div>
    </div>
  );
};

export default Lock;
