import React, { useEffect, useState } from 'react';

export const Logo: React.FC<{ size?: number }> = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <defs>
      <linearGradient id="opr-g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#7C5CFF" />
        <stop offset="100%" stopColor="#16C784" />
      </linearGradient>
    </defs>
    <circle cx="16" cy="16" r="15" stroke="url(#opr-g)" strokeWidth="2" />
    <path
      d="M10 21.5 16 9l6 12.5"
      stroke="url(#opr-g)"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M12.6 17.8h6.8" stroke="url(#opr-g)" strokeWidth="2.4" strokeLinecap="round" />
  </svg>
);

const GLYPHS: Record<string, string> = {
  BTC: '₿',
  ETH: 'Ξ',
  USDT: '₮',
  USDC: '$',
};

export const CoinIcon: React.FC<{ symbol: string; color: string; size?: number }> = ({
  symbol,
  color,
  size = 40,
}) => (
  <div
    className="rounded-full flex items-center justify-center shrink-0 font-semibold"
    style={{
      width: size,
      height: size,
      background: `${color}1f`,
      color,
      fontSize: size * 0.46,
      border: `1px solid ${color}33`,
    }}
  >
    {GLYPHS[symbol] || symbol.slice(0, 1)}
  </div>
);

/** Bottom sheet with a backdrop. Mounts with a slide-up. */
export const Sheet: React.FC<{
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ open, onClose, children }) => {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    if (open) requestAnimationFrame(() => setShown(true));
    else setShown(false);
  }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div
        className={`absolute inset-0 bg-black/70 backdrop-blur-[2px] transition-opacity duration-200 ${
          shown ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      <div
        className={`relative w-full max-w-md bg-[#15171C] border-t border-white/10 rounded-t-3xl px-5 pb-8 pt-3 transition-transform duration-300 ${
          shown ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)' }}
      >
        <div className="w-9 h-1 rounded-full bg-white/15 mx-auto mb-5" />
        {children}
      </div>
    </div>
  );
};

export const ScreenHeader: React.FC<{ title: string; right?: React.ReactNode }> = ({
  title,
  right,
}) => (
  <header className="h-14 px-5 flex items-center justify-between">
    <h1 className="text-[17px] font-semibold text-white tracking-tight">{title}</h1>
    {right}
  </header>
);

/** Counts a number up on mount. Used for the headline balance. */
export const useCountUp = (target: number, duration = 850): number => {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 4);
      setV(target * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    // rAF pauses in background tabs, so guarantee the final value lands.
    const snap = setTimeout(() => setV(target), duration + 250);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(snap);
    };
  }, [target, duration]);
  return v;
};
