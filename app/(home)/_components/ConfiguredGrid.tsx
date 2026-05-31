type FilledCells = Record<string, string>;

interface ConfigurableGridProps {
  cols: number;
  rows: number;
  cellSize?: number;
  strokeColor?: string;
  strokeWidth?: number;
  filledCells?: FilledCells;
  className?: string;
}
export function ConfiguredGrid({
  cols = 8,
  rows = 6,
  cellSize = 48,
  strokeColor = "#a3a3a3",
  strokeWidth = 1,
  filledCells = {},
  className = "",
}: ConfigurableGridProps) {
  const width = cols * cellSize;
  const height = rows * cellSize;

  // unique ID for the pattern to avoid collisions if multiple grids exist
  const patternId = `grid-${cols}-${rows}-${cellSize}`;
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={`pointer-events-none select-none ${className}`}
      style={{ display: "block", shapeRendering: "crispEdges" }}
    >
      <defs>
        <pattern
          id={patternId}
          width={cellSize}
          height={cellSize}
          patternUnits="userSpaceOnUse"
        >
          {/* Draws the top and left lines of a single cell */}
          <path
            d={`M ${cellSize} 0 L 0 0 0 ${cellSize}`}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
        </pattern>
      </defs>

      {/* 1. Background / Filled Cells */}
      <g>
        {Object.entries(filledCells).map(([key, color]) => {
          const [c, r] = key.split(",").map(Number);
          if (c < 0 || c >= cols || r < 0 || r >= rows) return null;
          return (
            <rect
              key={key}
              x={c * cellSize}
              y={r * cellSize}
              width={cellSize}
              height={cellSize}
              fill={color}
            />
          );
        })}
      </g>

      {/* 2. The Grid Overlay (repeats the pattern once over the whole area) */}
      <rect width={width} height={height} fill={`url(#${patternId})`} />

      {/* 3. Outer Border (to close the right and bottom edges) */}
      <rect
        width={width}
        height={height}
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
}