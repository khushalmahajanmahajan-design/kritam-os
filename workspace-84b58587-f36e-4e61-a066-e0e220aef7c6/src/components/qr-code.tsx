"use client";

/**
 * Deterministic mock QR-code generator.
 *
 * Produces a convincing QR-style matrix (finder patterns at three corners +
 * hashed data modules) from any string. Renders as crisp SVG. Zero deps and
 * SSR-safe (pure computation, no browser APIs).
 */
interface QrCodeProps {
  value: string;
  size?: number;
  className?: string;
}

const MATRIX = 29;

function buildMatrix(data: string): boolean[][] {
  const size = MATRIX;
  const m: boolean[][] = Array.from({ length: size }, () =>
    Array<boolean>(size).fill(false)
  );

  // deterministic LCG seeded from the input string
  let h = 2166136261 >>> 0;
  for (let i = 0; i < data.length; i++) {
    h ^= data.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  const rand = () => {
    h = (Math.imul(h, 1664525) + 1013904223) >>> 0;
    return h / 0xffffffff;
  };

  // data modules
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      m[r][c] = rand() > 0.52;
    }
  }

  // finder pattern (7x7) with quiet zone
  const placeFinder = (or: number, oc: number) => {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const rr = or + r;
        const cc = oc + c;
        if (rr < 0 || cc < 0 || rr >= size || cc >= size) continue;
        if (r === -1 || r === 7 || c === -1 || c === 7) {
          m[rr][cc] = false; // quiet zone
          continue;
        }
        const border = r === 0 || r === 6 || c === 0 || c === 6;
        const center = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        m[rr][cc] = border || center;
      }
    }
  };
  placeFinder(0, 0);
  placeFinder(0, size - 7);
  placeFinder(size - 7, 0);

  // timing patterns
  for (let i = 8; i < size - 8; i++) {
    m[6][i] = i % 2 === 0;
    m[i][6] = i % 2 === 0;
  }

  // small alignment pattern bottom-right
  const ar = size - 9;
  const ac = size - 9;
  for (let r = -2; r <= 2; r++) {
    for (let c = -2; c <= 2; c++) {
      const rr = ar + r;
      const cc = ac + c;
      if (rr < 0 || cc < 0 || rr >= size || cc >= size) continue;
      const border = Math.abs(r) === 2 || Math.abs(c) === 2;
      const center = r === 0 && c === 0;
      m[rr][cc] = border || center;
    }
  }

  return m;
}

export function QrCode({ value, size = 180, className }: QrCodeProps) {
  const matrix = buildMatrix(value || "kritam-os");
  const cells = matrix.length;
  const cell = size / cells;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      role="img"
      aria-label="QR code"
      shapeRendering="crispEdges"
    >
      <rect width={size} height={size} fill="#ffffff" />
      {matrix.flatMap((row, r) =>
        row.map((on, c) =>
          on ? (
            <rect
              key={`${r}-${c}`}
              x={c * cell}
              y={r * cell}
              width={cell + 0.5}
              height={cell + 0.5}
              fill="#0a0a12"
            />
          ) : null
        )
      )}
    </svg>
  );
}
