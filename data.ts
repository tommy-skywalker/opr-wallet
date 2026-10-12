import { Asset, EarnPosition, Tx } from './types';

// Deterministic pseudo-random walk so charts look organic but never shift between loads.
const seeded = (seed: number) => {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
};

// A 24h sparkline that starts where the 24h change implies and ends at the
// current price, so the line direction always agrees with the percentage.
const spark = (seed: number, price: number, change24h: number, points = 24): number[] => {
  const rnd = seeded(seed);
  const start = price / (1 + change24h / 100);
  const noise: number[] = [];
  let momentum = 0;
  let level = 0;
  for (let i = 0; i < points; i++) {
    momentum = momentum * 0.75 + (rnd() - 0.5) * 0.6;
    level = level * 0.9 + momentum;
    noise.push(level);
  }
  const peak = Math.max(...noise.map(Math.abs)) || 1;
  return noise.map((n, i) => {
    const p = i / (points - 1);
    const base = start + (price - start) * p;
    return base + (n / peak) * price * 0.004 * Math.sin(Math.PI * p);
  });
};

const walk = (seed: number, points: number, end: number, volatility: number): number[] => {
  const rnd = seeded(seed);
  const out: number[] = [];
  let v = end * (0.82 + rnd() * 0.12);
  for (let i = 0; i < points; i++) {
    const drift = (end - v) / (points - i || 1);
    v = v + drift + (rnd() - 0.5) * end * volatility;
    out.push(v);
  }
  out[out.length - 1] = end;
  return out;
};

// Spot holdings total exactly $345.00
export const ASSETS: Asset[] = [
  {
    id: 'usdt',
    symbol: 'USDT',
    name: 'Tether',
    network: 'Ethereum',
    amount: 123.694739,
    price: 0.9998,
    change24h: -0.02,
    color: '#26A17B',
    spark: spark(11, 0.9998, -0.02),
    address: '0x7A3f91C2b4E8d5A6F1c09B3e7D2a845C6E0f12Ab',
  },
  {
    id: 'eth',
    symbol: 'ETH',
    name: 'Ethereum',
    network: 'Ethereum',
    amount: 0.04517382,
    price: 2641.07,
    change24h: -0.92,
    color: '#627EEA',
    spark: spark(23, 2641.07, -0.92),
    address: '0x7A3f91C2b4E8d5A6F1c09B3e7D2a845C6E0f12Ab',
  },
  {
    id: 'btc',
    symbol: 'BTC',
    name: 'Bitcoin',
    network: 'Bitcoin',
    amount: 0.00150382,
    price: 67842.15,
    change24h: 1.87,
    color: '#F7931A',
    spark: spark(37, 67842.15, 1.87),
    address: 'bc1q9h6yzs4k2v8xq3mr7t0plw5djn2eac6uf0g3vz',
  },
];

export const EARN: EarnPosition = {
  id: 'earn-dec-12',
  asset: 'USDC',
  principal: 25000,
  monthlyRate: 4.5,
  startDate: '2026-07-17',
  maturityDate: '2026-12-12',
  termDays: 148,
};

