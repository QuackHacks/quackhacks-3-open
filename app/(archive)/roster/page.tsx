import { Suspense } from "react";
import { CircleOffIcon } from "lucide-react";
import { RosterPageClient } from "./RosterPageClient";
import { roster } from "@/lib/archive";
import type { PublicRosterUser } from "@/lib/types";

const CardSkeleton = () => (
	<div className="flex flex-col gap-2.5 p-5 bg-white border border-neutral-200 animate-pulse w-72 h-52">
		<div className="flex items-center gap-3">
			<div className="w-12 h-12 bg-brand-100" />
			<div className="flex flex-col gap-2 flex-1">
				<div className="h-4 bg-brand-100 rounded w-3/4" />
				<div className="h-3 bg-brand-50 rounded w-1/2" />
			</div>
		</div>
		<div className="flex flex-col gap-2 flex-1">
			<div className="h-3 bg-neutral-100 rounded w-full" />
			<div className="h-3 bg-neutral-100 rounded w-11/12" />
		</div>
		<div className="flex flex-wrap gap-1">
			<div className="h-4 w-20 bg-brand-100 rounded" />
			<div className="h-4 w-16 bg-neutral-100 rounded" />
		</div>
		<div className="h-px bg-neutral-100" />
		<div className="flex items-center gap-3">
			<div className="h-3 w-14 bg-neutral-100 rounded" />
			<div className="h-3 w-14 bg-neutral-100 rounded" />
			<div className="h-3 w-14 bg-neutral-100 rounded" />
		</div>
	</div>
);

const LoadingSkeleton = () => (
	<div className="flex-1 min-h-0 overflow-y-auto bg-brand-50">
		<div className="h-10 bg-brand-900 animate-pulse" />
		<div className="flex">
			<div className="flex-1 py-4 px-3">
				<div className="flex flex-row flex-wrap gap-4 justify-center">
					{[...Array(6)].map((_, i) => (
						<CardSkeleton key={i} />
					))}
				</div>
			</div>
		</div>
	</div>
);

const UsersProfileList = () => {
	const allUsers: PublicRosterUser[] = roster;

	if (!allUsers.length) {
		return (
			<div className="h-full flex flex-col items-center justify-center bg-brand-50 text-neutral-400 gap-3">
				<CircleOffIcon className="w-8 h-8 text-brand-300" />
				<p className="text-sm font-mono">No roster entries archived yet</p>
			</div>
		);
	}

	const schools = [...new Set(allUsers.map((u) => u.university).filter(Boolean))].filter(
		(school) => school?.toLowerCase() !== "other",
	) as string[];

	return <RosterPageClient users={allUsers} tickerItems={schools} />;
};

export default function RosterPage() {
	return (
		<Suspense fallback={<LoadingSkeleton />}>
			<UsersProfileList />
		</Suspense>
	);
}
