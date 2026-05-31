"use client";
import NavBar from "../_components/Navbar";
import LoaderGate from "../_components/LoaderGate";
import FullScreenLoading from "../_components/FullScreenLoader";


export default function HomeLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<FullScreenLoading />
            {/* everything that is covered by fullscreen loader */}
			<LoaderGate>
				<NavBar />
				<div className="relative min-h-screen text-neutral-900">{children}</div>
			</LoaderGate>
		</>
	);
}
