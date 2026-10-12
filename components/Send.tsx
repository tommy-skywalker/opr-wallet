import React, { useState } from 'react';
import { Asset } from '../types';
import { usd, crypto } from '../utils';
import { CoinIcon, Sheet } from './Ui';

interface Props {
  assets: Asset[];
  spotTotal: number;
  onClose: () => void;
}

const Send: React.FC<Props> = ({ assets, spotTotal, onClose }) => {
  const [asset, setAsset] = useState<Asset>(assets[0]);
  const [amount, setAmount] = useState('');
  const [picking, setPicking] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const max = asset.amount * asset.price;
  const value = parseFloat(amount) || 0;
  const over = value > max;
  const valid = value > 0 && !over;

  const press = (key: string) => {
    setAmount((a) => {
      if (key === 'del') return a.slice(0, -1);
      if (key === '.') return a.includes('.') ? a : (a || '0') + '.';
      if (a.includes('.') && a.split('.')[1].length >= 2) return a;
      const next = a === '0' ? key : a + key;
      return next.length > 9 ? a : next;
    });
  };

  const submit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setBlocked(true);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-40 bg-[#0B0C0F] flex flex-col max-w-md mx-auto">
      <header className="h-14 px-3 flex items-center justify-between shrink-0">
        <button onClick={onClose} className="w-10 h-10 flex items-center justify-center text-white/60" aria-label="Close">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <span className="text-[15px] font-semibold text-white">Send</span>
        <div className="w-10" />
      </header>

      {/* Amount */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="flex items-start gap-1">
          <span className="text-[26px] font-semibold text-white/35 mt-2">$</span>
          <span className="text-[56px] leading-none font-semibold text-white tabular-nums tracking-tight">
            {amount || '0'}
          </span>
        </div>
        <p className={`text-[13px] mt-3 tabular-nums ${over ? 'text-[#EA3943]' : 'text-white/40'}`}>
          {over
            ? `Exceeds ${asset.symbol} balance`
            : `≈ ${crypto(value / asset.price, asset.symbol)}`}
        </p>

        <button
          onClick={() => setPicking(true)}
          className="mt-7 flex items-center gap-2.5 bg-white/[0.06] border border-white/[0.09] rounded-full pl-2 pr-3.5 py-2 active:scale-95 transition-transform"
        >
          <CoinIcon symbol={asset.symbol} color={asset.color} size={28} />
          <span className="text-[14px] font-medium text-white">{asset.symbol}</span>
          <svg className="w-3.5 h-3.5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.4}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Keypad */}
      <div className="px-6 pb-6 shrink-0">
        <div className="flex gap-2 mb-4">
          {[25, 50, 100].map((p) => (
            <button
              key={p}
              onClick={() => setAmount(((max * p) / 100).toFixed(2))}
              className="flex-1 py-2 rounded-xl bg-white/[0.05] border border-white/[0.08] text-[12px] font-medium text-white/60 active:bg-white/[0.1]"
            >
              {p === 100 ? 'Max' : `${p}%`}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-1">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'del'].map((k) => (
            <button
              key={k}
              onClick={() => press(k)}
              className="h-14 rounded-xl text-[22px] font-medium text-white active:bg-white/[0.07] transition-colors flex items-center justify-center"
            >
              {k === 'del' ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414-6.414A2 2 0 0110.828 5H19a2 2 0 012 2v10a2 2 0 01-2 2h-8.172a2 2 0 01-1.414-.586L3 12z" />
                </svg>
              ) : (
                k
              )}
            </button>
          ))}
        </div>

        <button
          onClick={submit}
          disabled={!valid || submitting}
          className="w-full h-13 mt-4 py-3.5 rounded-2xl bg-white text-black text-[15px] font-semibold disabled:bg-white/10 disabled:text-white/30 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Preparing
            </>
          ) : (
            'Continue'
          )}
        </button>
      </div>

      {/* Asset picker */}
      <Sheet open={picking} onClose={() => setPicking(false)}>
        <h3 className="text-[15px] font-semibold text-white mb-1">Select asset</h3>
        <p className="text-[12px] text-white/40 mb-4">${usd(spotTotal)} available in total</p>
        <div className="space-y-1">
          {assets.map((a) => (
            <button
              key={a.id}
              onClick={() => {
                setAsset(a);
                setAmount('');
                setPicking(false);
              }}
              className="w-full flex items-center gap-3 p-3 rounded-2xl active:bg-white/[0.05] transition-colors"
            >
              <CoinIcon symbol={a.symbol} color={a.color} />
              <div className="flex-1 text-left">
                <p className="text-[14px] font-medium text-white">{a.name}</p>
                <p className="text-[12px] text-white/40">{a.network}</p>
              </div>
              <div className="text-right">
                <p className="text-[14px] font-medium text-white tabular-nums">
                  ${usd(a.amount * a.price)}
                </p>
                <p className="text-[12px] text-white/40 tabular-nums">{crypto(a.amount, a.symbol)}</p>
              </div>
            </button>
          ))}
        </div>
      </Sheet>

      {/* Demo block */}
      <Sheet open={blocked} onClose={() => setBlocked(false)}>
        <div className="text-center px-2">
          <div className="w-14 h-14 rounded-full bg-amber-400/10 border border-amber-400/25 flex items-center justify-center mx-auto">
            <svg className="w-7 h-7 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <h3 className="text-[17px] font-semibold text-white mt-4">This is a demo wallet</h3>
          <p className="text-[13px] text-white/50 mt-2 leading-relaxed">
            Outgoing transfers are disabled. No real funds are held, and nothing is broadcast to any
            network. Balances shown here are for demonstration only.
          </p>
          <button
            onClick={() => {
              setBlocked(false);
              setAmount('');
            }}
            className="w-full mt-6 py-3.5 rounded-2xl bg-white text-black text-[15px] font-semibold active:scale-[0.99] transition-transform"
          >
            Got it
          </button>
        </div>
      </Sheet>
    </div>
  );
};

export default Send;
