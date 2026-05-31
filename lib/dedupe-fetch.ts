// Per-key time-based dedupe for client-side fetches.
// Collapses rapid refetches (e.g. visibility + interval + focus) into one call,
// and caches the last value so consumers within the TTL window get it instead of undefined.
const lastRun = new Map<string, number>();
const lastValue = new Map<string, unknown>();
const inFlight = new Map<string, Promise<unknown>>();

export async function dedupedFetch<T>(
	key: string,
	fn: () => Promise<T>,
	minIntervalMs: number,
): Promise<T | undefined> {
	const existing = inFlight.get(key) as Promise<T> | undefined;
	if (existing) return existing;

	const last = lastRun.get(key) ?? 0;
	if (Date.now() - last < minIntervalMs) {
		return lastValue.has(key) ? (lastValue.get(key) as T) : undefined;
	}

	const p = (async () => {
		try {
			const result = await fn();
			lastRun.set(key, Date.now());
			lastValue.set(key, result);
			return result;
		} finally {
			inFlight.delete(key);
		}
	})();
	inFlight.set(key, p);
	return p;
}
