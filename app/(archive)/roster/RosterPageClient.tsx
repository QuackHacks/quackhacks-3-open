"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { RosterGrid } from "./RosterGrid";
import type { PublicRosterUser } from "@/lib/types";
import { SearchIcon, XIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "motion/react";

type UserWithImage = PublicRosterUser & { imageUrl?: string | null };

const kTickerCopies = 8;
const kPageSizeOptions = [20, 50, 100];
type FilterableRosterKey = "university" | "role_interest" | "track_interest";

// basically a copy of the home page ticker
const AllSchoolsTicker = ({ items }: { items: string[] }) => {
	const deduped = [...new Set(items)];
	if (!deduped.length) return null;

	const duration = Math.max(deduped.length * 2, 8);

	return (
		<div className="overflow-hidden bg-brand-900 text-white py-1.5 select-none">
			<div
				className="flex flex-nowrap w-max"
				style={{ animation: `slow-scroll-banner-horizontal ${duration}s linear infinite` }}
			>
				{[...Array(kTickerCopies)].map((_, i) => (
					<div key={i} className="flex flex-row items-center" aria-hidden={i > 0}>
						{deduped.map((school, j) => (
							<div key={j} className="flex flex-row items-center">
								<h2 className="whitespace-nowrap text-lg md:text-2xl tracking-wide font-instrument-serif px-6">
									{school}
								</h2>
								|
								<div className="bg-white w-0.5 h-[60%] shrink-0" />
							</div>
						))}
					</div>
				))}
			</div>
		</div>
	);
};

// filter option
const FilterChip = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
	<button
		onClick={onClick}
		className={`text-left text-xs px-3 py-1.5 border font-mono transition-all duration-150 cursor-pointer ${
			active
				? "bg-brand-500 text-white border-brand-500"
				: "bg-white text-neutral-600 border-neutral-200 hover:border-brand-400 hover:text-brand-700"
		}`}
	>
		{label}
	</button>
);

const FilterGroup = ({
	label,
	filterKey,
	options,
	activeFilters,
	toggleFilter,
}: {
	label: string;
	filterKey: FilterableRosterKey;
	options: string[];
	activeFilters: Partial<Record<FilterableRosterKey, string>>;
	toggleFilter: (key: FilterableRosterKey, value: string) => void;
}) => {
	const [groupSearch, setGroupSearch] = useState("");
	const scrollRef = useRef<HTMLDivElement>(null);
	const [showGradients, setShowGradients] = useState({ top: false, bottom: false });

	const visible = groupSearch
		? options.filter((o) => o.toLowerCase().includes(groupSearch.toLowerCase()))
		: options;

	const handleScroll = useCallback(() => {
		const el = scrollRef.current;
		if (el) {
			const canScrollUp = el.scrollTop > 0;
			const canScrollDown = el.scrollTop + el.clientHeight < el.scrollHeight;
			setShowGradients({ top: canScrollUp, bottom: canScrollDown });
		}
	}, []);

	useEffect(() => {
		handleScroll();
		window.addEventListener("resize", handleScroll);
		return () => window.removeEventListener("resize", handleScroll);
	}, [visible, handleScroll]);

	if (!options.length) return null;

	return (
		<div>
			<p className="text-[10px] font-mono font-bold uppercase tracking-superwide text-neutral-400 mb-2">
				{label} <span className="text-neutral-300">({options.length})</span>
			</p>

			{options.length > 10 && (
				<input
					value={groupSearch}
					onChange={(e) => setGroupSearch(e.target.value)}
					placeholder={`Filter ${label.toLowerCase()}...`}
					className="w-full px-2 py-1 mb-1.5 border border-neutral-200 bg-neutral-50 text-[11px] font-mono focus:outline-none focus:border-brand-400 transition-colors"
				/>
			)}
			<div className="relative">
				{/* Top Gradient */}
				<div
					className={`absolute top-0 left-0 right-0 h-6 bg-linear-to-b from-neutral-200 to-transparent pointer-events-none z-10 transition-opacity duration-200 ${
						showGradients.top ? "opacity-100" : "opacity-0"
					}`}
				/>

				<div
					ref={scrollRef}
					onScroll={handleScroll}
					className="flex flex-col gap-1 max-h-44 overflow-y-auto scrollbar-hide"
				>
					{visible.map((opt) => (
						<FilterChip
							key={opt}
							label={opt}
							active={activeFilters[filterKey] === opt}
							onClick={() => toggleFilter(filterKey, opt)}
						/>
					))}
					{groupSearch && visible.length === 0 && (
						<p className="text-[10px] font-mono text-neutral-300 py-1">No matches</p>
					)}
				</div>

				{/* Bottom Gradient */}
				<div
					className={`absolute bottom-0 left-0 right-0 h-6 bg-linear-to-t from-neutral-200 to-transparent pointer-events-none z-10 transition-opacity duration-200 ${
						showGradients.bottom ? "opacity-100" : "opacity-0"
					}`}
				/>
			</div>
		</div>
	);
};

