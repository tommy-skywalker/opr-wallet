import React from 'react';
import { EarnPosition } from '../types';
import {
  usd,
  longDate,
  parseISO,
  startOfToday,
  daysBetween,
  accrued,
} from '../utils';
import { ProgressRing } from './Charts';
import { ScreenHeader} from './Ui';

const Earn: React.FC<{ earn: EarnPosition; onWithdraw: () => void }> = ({ earn, onWithdraw }) => {
  const today = startOfToday();
  const start = parseISO(earn.startDate);
  const end = parseISO(earn.maturityDate);

  const elapsed = Math.min(earn.termDays, Math.max(0, daysBetween(start, today)));
  const remaining = Math.max(0, daysBetween(today, end));
  const progress = Math.min(1, elapsed / earn.termDays);

  const earnedSoFar = accrued(earn.principal, earn.monthlyRate, elapsed);
  const totalInterest = accrued(earn.principal, earn.monthlyRate, earn.termDays);
  const payout = earn.principal + totalInterest;

  return (
    <div className="pb-6">
      <ScreenHeader title="Earn" />

      {/* Position card */}
      <section className="px-5 pt-2">
        <div className="rounded-3xl border border-[#7C5CFF]/25 bg-gradient-to-b from-[#7C5CFF]/[0.16] to-[#7C5CFF]/[0.02] p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[12px] text-white/50">Locked principal</p>
              <p className="text-[30px] leading-none font-semibold text-white tracking-tight tabular-nums mt-2">
                ${usd(earn.principal)}
              </p>
              <p className="text-[12px] text-white/45 mt-2">
                {usd(earn.principal, 0)} {earn.asset}
              </p>
            </div>
            <div className="relative">
              <ProgressRing progress={progress} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[17px] font-semibold text-white leading-none tabular-nums">
                  {Math.round(progress * 100)}%
                </span>
                <span className="text-[10px] text-white/40 mt-1">elapsed</span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-white/10 grid grid-cols-2 gap-4">
            <div>
              <p className="text-[11px] text-white/40">Earned so far</p>
              <p className="text-[16px] font-semibold text-[#16C784] tabular-nums mt-1">
                +${usd(earnedSoFar)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-white/40">Days remaining</p>
              <p className="text-[16px] font-semibold text-white tabular-nums mt-1">{remaining}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="px-5 mt-4">
        <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-5">
          <p className="text-[13px] font-medium text-white mb-4">Term</p>
          <Step done label="Deposit locked" sub={longDate(earn.startDate)} />
          <Step
            active
            label="Accruing interest"
            sub={`${earn.monthlyRate}% monthly, ${elapsed} of ${earn.termDays} days`}
          />
          <Step label="Unlocks" sub={longDate(earn.maturityDate)} last />
        </div>
      </section>

      {/* Payout summary */}
      <section className="px-5 mt-4">
        <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-5 space-y-3">
          <Row label="Principal" value={`$${usd(earn.principal)}`} />
          <Row label="Interest at maturity" value={`+$${usd(totalInterest)}`} accent />
          <div className="pt-3 border-t border-white/[0.07]">
            <Row label="Total payout" value={`$${usd(payout)}`} strong />
            <p className="text-[12px] text-white/40 mt-2">
              Credited to your available balance on {longDate(earn.maturityDate)}.
            </p>
          </div>
        </div>
      </section>

      <section className="px-5 mt-4">
        <button
          onClick={onWithdraw}
          className="w-full h-12 rounded-2xl bg-white/[0.06] border border-white/[0.09] text-white/70 text-[14px] font-medium active:scale-[0.99] transition-transform"
        >
          Withdraw early
        </button>
        <p className="text-[11px] text-white/30 text-center mt-3 leading-relaxed">
          Early withdrawal forfeits accrued interest. Funds unlock automatically at maturity.
        </p>
      </section>
    </div>
  );
};

const Step: React.FC<{ label: string; sub: string; done?: boolean; active?: boolean; last?: boolean }> = ({
  label,
  sub,
  done,
  active,
  last,
}) => (
  <div className="flex gap-3">
    <div className="flex flex-col items-center shrink-0">
      {done ? (
        <div className="w-[18px] h-[18px] rounded-full bg-[#16C784] flex items-center justify-center">
          <svg className="w-2.5 h-2.5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      ) : active ? (
        <span className="relative flex w-[18px] h-[18px] items-center justify-center">
          <span className="absolute w-[18px] h-[18px] rounded-full bg-[#7C5CFF]/50 animate-ping" />
          <span className="relative w-2.5 h-2.5 rounded-full bg-[#7C5CFF]" />
        </span>
      ) : (
        <div className="w-[18px] h-[18px] rounded-full border-2 border-white/15" />
      )}
      {!last && <div className={`w-px flex-1 my-1 ${done ? 'bg-[#16C784]/30' : 'bg-white/10'}`} />}
    </div>
    <div className={last ? '' : 'pb-4'}>
      <p className={`text-[13px] font-medium ${done || active ? 'text-white' : 'text-white/45'}`}>
        {label}
      </p>
      <p className="text-[12px] text-white/40 mt-0.5">{sub}</p>
    </div>
  </div>
);

const Row: React.FC<{ label: string; value: string; accent?: boolean; strong?: boolean }> = ({
  label,
  value,
  accent,
  strong,
}) => (
  <div className="flex items-center justify-between">
    <span className="text-[13px] text-white/45">{label}</span>
    <span
      className={`tabular-nums ${
        accent
          ? 'text-[14px] font-semibold text-[#16C784]'
          : strong
          ? 'text-[16px] font-semibold text-white'
          : 'text-[14px] font-medium text-white'
      }`}
    >
      {value}
    </span>
  </div>
);

export default Earn;
