import { useEffect, useState } from "react";

export type TailwindBreakpoint = "sm" | "md" | "lg" | "xl" | "2xl";

const kBreakpoints: Record<TailwindBreakpoint, string> = {
  sm:    "(min-width: 640px)",
  md:    "(min-width: 768px)",
  lg:    "(min-width: 1024px)",
  xl:    "(min-width: 1280px)",
  "2xl": "(min-width: 1536px)",
};

// either accept custom query or use tailwind built in ones (reccomended)
export default function useMediaQuery(query: TailwindBreakpoint | (string & {})) {
  const resolved = kBreakpoints[query as TailwindBreakpoint] ?? query;
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(resolved);
    setMatches(mql.matches);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [resolved]);

  return matches;
}