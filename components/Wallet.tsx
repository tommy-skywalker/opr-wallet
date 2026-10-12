import React, { useState } from 'react';
import { Asset, EarnPosition } from '../types';
import { PORTFOLIO_SERIES } from '../data';
import { usdParts, usd, pct, crypto, daysBetween, parseISO, startOfToday } from '../utils';
import { AreaChart, Sparkline } from './Charts';
import { CoinIcon, Logo, useCountUp } from './Ui';

interface Props {
  assets: Asset[];
  earn: EarnPosition;
  spotTotal: number;
  onSend: () => void;
  onReceive: () => void;
  onEarn: () => void;
  onAsset: (a: Asset) => void;
}

const RANGES = ['1W', '1M', '3M', 'ALL'] as const;

const Wallet: React.FC<Props> = ({ assets, earn, spotTotal, onSend, onReceive, onEarn, onAsset }) => {
  const [range, setRange] = useState<(typeof RANGES)[number]>('1M');
  const [hidden, setHidden] = useState(false);

  const total = spotTotal + earn.principal;
  const animated = useCountUp(total);
  const series = PORTFOLIO_SERIES[range];
  const first = series[0];
  const changeUsd = total - first;
  const changePct = (changeUsd / first) * 100;
  const up = changeUsd >= 0;

  const daysLeft = Math.max(0, daysBetween(startOfToday(), parseISO(earn.maturityDate)));
  const { whole, cents } = usdParts(hidden ? 0 : animated);

  return (
    <div className="pb-6">
      {/* Top bar */}
      <header className="h-14 px-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Logo size={26} />
          <span className="text-[15px] font-semibold text-white tracking-tight">OPR</span>
        </div>
        <button
          onClick={() => setHidden((h) => !h)}
          className="w-9 h-9 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center text-white/60 active:scale-95 transition-transform"
          aria-label={hidden ? 'Show balance' : 'Hide balance'}
        >
          <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.7}>
            {hidden ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M3 3l18 18" />
            ) : (
              <>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </>
            )}
          </svg>
        </button>
      </header>

      {/* Balance */}
      <section className="px-5 pt-4">
        <p className="text-[13px] text-white/40">Total balance</p>
        <div className="flex items-baseline gap-1 mt-1.5">
          <span className="text-[34px] leading-none font-semibold text-white tracking-tight tabular-nums">
            {hidden ? '••••••' : `$${whole}`}
          </span>
          {!hidden && (
            <span className="text-[22px] leading-none font-semibold text-white/35 tabular-nums">
              .{cents}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-3">
          <span
            className={`text-[13px] font-semibold tabular-nums px-2 py-[3px] rounded-full ${
              up ? 'text-[#16C784] bg-[#16C784]/10' : 'text-[#EA3943] bg-[#EA3943]/10'
            }`}
          >
            {pct(changePct)}
          </span>
          <span className="text-[13px] text-white/40 tabular-nums">
            {up ? '+' : '-'}${usd(Math.abs(changeUsd))} · {range}
          </span>
        </div>
      </section>

      {/* Chart */}
      <section className="mt-5">
        <AreaChart values={series} positive={up} height={148} />
        <div className="px-5 mt-3 flex gap-1.5">
          {RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`flex-1 py-1.5 rounded-lg text-[12px] font-semibold transition-colors ${
                range === r ? 'bg-white/[0.09] text-white' : 'text-white/35 active:bg-white/[0.04]'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </section>

      {/* Actions */}
      <section className="px-5 mt-6 grid grid-cols-4 gap-2.5">
        <Action
          label="Send"
          onClick={onSend}
          icon={
            <>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 17.5V7m0 0l-4.2 4.2M12 7l4.2 4.2" />
              <path strokeLinecap="round" d="M5.5 19.5h13" />
            </>
          }
        />
        <Action
          label="Receive"
          onClick={onReceive}
          icon={
            <>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.5V17m0 0l4.2-4.2M12 17l-4.2-4.2" />
              <path strokeLinecap="round" d="M5.5 20h13" />
            </>
          }
        />
        <Action
          label="Swap"
          onClick={onSend}
          icon={
            <>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 17.5V5.8m0 0L4.3 9M7.5 5.8L10.7 9" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6.5v11.7m0 0L19.7 15M16.5 18.2L13.3 15" />
            </>
          }
        />
        <Action
          label="Earn"
          onClick={onEarn}
          icon={
            <>
              <path strokeLinecap="round" d="M4 19.5V14M9.3 19.5v-8M14.6 19.5v-4" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.6 8.2L17.2 4.5l3.3 3.7" />
              <path strokeLinecap="round" d="M19.9 19.5V5" />
            </>
          }
        />
      </section>

      {/* Split: available vs locked */}
      <section className="px-5 mt-6 grid grid-cols-2 gap-3">
        <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-4">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#16C784]" />
            <p className="text-[12px] text-white/45">Available</p>
          </div>
          <p className="text-[18px] font-semibold text-white mt-1.5 tabular-nums">
            {hidden ? '••••' : `$${usd(spotTotal)}`}
          </p>
          <p className="text-[11px] text-white/30 mt-0.5">Withdrawable</p>
        </div>
        <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-4">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7C5CFF]" />
            <p className="text-[12px] text-white/45">Locked</p>
          </div>
          <p className="text-[18px] font-semibold text-white mt-1.5 tabular-nums">
            {hidden ? '••••' : `$${usd(earn.principal)}`}
          </p>
          <p className="text-[11px] text-white/30 mt-0.5">{daysLeft} days left</p>
        </div>
      </section>

      {/* Earn teaser */}
      <section className="px-5 mt-3">
        <button
          onClick={onEarn}
          className="w-full text-left rounded-2xl p-4 border border-[#7C5CFF]/25 bg-gradient-to-br from-[#7C5CFF]/[0.14] to-transparent active:scale-[0.99] transition-transform"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#7C5CFF]/15 border border-[#7C5CFF]/30 flex items-center justify-center">
                <svg className="w-[18px] h-[18px] text-[#A992FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.9}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l2.5 2.5M12 21a9 9 0 100-18 9 9 0 000 18z" />
                </svg>
              </div>
              <div>
                <p className="text-[14px] font-medium text-white">Fixed term earning</p>
                <p className="text-[12px] text-white/45 mt-0.5">
                  {earn.monthlyRate}% monthly · matures 12 Dec
                </p>
              </div>
            </div>
            <svg className="w-4 h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>
      </section>

      {/* Assets */}
      <section className="mt-7">
        <div className="px-5 flex items-center justify-between mb-1">
          <h2 className="text-[15px] font-semibold text-white">Assets</h2>
          <span className="text-[12px] text-white/35 tabular-nums">{assets.length} tokens</span>
        </div>
        <div className="px-2">
          {assets.map((a) => {
            const value = a.amount * a.price;
            const positive = a.change24h >= 0;
            return (
              <button
                key={a.id}
                onClick={() => onAsset(a)}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl active:bg-white/[0.04] transition-colors"
              >
                <CoinIcon symbol={a.symbol} color={a.color} />
                <div className="min-w-0 flex-1 text-left">
                  <p className="text-[14px] font-medium text-white truncate">{a.name}</p>
                  <p className="text-[12px] text-white/40 tabular-nums mt-0.5">
                    {crypto(a.amount, a.symbol)}
                  </p>
                </div>
                <Sparkline values={a.spark} positive={positive} />
                <div className="text-right shrink-0 w-[86px]">
                  <p className="text-[14px] font-medium text-white tabular-nums">
                    {hidden ? '••••' : `$${usd(value)}`}
                  </p>
                  <p
                    className={`text-[12px] font-medium tabular-nums mt-0.5 ${
                      positive ? 'text-[#16C784]' : 'text-[#EA3943]'
                    }`}
                  >
                    {pct(a.change24h)}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
};

const Action: React.FC<{ label: string; onClick: () => void; icon: React.ReactNode }> = ({
  label,
  onClick,
  icon,
}) => (
  <button onClick={onClick} className="flex flex-col items-center gap-2 group">
    <div className="w-full h-[52px] rounded-2xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-white group-active:scale-95 group-active:bg-white/[0.1] transition-all">
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.9}>
        {icon}
      </svg>
    </div>
    <span className="text-[11px] font-medium text-white/55">{label}</span>
  </button>
);

export default Wallet;