export const TRANSACTIONS: Tx[] = [
  {
    id: 'tx-6',
    kind: 'receive',
    title: 'Received BTC',
    subtitle: 'From bc1q4t...9xkm',
    symbol: 'BTC',
    amount: 0.00150382,
    usd: 102.02,
    date: '2026-10-09T14:22:00',
    status: 'confirmed',
  },
  {
    id: 'tx-5',
    kind: 'receive',
    title: 'Received ETH',
    subtitle: 'From 0x3Fa2...71Bd',
    symbol: 'ETH',
    amount: 0.04517382,
    usd: 119.31,
    date: '2026-10-02T09:41:00',
    status: 'confirmed',
  },
  {
    id: 'tx-4',
    kind: 'receive',
    title: 'Received USDT',
    subtitle: 'From 0x8C17...04Ee',
    symbol: 'USDT',
    amount: 123.694739,
    usd: 123.67,
    date: '2026-09-20T18:05:00',
    status: 'confirmed',
  },
  {
    id: 'tx-3',
    kind: 'earn-lock',
    title: 'Locked in Earn',
    subtitle: 'Fixed term, 4.5% monthly',
    symbol: 'USDC',
    amount: 25000,
    usd: 25000,
    date: '2026-07-17T11:30:00',
    status: 'confirmed',
  },
  {
    id: 'tx-fund-top-up',
    kind: 'receive',
    title: 'Received USDC',
    subtitle: 'From 0xD41b...2Caf',
    symbol: 'USDC',
    amount: 9172.67,
    usd: 9172.67,
    date: '2026-07-16T15:20:00',
    status: 'confirmed',
  },
  {
    id: 'tx-conv-3',
    kind: 'convert',
    title: 'Naira conversion',
    subtitle: '₦10,000,000 @ ₦1,390/$',
    symbol: 'USDC',
    amount: 7194.24,
    usd: 7194.24,
    date: '2026-07-15T10:12:00',
    status: 'confirmed',
  },
  {
    id: 'tx-conv-2',
    kind: 'convert',
    title: 'Naira conversion',
    subtitle: '₦7,000,000 @ ₦1,390/$',
    symbol: 'USDC',
    amount: 5035.97,
    usd: 5035.97,
    date: '2026-07-09T13:48:00',
    status: 'confirmed',
  },
  {
    id: 'tx-conv-1',
    kind: 'convert',
    title: 'Naira conversion',
    subtitle: '₦5,000,000 @ ₦1,390/$',
    symbol: 'USDC',
    amount: 3597.12,
    usd: 3597.12,
    date: '2026-07-02T09:05:00',
    status: 'confirmed',
  },
];

// Portfolio value history as dated points, so the chart can be scrubbed.
export interface SeriesPoint {
  t: number; // epoch ms
  v: number;
}

const DAY = 86400000;
const NOW = Date.now();

// A window of market-shaped movement. The noise is mean reverting with momentum,
// which gives runs and pullbacks rather than a straight ramp, and it tapers at
// both ends so the window lands on exact start and end values. Amplitude is in
// dollars rather than a percentage, because this portfolio is dominated by a
// fixed locked position and only the small spot holdings actually move.
const window_ = (
  seed: number,
  points: number,
  spanDays: number,
  startValue: number,
  endValue: number,
  amplitude: number,
): SeriesPoint[] => {
  const rnd = seeded(seed);
  const noise: number[] = [];
  let momentum = 0;
  let level = 0;
  for (let i = 0; i < points; i++) {
    momentum = momentum * 0.78 + (rnd() - 0.5) * 0.6;
    level = level * 0.9 + momentum;
    noise.push(level);
  }
  const peak = Math.max(...noise.map(Math.abs)) || 1;

  return noise.map((n, i) => {
    const p = points === 1 ? 1 : i / (points - 1);
    const base = startValue + (endValue - startValue) * p;
    const taper = Math.sin(Math.PI * p); // 0 at both ends
    return {
      t: NOW - spanDays * (1 - p) * DAY,
      v: base + (n / peak) * amplitude * taper,
    };
  });
};

// The wallet was funded 87 days ago, so "all" starts there. Movement is modest
// by design: 25,000 of the 25,345 is locked at a fixed rate and does not swing.
export const PORTFOLIO_SERIES: Record<string, SeriesPoint[]> = {
  '1D': window_(101, 26, 1, 25338, 25345, 9),
  '1W': window_(202, 40, 7, 25321, 25345, 15),
  '1M': window_(303, 46, 30, 25266, 25345, 32),
  ALL: window_(404, 70, 87, 25180, 25345, 52),
};

export const WALLET_ADDRESS = '0x7A3f91C2b4E8d5A6F1c09B3e7D2a845C6E0f12Ab';
