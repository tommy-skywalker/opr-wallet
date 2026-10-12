import { Asset, EarnPosition, Tx } from './types';

// Deterministic pseudo-random walk so charts look organic but never shift between loads.
const seeded = (seed: number) => {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
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
    amount: 124.2,
    price: 1.0,
    change24h: 0.01,
    color: '#26A17B',
    spark: walk(11, 24, 1.0, 0.004),
    address: '0x7A3f91C2b4E8d5A6F1c09B3e7D2a845C6E0f12Ab',
  },
  {
    id: 'eth',
    symbol: 'ETH',
    name: 'Ethereum',
    network: 'Ethereum',
    amount: 0.045,
    price: 2640,
    change24h: -0.86,
    color: '#627EEA',
    spark: walk(23, 24, 2640, 0.02),
    address: '0x7A3f91C2b4E8d5A6F1c09B3e7D2a845C6E0f12Ab',
  },
  {
    id: 'btc',
    symbol: 'BTC',
    name: 'Bitcoin',
    network: 'Bitcoin',
    amount: 0.0015,
    price: 68000,
    change24h: 2.14,
    color: '#F7931A',
    spark: walk(37, 24, 68000, 0.018),
    address: 'bc1q9h6yzs4k2v8xq3mr7t0plw5djn2eac6uf0g3vz',
  },
];

export const EARN: EarnPosition = {
  id: 'earn-dec-12',
  asset: 'USDC',
  principal: 25000,
  apy: 8.4,
  startDate: '2026-09-13',
  maturityDate: '2026-12-12',
  termDays: 90,
};

export const TRANSACTIONS: Tx[] = [
  {
    id: 'tx-6',
    kind: 'receive',
    title: 'Received BTC',
    subtitle: 'From bc1q4t...9xkm',
    symbol: 'BTC',
    amount: 0.0015,
    usd: 102,
    date: '2026-10-09T14:22:00',
    status: 'confirmed',
  },
  {
    id: 'tx-5',
    kind: 'receive',
    title: 'Received ETH',
    subtitle: 'From 0x3Fa2...71Bd',
    symbol: 'ETH',
    amount: 0.045,
    usd: 118.8,
    date: '2026-10-02T09:41:00',
    status: 'confirmed',
  },
  {
    id: 'tx-4',
    kind: 'receive',
    title: 'Received USDT',
    subtitle: 'From 0x8C17...04Ee',
    symbol: 'USDT',
    amount: 124.2,
    usd: 124.2,
    date: '2026-09-20T18:05:00',
    status: 'confirmed',
  },
  {
    id: 'tx-3',
    kind: 'earn-lock',
    title: 'Locked in Earn',
    subtitle: '90 day fixed term',
    symbol: 'USDC',
    amount: 25000,
    usd: 25000,
    date: '2026-09-13T11:30:00',
    status: 'confirmed',
  },
  {
    id: 'tx-2',
    kind: 'receive',
    title: 'Received USDC',
    subtitle: 'From 0xD41b...2Caf',
    symbol: 'USDC',
    amount: 25000,
    usd: 25000,
    date: '2026-09-13T11:02:00',
    status: 'confirmed',
  },
];

// Portfolio value history. Ends at 25,345 (345 spot + 25,000 locked).
const TOTAL = 25345;
export const PORTFOLIO_SERIES: Record<string, number[]> = {
  '1W': walk(101, 28, TOTAL, 0.004),
  '1M': walk(202, 40, TOTAL, 0.008),
  '3M': walk(303, 60, TOTAL, 0.02),
  ALL: [
    ...walk(404, 20, 320, 0.05).map((v) => v),
    ...walk(505, 40, TOTAL, 0.01),
  ],
};

export const WALLET_ADDRESS = '0x7A3f91C2b4E8d5A6F1c09B3e7D2a845C6E0f12Ab';
