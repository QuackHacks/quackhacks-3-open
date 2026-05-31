"use client";

import NavBar from "@/app/_components/Navbar";

export default function ArchiveLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<NavBar />
			<div className="relative min-h-screen text-neutral-900">{children}</div>
		</>
	);
}
