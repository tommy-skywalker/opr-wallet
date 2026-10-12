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

// Token marks. Ethereum gets its diamond, the rest use their currency glyph,
// all reversed out of a solid brand colour so the asset list scans at a glance.
const MARKS: Record<string, React.ReactNode> = {
  ETH: (
    <g fill="#fff">
      <path d="M12 3 7 12l5 2.95V3z" opacity="0.55" />
      <path d="M12 3v11.95L17 12 12 3z" />
      <path d="M12 16.1 7 13.15 12 21v-4.9z" opacity="0.55" />
      <path d="M12 21v-4.9l5-2.95L12 21z" />
    </g>
  ),
  BTC: (
    <text x="12" y="17.6" textAnchor="middle" fontSize="16" fontWeight="700" fill="#fff">
      ₿
    </text>
  ),
  USDT: (
    <text x="12" y="17.4" textAnchor="middle" fontSize="16" fontWeight="700" fill="#fff">
      ₮
    </text>
  ),
  USDC: (
    <g fill="none" stroke="#fff" strokeWidth="1.7" strokeLinecap="round">
      <circle cx="12" cy="12" r="7.4" opacity="0.5" />
      <path d="M13.9 9.8c-.4-.8-1.1-1.2-2-1.2-1.2 0-2 .7-2 1.7 0 2.3 4.4 1 4.4 3.4 0 1-.9 1.8-2.2 1.8-1 0-1.8-.4-2.2-1.2M12 7.2v1.4M12 15.4v1.4" />
    </g>
  ),
};

export const CoinIcon: React.FC<{ symbol: string; color: string; size?: number }> = ({
  symbol,
  color,
  size = 40,
}) => (
  <div
    className="rounded-full flex items-center justify-center shrink-0 relative overflow-hidden"
    style={{
      width: size,
      height: size,
      background: color,
      boxShadow: `0 2px 10px -2px ${color}80`,
    }}
  >
    {/* soft top highlight for a little depth */}
    <div
      className="absolute inset-0 rounded-full"
      style={{ background: 'linear-gradient(160deg, rgba(255,255,255,0.28), rgba(255,255,255,0) 55%)' }}
    />
    <svg
      viewBox="0 0 24 24"
      width={size * 0.66}
      height={size * 0.66}
      className="relative"
      fontFamily="Inter, system-ui, sans-serif"
    >
      {MARKS[symbol] || (
        <text x="12" y="17" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff">
          {symbol.slice(0, 3)}
        </text>
      )}
    </svg>
  </div>
);

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
