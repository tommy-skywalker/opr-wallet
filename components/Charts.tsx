import React, { useEffect, useId, useMemo, useRef, useState } from 'react';

// Monotone cubic interpolation (Fritsch-Carlson). Unlike Catmull-Rom this never
// overshoots between points, so sharp moves stay sharp instead of producing
// phantom dips and spikes around them.
const smoothPath = (pts: { x: number; y: number }[]): string => {
  const n = pts.length;
  if (n < 2) return '';

  const dx: number[] = [];
  const slope: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    dx[i] = pts[i + 1].x - pts[i].x || 1e-6;
    slope[i] = (pts[i + 1].y - pts[i].y) / dx[i];
  }

  const tangent: number[] = [slope[0]];
  for (let i = 1; i < n - 1; i++) {
    if (slope[i - 1] * slope[i] <= 0) {
      tangent[i] = 0; // local extremum, flatten to avoid overshoot
    } else {
      const w1 = 2 * dx[i] + dx[i - 1];
      const w2 = dx[i] + 2 * dx[i - 1];
      tangent[i] = (w1 + w2) / (w1 / slope[i - 1] + w2 / slope[i]);
    }
  }
  tangent[n - 1] = slope[n - 2];

  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < n - 1; i++) {
    const h = dx[i] / 3;
    d += ` C ${pts[i].x + h} ${pts[i].y + tangent[i] * h}, ${pts[i + 1].x - h} ${
      pts[i + 1].y - tangent[i + 1] * h
    }, ${pts[i + 1].x} ${pts[i + 1].y}`;
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

export interface ChartPoint {
  t: number;
  v: number;
}

export const AreaChart: React.FC<{
  points: ChartPoint[];
  positive?: boolean;
  height?: number;
  onScrub?: (index: number | null) => void;
}> = ({ points, positive = true, height = 170, onScrub }) => {
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(360);
  const [active, setActive] = useState<number | null>(null);

  // Match the viewBox to real pixel width so circles stay circular.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      const width = e.contentRect.width;
      if (width > 0) setW(width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const stroke = positive ? '#16C784' : '#EA3943';
  const padY = 18;
  const insetR = 8;
  const plotW = Math.max(10, w - insetR);

  const { line, area, coords, baseY } = useMemo(() => {
    const values = points.map((p) => p.v);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    const toY = (v: number) => padY + (1 - (v - min) / range) * (height - padY * 2);
    const pts = values.map((v, i) => ({
      x: (i / (values.length - 1 || 1)) * plotW,
      y: toY(v),
    }));
    const l = smoothPath(pts);
    return {
      line: l,
      area: `${l} L ${pts[pts.length - 1].x} ${height} L 0 ${height} Z`,
      coords: pts,
      baseY: toY(values[0]),
    };
  }, [points, height, plotW]);

  const report = (i: number | null) => {
    setActive(i);
    onScrub?.(i);
  };

  const locate = (clientX: number) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = clientX - rect.left;
    const i = Math.round((x / plotW) * (points.length - 1));
    report(Math.min(points.length - 1, Math.max(0, i)));
  };

  const cursor = active === null ? null : coords[active];

  return (
    <div
      ref={ref}
      className="w-full relative select-none"
      style={{ height, touchAction: 'pan-y' }}
      onPointerDown={(e) => {
        try {
          e.currentTarget.setPointerCapture(e.pointerId);
        } catch {
          /* capture is a nicety, scrubbing still works without it */
        }
        locate(e.clientX);
      }}
      onPointerMove={(e) => {
        if (e.buttons > 0 || e.pointerType === 'touch') locate(e.clientX);
      }}
      onPointerUp={() => report(null)}
      onPointerCancel={() => report(null)}
      onPointerLeave={() => report(null)}
    >
      <svg viewBox={`0 0 ${w} ${height}`} width={w} height={height}>
        <defs>
          <linearGradient id={`fill-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={stroke} stopOpacity="0.26" />
            <stop offset="70%" stopColor={stroke} stopOpacity="0.04" />
            <stop offset="100%" stopColor={stroke} stopOpacity="0" />
          </linearGradient>
          <filter id={`glow-${id}`} x="-20%" y="-40%" width="140%" height="180%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
            </feMerge>
          </filter>
        </defs>

        {/* where the period started, so gain or loss reads at a glance */}
        <line
          x1="0"
          y1={baseY}
          x2={w}
          y2={baseY}
          stroke="rgba(255,255,255,0.16)"
          strokeWidth="1"
          strokeDasharray="2 4"
        />

        <path d={area} fill={`url(#fill-${id})`} />
        <path d={line} fill="none" stroke={stroke} strokeWidth="3" opacity="0.4" filter={`url(#glow-${id})`} />
        <path d={line} fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

        {cursor ? (
          <g>
            <line x1={cursor.x} y1="0" x2={cursor.x} y2={height} stroke="rgba(255,255,255,0.28)" strokeWidth="1" />
            <circle cx={cursor.x} cy={cursor.y} r="9" fill={stroke} opacity="0.2" />
            <circle cx={cursor.x} cy={cursor.y} r="4.5" fill="#fff" stroke={stroke} strokeWidth="2.5" />
          </g>
        ) : (
          coords.length > 0 && (
            <>
              <circle cx={coords[coords.length - 1].x} cy={coords[coords.length - 1].y} r="8" fill={stroke} opacity="0.18" />
              <circle cx={coords[coords.length - 1].x} cy={coords[coords.length - 1].y} r="3.5" fill={stroke} />
            </>
          )
        )}
      </svg>
    </div>
  );
};

export const Sparkline: React.FC<{ values: number[]; positive: boolean }> = ({
  values,
  positive,
}) => {
  const w = 54;
  const h = 24;
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
