export const SOFT_DEADLINE = new Date("2026-05-31T11:00:00-08:00");
export const HARD_DEADLINE = new Date("2026-05-31T12:00:00-08:00");

export type SubmissionLockState = "open" | "soft-warning" | "locked";

export function getSubmissionLockState(now: Date = new Date()): SubmissionLockState {
	if (now.getTime() >= HARD_DEADLINE.getTime()) return "locked";
	if (now.getTime() >= SOFT_DEADLINE.getTime()) return "soft-warning";
	return "open";
}

export function formatDeadline(date: Date): string {
	return date.toLocaleString("en-US", {
		timeZone: "America/Los_Angeles",
		month: "long",
		day: "numeric",
		hour: "numeric",
		minute: "2-digit",
		timeZoneName: "short",
	});
}
