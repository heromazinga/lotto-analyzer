import { ballColor } from '@/lib/ui';

type Size = 'lg' | 'md' | 'sm';

const DIMS: Record<Size, { w: number; fs: number }> = {
  lg: { w: 48, fs: 18 },
  md: { w: 40, fs: 15 },
  sm: { w: 32, fs: 13 },
};

export function Ball({ n, size = 'md' }: { n: number; size?: Size }) {
  const { w, fs } = DIMS[size];
  const color = ballColor(n);
  return (
    <div
      style={{
        width: w,
        height: w,
        borderRadius: '50%',
        backgroundColor: color,
        color: '#1a1410',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        fontSize: fs,
        fontFamily: "'JetBrains Mono', monospace",
        boxShadow: `0 3px 8px ${color}55, inset 0 -2px 5px rgba(0,0,0,0.15), inset 0 2px 4px rgba(255,255,255,0.5)`,
        flexShrink: 0,
      }}
    >
      {n}
    </div>
  );
}

export function EmptySlot({ size = 'md' }: { size?: Size }) {
  const w = DIMS[size].w;
  return (
    <div
      style={{
        width: w,
        height: w,
        borderRadius: '50%',
        border: '2px dashed #c8b896',
        backgroundColor: 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#c8b896',
        fontSize: 14,
        fontWeight: 600,
        flexShrink: 0,
      }}
    >
      ?
    </div>
  );
}
