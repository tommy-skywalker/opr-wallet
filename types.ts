export type Screen = 'wallet' | 'earn' | 'activity' | 'settings';

export interface Asset {
  id: string;
  symbol: string;
  name: string;
  network: string;
  amount: number;
  price: number;
  change24h: number; // percent
  color: string;
  spark: number[];
  address: string;
}

export interface EarnPosition {
  id: string;
  asset: string;
  principal: number;
  monthlyRate: number; // percent per month
  startDate: string; // ISO
  maturityDate: string; // ISO
  termDays: number;
}

export type TxKind = 'receive' | 'send' | 'convert' | 'earn-lock' | 'earn-reward';

export interface Tx {
  id: string;
  kind: TxKind;
  title: string;
  subtitle: string;
  symbol: string;
  amount: number; // in asset units
  usd: number;
  date: string; // ISO
  status: 'confirmed';
}