export const RosterPageClient = ({
	users,
	tickerItems,
}: {
	users: UserWithImage[];
	tickerItems: string[];
}) => {
	const [search, setSearch] = useState("");
	const [activeFilters, setActiveFilters] = useState<Partial<Record<FilterableRosterKey, string>>>({});
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(kPageSizeOptions[0]);

	const toggleFilter = (key: FilterableRosterKey, value: string) => {
		setActiveFilters((prev) =>
			prev[key] === value
				? Object.fromEntries(Object.entries(prev).filter(([k]) => k !== key))
				: { ...prev, [key]: value },
		);
		setCurrentPage(1);
	};

	const handleSearch = (value: string) => {
		setSearch(value);
		setCurrentPage(1);
	};

	const handlePageSizeChange = (newSize: number) => {
		setPageSize(newSize);
		setCurrentPage(1);
	};

	const schools = [...new Set(users.map((u) => u.university).filter(Boolean))] as string[];
	const roles = [...new Set(users.map((u) => u.role_interest).filter(Boolean))] as string[];
	const tracks = [...new Set(users.map((u) => u.track_interest).filter(Boolean))] as string[];

	const filtered = useMemo(() => {
		return users.filter((u) => {
			const name = `${u.first_name ?? ""} ${u.last_name ?? ""}`.toLowerCase();
			if (
				search &&
				!name.includes(search.toLowerCase()) &&
				!(u.university ?? "").toLowerCase().includes(search.toLowerCase()) &&
				!(u.role_interest ?? "").toLowerCase().includes(search.toLowerCase())
			)
				return false;
			for (const [key, val] of Object.entries(activeFilters)) {
				if (u[key as FilterableRosterKey] !== val) return false;
			}
			return true;
		});
	}, [users, search, activeFilters]);

	const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
	const safePage = Math.min(currentPage, totalPages);

	const paginated = useMemo(() => {
		const start = (safePage - 1) * pageSize;
		return filtered.slice(start, start + pageSize);
	}, [filtered, safePage, pageSize]);

	const pageButtons = useMemo(() => {
		const delta = 2;
		const range: (number | "...")[] = [];
		const left = Math.max(2, safePage - delta);
		const right = Math.min(totalPages - 1, safePage + delta);

		range.push(1);
		if (left > 2) range.push("...");
		for (let i = left; i <= right; i++) range.push(i);
		if (right < totalPages - 1) range.push("...");
		if (totalPages > 1) range.push(totalPages);

		return range;
	}, [safePage, totalPages]);

	const activeFilterCount = Object.keys(activeFilters).length;

	return (
		<div className="flex-1 min-h-0 overflow-y-auto bg-brand-50">
			{tickerItems.length > 0 && <AllSchoolsTicker items={tickerItems} />}

			{/* mobile header */}
			<div className="lg:hidden px-6 pt-5 pb-3 bg-white border-b border-brand-200 flex flex-col gap-3">
				<div className="flex items-center gap-2">
					<div className="w-1.5 h-8 bg-brand-500" />
					<h1 className="text-2xl font-bold text-brand-900 font-space-grotesk">ROSTER</h1>
					<span className="text-xs font-mono text-neutral-400 ml-auto">
						{filtered.length === users.length
							? `${users.length} members`
							: `${filtered.length}/${users.length}`}
					</span>
				</div>
				<div className="relative">
					<SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
					<input
						value={search}
						onChange={(e) => handleSearch(e.target.value)}
						placeholder="Search members, schools..."
						className="w-full pl-9 pr-8 py-2.5 border border-neutral-200 bg-white text-sm font-mono focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-200 transition-colors"
					/>
					{search && (
						<button
							onClick={() => handleSearch("")}
							className="absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer"
						>
							<XIcon className="w-3.5 h-3.5 text-neutral-400 hover:text-neutral-600" />
						</button>
					)}
				</div>
			</div>

			<div className="flex gap-0">
				<main className="flex-1 min-w-0 py-4 px-3 flex flex-col">
					<RosterGrid
						users={paginated}
					/>

					{filtered.length > 0 && (
						<div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-brand-100 pt-6">
							<div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
								<span>Per page:</span>
								<select
									value={pageSize}
									onChange={(e) => handlePageSizeChange(Number(e.target.value))}
									className="bg-white border border-neutral-200 px-2 py-1 text-neutral-700 cursor-pointer focus:outline-none focus:border-brand-500 font-mono text-xs"
								>
									{kPageSizeOptions.map((s) => (
										<option key={s} value={s}>
											{s}
										</option>
									))}
								</select>
								<span>
									{`${(safePage - 1) * pageSize + 1}-${Math.min(safePage * pageSize, filtered.length)} of ${filtered.length}`}
								</span>
							</div>

							<div className="flex items-center gap-1">
								<button
									onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
									disabled={safePage === 1}
									className="p-1.5 text-neutral-400 hover:text-brand-700 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed transition-colors"
								>
									<ChevronLeft className="h-4 w-4" />
								</button>

								{pageButtons.map((btn, i) =>
									btn === "..." ? (
										<span
											key={`ellipsis-${i}`}
											className="px-1.5 text-neutral-300 select-none font-mono text-xs"
										>
											...
										</span>
									) : (
										<button
											key={btn}
											onClick={() => setCurrentPage(btn as number)}
											className={`w-8 h-8 text-xs font-mono font-medium transition-colors cursor-pointer ${
												safePage === btn
													? "bg-brand-500 text-white"
													: "text-neutral-400 hover:text-brand-700 hover:bg-brand-50"
											}`}
										>
											{btn}
										</button>
									),
								)}

								<button
									onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
									disabled={safePage === totalPages}
									className="p-1.5 text-neutral-400 hover:text-brand-700 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed transition-colors"
								>
									<ChevronRight className="h-4 w-4" />
								</button>
							</div>
						</div>
					)}
				</main>

				{/* right sidebar */}
				<motion.aside
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.5, delay: 0.15 }}
					className="w-60 shrink-0 border-l border-brand-200 bg-white p-6 hidden lg:flex flex-col gap-6 sticky top-0 h-dvh overflow-y-auto"
				>
					<p className="text-[10px] font-mono font-bold uppercase tracking-superwide text-brand-500 mb-1">
						Filter
					</p>

					{/* search */}
					<div className="relative">
						<SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
						<input
							value={search}
							onChange={(e) => handleSearch(e.target.value)}
							placeholder="Search..."
							className="w-full pl-9 pr-8 py-2.5 border border-neutral-200 bg-neutral-50 text-xs font-mono focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-200 transition-colors"
						/>
						{search && (
							<button
								onClick={() => handleSearch("")}
								className="absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer"
							>
								<XIcon className="w-3 h-3 text-neutral-400 hover:text-neutral-600" />
							</button>
						)}
					</div>

					<FilterGroup
						label="School"
						filterKey="university"
						options={schools}
						activeFilters={activeFilters}
						toggleFilter={toggleFilter}
					/>
					<FilterGroup
						label="Role Interest"
						filterKey="role_interest"
						options={roles}
						activeFilters={activeFilters}
						toggleFilter={toggleFilter}
					/>
					<FilterGroup
						label="Track"
						filterKey="track_interest"
						options={tracks}
						activeFilters={activeFilters}
						toggleFilter={toggleFilter}
					/>

					{activeFilterCount > 0 && (
						<button
							onClick={() => {
								setActiveFilters({});
								setCurrentPage(1);
							}}
							className="text-xs font-mono text-brand-600 hover:text-brand-800 font-medium text-left border-t border-brand-100 pt-3 transition-colors cursor-pointer"
						>
							CLEAR ALL FILTERS ({activeFilterCount})
						</button>
					)}
				</motion.aside>
			</div>

		</div>
	);
};
