import React, { useEffect, useId, useMemo, useRef, useState } from 'react';

// Catmull-Rom through the points, converted to cubic beziers, so the line reads
// as a smooth market curve rather than a jagged polyline.
const smoothPath = (pts: { x: number; y: number }[]): string => {
  if (pts.length < 2) return '';
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
  }
  return d;
};

const toPoints = (values: number[], w: number, h: number, pad: number) => {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  return values.map((v, i) => ({
    x: (i / (values.length - 1 || 1)) * w,
    y: pad + (1 - (v - min) / range) * (h - pad * 2),
  }));
};

export const AreaChart: React.FC<{ values: number[]; positive?: boolean; height?: number }> = ({
  values,
  positive = true,
  height = 150,
}) => {
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);
  // Match the viewBox to the real pixel width so the end dot stays a circle
  // instead of being stretched by a non-uniform scale.
  const [w, setW] = useState(360);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width;
      if (width > 0) setW(width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const stroke = positive ? '#16C784' : '#EA3943';
  const inset = 6; // keeps the end marker clear of the right edge

  const { line, area, last } = useMemo(() => {
    const pts = toPoints(values, Math.max(10, w - inset), height, 12);
    const l = smoothPath(pts);
    return {
      line: l,
      area: `${l} L ${pts[pts.length - 1].x} ${height} L 0 ${height} Z`,
      last: pts[pts.length - 1],
    };
  }, [values, height, w]);

  return (
    <div ref={ref} className="w-full" style={{ height }}>
    <svg viewBox={`0 0 ${w} ${height}`} width={w} height={height}>
      <defs>
        <linearGradient id={`fill-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.22" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#fill-${id})`} />
      <path
        d={line}
        fill="none"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {last && (
        <>
          <circle cx={last.x} cy={last.y} r="7" fill={stroke} opacity="0.18" />
          <circle cx={last.x} cy={last.y} r="3" fill={stroke} />
        </>
      )}
    </svg>
    </div>
  );
};

export const Sparkline: React.FC<{ values: number[]; positive: boolean }> = ({
  values,
  positive,
}) => {
  const w = 64;
  const h = 26;
  const d = useMemo(() => smoothPath(toPoints(values, w, h, 3)), [values]);
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} className="shrink-0">
      <path
        d={d}
        fill="none"
        stroke={positive ? '#16C784' : '#EA3943'}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

// Circular progress used for the Earn term.
export const ProgressRing: React.FC<{ progress: number; size?: number; stroke?: number }> = ({
  progress,
  size = 92,
  stroke = 7,
}) => {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} className="shrink-0 -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="#7C5CFF"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - progress)}
        style={{ transition: 'stroke-dashoffset 700ms cubic-bezier(0.16,1,0.3,1)' }}
      />
    </svg>
  );
};
