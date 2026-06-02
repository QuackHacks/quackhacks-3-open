"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { SearchIcon } from "lucide-react";

import { JUDGES_MAP } from "@/app/constants";
import type { Judge } from "@/lib/types";

function getCompany(role: string): string {
	const atSplit = role.split(/\s+@\s+/);
	if (atSplit.length > 1) return atSplit[1].trim();

	const atWord = role.split(/\s+at\s+/i);
	if (atWord.length > 1) return atWord[1].trim();

	return role.trim();
}

const sortedJudges: Judge[] = [...JUDGES_MAP].sort((a, b) => {
	const companyCmp = getCompany(a.role).localeCompare(getCompany(b.role));
	if (companyCmp !== 0) return companyCmp;
	return a.name.localeCompare(b.name);
});

const companyOptions: string[] = Array.from(
	new Set(sortedJudges.map((judge) => getCompany(judge.role))),
).sort((a, b) => a.localeCompare(b));

function JudgeInitials({ name }: { name: string }) {
	return (
		<div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-brand-100 text-sm font-bold font-mono text-brand-700 ring-1 ring-brand-300">
			{name
				.split(" ")
				.map((part) => part[0])
				.join("")
				.slice(0, 2)
				.toUpperCase()}
		</div>
	);
}

export default function JudgesPage() {
	const [query, setQuery] = useState("");
	const [company, setCompany] = useState("All");

	const filteredJudges = useMemo(() => {
		const q = query.trim().toLowerCase();

		return sortedJudges.filter((judge) => {
			if (company !== "All" && getCompany(judge.role) !== company) return false;
			if (!q) return true;

			return judge.name.toLowerCase().includes(q) || judge.role.toLowerCase().includes(q);
		});
	}, [query, company]);

	return (
		<main className="min-h-screen bg-neutral-100 text-neutral-900">
			<section className="border-b border-neutral-300 bg-white">
				<div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-14 md:px-8 md:py-20">
					<div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
						<div>
							<h1 className="font-liebling text-5xl font-bold leading-[0.9] text-neutral-950 md:text-7xl">
								Judges
							</h1>
						</div>
						<p className="max-w-xl text-sm leading-relaxed text-neutral-600 md:text-base">
							Meet the industry mentors, engineers, founders, and builders reviewing QuackHacks
							projects.
						</p>
					</div>

					<div className="grid gap-3 border-t border-neutral-200 pt-5 sm:grid-cols-3">
						<div>
							<p className="font-mono text-[10px] uppercase tracking-superwide text-neutral-400">
								Panel
							</p>
							<p className="mt-1 font-liebling text-3xl font-bold">{JUDGES_MAP.length}</p>
						</div>
						<div>
							<p className="font-mono text-[10px] uppercase tracking-superwide text-neutral-400">
								Organizations
							</p>
							<p className="mt-1 font-liebling text-3xl font-bold">{companyOptions.length}</p>
						</div>
						<div>
							<p className="font-mono text-[10px] uppercase tracking-superwide text-neutral-400">
								Format
							</p>
							<p className="mt-1 font-liebling text-3xl font-bold">Expo</p>
						</div>
					</div>
				</div>
			</section>

			<section className="mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-12">
				<div className="mb-8 flex flex-col gap-3 md:flex-row">
					<label className="relative flex-1">
						<span className="sr-only">Search judges</span>
						<SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
						<input
							type="search"
							value={query}
							onChange={(event) => setQuery(event.target.value)}
							placeholder="Search by name or role..."
							className="h-11 w-full border-2 border-neutral-300 bg-white pl-9 pr-3 text-sm text-neutral-800 transition-colors placeholder:text-neutral-400 focus:border-brand-500 focus:outline-none"
						/>
					</label>
					<label className="md:w-72">
						<span className="sr-only">Filter judges by company</span>
						<select
							value={company}
							onChange={(event) => setCompany(event.target.value)}
							className="h-11 w-full border-2 border-neutral-300 bg-white px-3 text-sm text-neutral-800 transition-colors focus:border-brand-500 focus:outline-none"
						>
							<option value="All">All companies</option>
							{companyOptions.map((option) => (
								<option key={option} value={option}>
									{option}
								</option>
							))}
						</select>
					</label>
				</div>

				{filteredJudges.length === 0 ? (
					<p className="border border-dashed border-neutral-300 bg-white p-6 font-mono text-sm text-neutral-500">
						No judges match your filters.
					</p>
				) : (
					<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
						{filteredJudges.map((judge, index) => (
							<motion.article
								key={`${judge.name}-${judge.role}`}
								initial={{ opacity: 0, y: 28 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true, amount: 0.15, margin: "0px 0px -60px 0px" }}
								transition={{
									duration: 0.45,
									ease: "easeOut",
									delay: (index % 3) * 0.05,
								}}
								className="group flex min-h-56 flex-col items-center border-2 border-dashed border-neutral-300 bg-white p-6 text-center transition-colors hover:border-brand-500"
							>
								{judge.headshotPath ? (
									<Image
										src={judge.headshotPath}
										alt={judge.name}
										width={160}
										height={160}
										sizes="80px"
										loading="lazy"
										className="mb-4 h-20 w-20 rounded-full object-cover ring-1 ring-neutral-200"
									/>
								) : (
									<JudgeInitials name={judge.name} />
								)}
								<h2 className="font-instrument-serif text-xl font-bold leading-tight text-neutral-900 transition-colors group-hover:text-brand-700">
									{judge.name}
								</h2>
								<p className="mt-2 font-mono text-[11px] uppercase leading-relaxed tracking-wider text-neutral-500">
									{judge.role}
								</p>
							</motion.article>
						))}
					</div>
				)}
			</section>
		</main>
	);
}
