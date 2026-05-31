"use client";

import { useEffect } from "react";

declare global {
	interface Window {
		__qhLandingPerf?: Record<string, number>;
	}
}

export default function LandingPerformanceMonitor() {
	useEffect(() => {
		if (process.env.NODE_ENV !== "development") return;

		const metrics: Record<string, number> = {};
		const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
		if (nav) {
			metrics.ttfb = Math.round(nav.responseStart);
			metrics.domContentLoaded = Math.round(nav.domContentLoadedEventEnd);
		}

		const paintEntries = performance.getEntriesByType("paint");
		for (const entry of paintEntries) {
			if (entry.name === "first-contentful-paint") {
				metrics.fcp = Math.round(entry.startTime);
			}
		}

		const observers: PerformanceObserver[] = [];
		let clsValue = 0;
		let lcpValue = 0;

		try {
			const lcpObserver = new PerformanceObserver((list) => {
				const entries = list.getEntries();
				const lastEntry = entries.at(-1);
				if (lastEntry) lcpValue = lastEntry.startTime;
			});
			lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });
			observers.push(lcpObserver);
		} catch {
			// unsupported browser
		}

		try {
			const clsObserver = new PerformanceObserver((list) => {
				for (const entry of list.getEntries() as Array<PerformanceEntry & { value?: number; hadRecentInput?: boolean }>) {
					if (!entry.hadRecentInput && typeof entry.value === "number") {
						clsValue += entry.value;
					}
				}
			});
			clsObserver.observe({ type: "layout-shift", buffered: true });
			observers.push(clsObserver);
		} catch {
			// unsupported browser
		}

		const flushMetrics = () => {
			metrics.lcp = Math.round(lcpValue);
			metrics.cls = Number(clsValue.toFixed(4));
			window.__qhLandingPerf = metrics;
			console.table({ landing: metrics });
		};

		const timeoutId = window.setTimeout(flushMetrics, 5000);
		const onVisibilityChange = () => {
			if (document.visibilityState === "hidden") flushMetrics();
		};
		document.addEventListener("visibilitychange", onVisibilityChange);

		return () => {
			window.clearTimeout(timeoutId);
			document.removeEventListener("visibilitychange", onVisibilityChange);
			for (const observer of observers) observer.disconnect();
		};
	}, []);

	return null;
}
