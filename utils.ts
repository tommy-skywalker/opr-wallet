// Shared formatting helpers.

export const usd = (v: number, decimals = 2): string =>
  v.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

// Splits a USD value so the cents can be rendered de-emphasised.
export const usdParts = (v: number): { whole: string; cents: string } => {
  const [whole, cents] = usd(v).split('.');
  return { whole, cents };
};

export const crypto = (amount: number, symbol: string): string => {
  const decimals = amount >= 1000 ? 2 : amount >= 1 ? 4 : 6;
  return `${amount.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  })} ${symbol}`;
};

export const pct = (v: number): string => `${v >= 0 ? '+' : ''}${v.toFixed(2)}%`;

export const parseISO = (iso: string): Date => {
  const [datePart] = iso.split('T');
  const [y, m, d] = datePart.split('-').map(Number);
  return new Date(y, m - 1, d);
};

export const startOfToday = (): Date => {
  const n = new Date();
  return new Date(n.getFullYear(), n.getMonth(), n.getDate());
};

export const daysBetween = (a: Date, b: Date): number =>
  Math.round((b.getTime() - a.getTime()) / 86400000);

export const longDate = (iso: string): string =>
  parseISO(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

export const shortDate = (iso: string): string =>
  parseISO(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });

export const txTime = (iso: string): string => {
  const d = new Date(iso);
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
};

export const truncate = (addr: string, lead = 6, tail = 4): string =>
  `${addr.slice(0, lead)}...${addr.slice(-tail)}`;

// Interest accrued on a fixed term position up to a given day count.
export const accrued = (principal: number, apy: number, days: number): number =>
  principal * (apy / 100) * (days / 365);
