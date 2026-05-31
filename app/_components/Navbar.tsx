"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuIcon, XIcon } from "lucide-react";

import HomeButton from "./brand/HomeButton";
import MLHBadge from "./brand/MLHBadge";
import { kHomeLinks } from "../constants";

const kEaseTransition = { duration: 0.25, ease: "easeInOut" } as const;

function NavLink({
	href,
	label,
	onClick,
}: {
	href: string;
	label: string;
	onClick?: () => void;
}) {
	const pathname = usePathname();
	const active = pathname === href;

	return (
		<Link
			prefetch
			href={href}
			onClick={onClick}
			className={`relative text-sm font-medium tracking-wide transition-colors duration-200 pb-0.5 ${
				active ? "text-neutral-900" : "text-neutral-500 hover:text-neutral-800"
			}`}
		>
			{label}
			{active && (
				<motion.span
					layoutId="public-nav-underline"
					className="absolute inset-x-0 -bottom-px h-px bg-neutral-900"
					transition={{ type: "spring", stiffness: 380, damping: 30 }}
				/>
			)}
		</Link>
	);
}

function MobileMenu({
	open,
	onClose,
}: {
	open: boolean;
	onClose: () => void;
}) {
	useEffect(() => {
		document.body.style.overflow = open ? "hidden" : "";
		return () => {
			document.body.style.overflow = "";
		};
	}, [open]);

	return (
		<AnimatePresence>
			{open && (
				<motion.div
					className="md:hidden fixed inset-0 z-70 flex flex-col bg-neutral-100"
					initial={{ opacity: 0, x: "100%" }}
					animate={{ opacity: 1, x: 0 }}
					exit={{ opacity: 0, x: "100%" }}
					transition={kEaseTransition}
				>
					<div className="flex items-center justify-between px-5 py-4">
						<HomeButton />
						<button
							onClick={onClose}
							className="flex h-10 w-10 items-center justify-center rounded-md border border-neutral-300 bg-white"
							aria-label="Close menu"
						>
							<XIcon className="h-5 w-5" />
						</button>
					</div>
					<nav className="flex flex-col gap-1 px-3 py-2">
						{kHomeLinks.map((link, index) => (
							<motion.div
								key={link.href}
								initial={{ opacity: 0, x: 16 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ ...kEaseTransition, delay: 0.04 + index * 0.04 }}
							>
								<Link
									href={link.href}
									onClick={onClose}
									className="flex items-center px-4 py-3.5 rounded-sm font-sans text-xl font-medium text-neutral-600 hover:bg-white hover:text-neutral-900"
								>
									{link.label}
								</Link>
							</motion.div>
						))}
					</nav>
				</motion.div>
			)}
		</AnimatePresence>
	);
}

export default function NavBar() {
	const pathname = usePathname();
	const [hidden, setHidden] = useState(false);
	const [mobileOpen, setMobileOpen] = useState(false);

	useEffect(() => {
		let previous = window.scrollY;
		const onScroll = () => {
			const current = window.scrollY;
			setHidden(current > previous && current > 150);
			previous = current;
		};

		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	useEffect(() => {
		setMobileOpen(false);
	}, [pathname]);

	return (
		<>
			<motion.nav
				className="sticky top-0 z-50 w-full border-b border-gray-300 bg-neutral-200 text-neutral-900"
				animate={{ y: hidden ? "-100%" : "0%", opacity: hidden ? 0 : 1 }}
				transition={{ duration: 0.3, ease: "easeInOut", delay: hidden ? 0.5 : 0 }}
			>
				<div className="pl-3 md:pl-1 pr-3 w-full py-2">
					<div className="flex items-center justify-between md:grid md:grid-cols-[1fr_auto_1fr] md:gap-4 md:px-5">
						<div className="flex items-center justify-start">
							<HomeButton id="home-button-anchor" />
						</div>
						<div className="relative hidden md:flex items-center gap-7">
							{kHomeLinks.map((link) => (
								<NavLink key={link.href} href={link.href} label={link.label} />
							))}
						</div>
						<div className="hidden md:flex justify-end items-center w-full">
							<span className="font-mono text-[10px] uppercase tracking-[0.24em] text-neutral-500">
								2026
							</span>
						</div>
						<div className="md:hidden flex items-center justify-end z-80">
							<button
								onClick={() => setMobileOpen(true)}
								className="flex h-10 w-10 items-center justify-center rounded-md border border-neutral-300 bg-white"
								aria-label="Open menu"
							>
								<MenuIcon className="h-5 w-5" />
							</button>
						</div>
					</div>
				</div>
			</motion.nav>

			<AnimatePresence>
				{!hidden && pathname === "/" && (
					<motion.div
						className="fixed drop-shadow-[4px_8px_6px_rgba(0,0,0,0.18)] top-16.5 md:top-17 md:right-26 right-5 navbar z-40"
						initial={{ opacity: 0, y: -120 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -120 }}
						transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
					>
						<MLHBadge type="black" />
					</motion.div>
				)}
			</AnimatePresence>

			<MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
		</>
	);
}
