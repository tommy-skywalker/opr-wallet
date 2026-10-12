import React, { useMemo, useState } from 'react';
import { Tx } from '../types';
import { usd, crypto, txTime, parseISO } from '../utils';
import { ScreenHeader} from './Ui';

const FILTERS = [
  ['all', 'All'],
  ['receive', 'Received'],
  ['earn', 'Earn'],
] as const;

type Filter = (typeof FILTERS)[number][0];

const ICONS: Record<string, React.ReactNode> = {
  receive: <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m0 0l6-6m-6 6l-6-6" />,
  send: <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m0 0l-6 6m6-6l6 6" />,
  'earn-lock': <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />,
  'earn-reward': <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />,
};

const Activity: React.FC<{ transactions: Tx[] }> = ({ transactions }) => {
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = useMemo(
    () =>
      transactions.filter((t) =>
        filter === 'all' ? true : filter === 'earn' ? t.kind.startsWith('earn') : t.kind === filter,
      ),
    [transactions, filter],
  );

  // Group by month so a long history stays scannable.
  const groups = useMemo(() => {
    const map = new Map<string, Tx[]>();
    filtered.forEach((t) => {
      const key = parseISO(t.date).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
      map.set(key, [...(map.get(key) || []), t]);
    });
    return [...map.entries()];
  }, [filtered]);

  return (
    <div className="pb-6">
      <ScreenHeader title="Activity" />

      <div className="px-5 pt-1 flex gap-2">
        {FILTERS.map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-3.5 py-1.5 rounded-full text-[12px] font-medium transition-colors border ${
              filter === key
                ? 'bg-white text-black border-white'
                : 'bg-white/[0.04] text-white/55 border-white/[0.08]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {groups.length === 0 ? (
        <p className="text-center text-[13px] text-white/35 py-20">No transactions yet.</p>
      ) : (
        groups.map(([month, txs]) => (
          <section key={month} className="mt-6">
            <h2 className="px-5 text-[12px] font-medium text-white/35 mb-1">{month}</h2>
            <div className="px-2">
              {txs.map((t) => {
                const incoming = t.kind === 'receive' || t.kind === 'earn-reward';
                const locked = t.kind === 'earn-lock';
                return (
                  <div
                    key={t.id}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl active:bg-white/[0.04] transition-colors"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${
                        locked
                          ? 'bg-[#7C5CFF]/10 border-[#7C5CFF]/25 text-[#A992FF]'
                          : incoming
                          ? 'bg-[#16C784]/10 border-[#16C784]/25 text-[#16C784]'
                          : 'bg-white/[0.06] border-white/10 text-white/70'
                      }`}
                    >
                      <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.9}>
                        {ICONS[t.kind]}
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[14px] font-medium text-white truncate">{t.title}</p>
                      <p className="text-[12px] text-white/40 mt-0.5 truncate">
                        {t.subtitle} · {txTime(t.date)}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p
                        className={`text-[14px] font-medium tabular-nums ${
                          locked ? 'text-white/70' : incoming ? 'text-[#16C784]' : 'text-white'
                        }`}
                      >
                        {locked ? '' : incoming ? '+' : '-'}
                        {crypto(t.amount, t.symbol)}
                      </p>
                      <p className="text-[12px] text-white/35 tabular-nums mt-0.5">${usd(t.usd)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))
      )}
    </div>
  );
};

export default Activity;
