import React, { useMemo, useState } from 'react';
import qrcode from 'qrcode-generator';
import { Asset } from '../types';
import { CoinIcon } from './Ui';

/** Renders a real, scannable QR as crisp SVG rects. */
const QR: React.FC<{ value: string; size?: number }> = ({ value, size = 188 }) => {
  const { cells, count } = useMemo(() => {
    const qr = qrcode(0, 'M');
    qr.addData(value);
    qr.make();
    const n = qr.getModuleCount();
    const dark: [number, number][] = [];
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        if (qr.isDark(r, c)) dark.push([r, c]);
      }
    }
    return { cells: dark, count: n };
  }, [value]);

  const quiet = 2;
  const total = count + quiet * 2;

  return (
    <svg viewBox={`0 0 ${total} ${total}`} width={size} height={size} shapeRendering="crispEdges">
      <rect width={total} height={total} fill="#fff" rx="1" />
      {cells.map(([r, c], i) => (
        <rect key={i} x={c + quiet} y={r + quiet} width={1} height={1} fill="#0B0C0F" />
      ))}
    </svg>
  );
};

const Receive: React.FC<{ assets: Asset[]; onClose: () => void }> = ({ assets, onClose }) => {
  const [asset, setAsset] = useState<Asset>(assets[0]);
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard?.writeText(asset.address).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="fixed inset-0 z-40 bg-[#0B0C0F] flex flex-col max-w-md mx-auto overflow-y-auto">
      <header className="h-14 px-3 flex items-center justify-between shrink-0">
        <button onClick={onClose} className="w-10 h-10 flex items-center justify-center text-white/60" aria-label="Close">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <span className="text-[15px] font-semibold text-white">Receive</span>
        <div className="w-10" />
      </header>

      {/* Network switcher */}
      <div className="px-5 flex gap-2">
        {assets.map((a) => (
          <button
            key={a.id}
            onClick={() => setAsset(a)}
            className={`flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full border transition-colors ${
              asset.id === a.id
                ? 'bg-white/[0.1] border-white/20'
                : 'bg-white/[0.03] border-white/[0.07]'
            }`}
          >
            <CoinIcon symbol={a.symbol} color={a.color} size={22} />
            <span className={`text-[12px] font-medium ${asset.id === a.id ? 'text-white' : 'text-white/45'}`}>
              {a.symbol}
            </span>
          </button>
        ))}
      </div>

      <div className="flex-1 flex flex-col items-center px-6 pt-8">
        <div className="p-4 bg-white rounded-3xl shadow-[0_0_60px_-12px_rgba(255,255,255,0.18)]">
          <QR value={asset.address} />
        </div>

        <p className="text-[13px] text-white/45 mt-6 text-center">
          Your {asset.name} address on {asset.network}
        </p>

        <button
          onClick={copy}
          className="w-full mt-3 bg-white/[0.05] border border-white/[0.09] rounded-2xl p-4 active:bg-white/[0.08] transition-colors"
        >
          <p className="text-[13px] text-white font-mono break-all leading-relaxed text-center">
            {asset.address}
          </p>
          <div className="flex items-center justify-center gap-1.5 mt-3 text-[12px] font-medium text-[#16C784]">
            {copied ? (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.6}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Copied
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.9}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy address
              </>
            )}
          </div>
        </button>

        <div className="w-full mt-4 mb-8 rounded-2xl border border-amber-400/20 bg-amber-400/[0.06] p-4">
          <p className="text-[12px] text-amber-200/80 leading-relaxed">
            <span className="font-semibold">Demo wallet.</span> This address is for demonstration
            only. Do not send real assets to it, they cannot be recovered.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Receive;
