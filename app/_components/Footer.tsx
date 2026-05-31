import React from "react";
import Link from "next/link";
import HomeButton from "./brand/HomeButton";
import { DiscordIcon, InstagramIcon, LinkedinIcon, TwitterIcon } from "./misc/OtherBrandIcons";

const SVG_TreeSprite1 = () => (
	<svg
		viewBox="0 0 7 10"
		xmlns="http://www.w3.org/2000/svg"
		fill="currentColor"
		shapeRendering="optimizeSpeed"
	>
		<rect x="3" y="6" width="1" height="1" />
		<rect x="3" y="5" width="1" height="1" />
		<rect x="2" y="5" width="1" height="1" />
		<rect x="1" y="5" width="1" height="1" />
		<rect x="4" y="4" width="1" height="1" />
		<rect x="4" y="3" width="1" height="1" />
		<rect x="5" y="4" width="1" height="1" />
		<rect x="3" y="4" width="1" height="1" />
		<rect x="3" y="2" width="1" height="1" />
		<rect x="3" y="1" width="1" height="1" />
		<rect x="3" y="0" width="1" height="1" />
		<rect x="2" y="1" width="1" height="1" />
		<rect x="4" y="1" width="1" height="1" />
		<rect x="2" y="3" width="1" height="1" />
		<rect x="3" y="7" width="1" height="1" />
		<rect x="2" y="7" width="1" height="1" />
		<rect x="1" y="8" width="1" height="1" />
		<rect x="0" y="8" width="1" height="1" />
		<rect x="4" y="6" width="1" height="1" />
		<rect x="6" y="7" width="1" height="1" />
		<rect x="5" y="7" width="1" height="1" />
		<rect x="3" y="8" width="1" height="1" />
		<rect x="3" y="9" width="1" height="1" />
	</svg>
);
const SVG_TreeSprite2 = () => (
	<svg
		viewBox="0 0 7 10"
		xmlns="http://www.w3.org/2000/svg"
		fill="currentColor"
		shapeRendering="optimizeSpeed"
	>
		<rect x="3" y="6" width="1" height="1" />
		<rect x="3" y="5" width="1" height="1" />
		<rect x="2" y="5" width="1" height="1" />
		<rect x="1" y="6" width="1" height="1" />
		<rect x="4" y="6" width="1" height="1" />
		<rect x="4" y="3" width="1" height="1" />
		<rect x="5" y="4" width="1" height="1" />
		<rect x="3" y="4" width="1" height="1" />
		<rect x="2" y="4" width="1" height="1" />
		<rect x="3" y="2" width="1" height="1" />
		<rect x="3" y="1" width="1" height="1" />
		<rect x="3" y="0" width="1" height="1" />
		<rect x="4" y="1" width="1" height="1" />
		<rect x="2" y="3" width="1" height="1" />
		<rect x="1" y="4" width="1" height="1" />
		<rect x="4" y="5" width="1" height="1" />
		<rect x="3" y="7" width="1" height="1" />
		<rect x="2" y="8" width="1" height="1" />
		<rect x="1" y="7" width="1" height="1" />
		<rect x="0" y="7" width="1" height="1" />
		<rect x="4" y="8" width="1" height="1" />
		<rect x="6" y="7" width="1" height="1" />
		<rect x="5" y="7" width="1" height="1" />
		<rect x="3" y="8" width="1" height="1" />
		<rect x="3" y="9" width="1" height="1" />
	</svg>
);
const SVG_TreeSprite3 = () => (
	<svg
		viewBox="0 0 8 11"
		xmlns="http://www.w3.org/2000/svg"
		fill="currentColor"
		shapeRendering="optimizeSpeed"
	>
		<rect x="3" y="7" width="1" height="1" />
		<rect x="3" y="6" width="1" height="1" />
		<rect x="2" y="6" width="1" height="1" />
		<rect x="2" y="7" width="1" height="1" />
		<rect x="1" y="6" width="1" height="1" />
		<rect x="0" y="6" width="1" height="1" />
		<rect x="4" y="7" width="1" height="1" />
		<rect x="5" y="6" width="1" height="1" />
		<rect x="4" y="4" width="1" height="1" />
		<rect x="3" y="5" width="1" height="1" />
		<rect x="4" y="5" width="1" height="1" />
		<rect x="2" y="4" width="1" height="1" />
		<rect x="5" y="4" width="1" height="1" />
		<rect x="6" y="4" width="1" height="1" />
		<rect x="3" y="3" width="1" height="1" />
		<rect x="1" y="4" width="1" height="1" />
		<rect x="3" y="1" width="1" height="1" />
		<rect x="4" y="2" width="1" height="1" />
		<rect x="3" y="0" width="1" height="1" />
		<rect x="2" y="2" width="1" height="1" />
		<rect x="3" y="8" width="1" height="1" />
		<rect x="2" y="9" width="1" height="1" />
		<rect x="1" y="8" width="1" height="1" />
		<rect x="0" y="8" width="1" height="1" />
		<rect x="4" y="9" width="1" height="1" />
		<rect x="6" y="8" width="1" height="1" />
		<rect x="7" y="8" width="1" height="1" />
		<rect x="5" y="8" width="1" height="1" />
		<rect x="3" y="9" width="1" height="1" />
		<rect x="3" y="10" width="1" height="1" />
	</svg>
);

const SVG_TreeSprite4 = () => (
	<svg
		viewBox="0 0 7 10"
		xmlns="http://www.w3.org/2000/svg"
		fill="currentColor"
		shapeRendering="optimizeSpeed"
	>
		<rect x="3" y="9" width="1" height="1" />
		<rect x="4" y="8" width="1" height="1" />
		<rect x="5" y="7" width="1" height="1" />
		<rect x="2" y="8" width="1" height="1" />
		<rect x="1" y="7" width="1" height="1" />
		<rect x="2" y="6" width="1" height="1" />
		<rect x="6" y="6" width="1" height="1" />
		<rect x="3" y="5" width="1" height="1" />
		<rect x="4" y="6" width="1" height="1" />
		<rect x="1" y="5" width="1" height="1" />
		<rect x="2" y="4" width="1" height="1" />
		<rect x="0" y="5" width="1" height="1" />
		<rect x="3" y="4" width="1" height="1" />
		<rect x="4" y="3" width="1" height="1" />
		<rect x="3" y="2" width="1" height="1" />
		<rect x="2" y="1" width="1" height="1" />
		<rect x="2" y="3" width="1" height="1" />
		<rect x="2" y="0" width="1" height="1" />
		<rect x="3" y="8" width="1" height="1" />
		<rect x="3" y="7" width="1" height="1" />
		<rect x="3" y="6" width="1" height="1" />
	</svg>
);

const SVG_TreeSprite5 = () => (
	<svg
		viewBox="0 0 7 11"
		xmlns="http://www.w3.org/2000/svg"
		fill="currentColor"
		shapeRendering="optimizeSpeed"
	>
		<rect x="3" y="9" width="1" height="1" />
		<rect x="3" y="10" width="1" height="1" />
		<rect x="4" y="8" width="1" height="1" />
		<rect x="5" y="7" width="1" height="1" />
		<rect x="1" y="7" width="1" height="1" />
		<rect x="2" y="6" width="1" height="1" />
		<rect x="6" y="6" width="1" height="1" />
		<rect x="3" y="5" width="1" height="1" />
		<rect x="4" y="6" width="1" height="1" />
		<rect x="5" y="6" width="1" height="1" />
		<rect x="4" y="4" width="1" height="1" />
		<rect x="5" y="4" width="1" height="1" />
		<rect x="1" y="5" width="1" height="1" />
		<rect x="1" y="3" width="1" height="1" />
		<rect x="1" y="6" width="1" height="1" />
		<rect x="2" y="4" width="1" height="1" />
		<rect x="0" y="6" width="1" height="1" />
		<rect x="3" y="4" width="1" height="1" />
		<rect x="4" y="3" width="1" height="1" />
		<rect x="3" y="2" width="1" height="1" />
		<rect x="3" y="1" width="1" height="1" />
		<rect x="2" y="3" width="1" height="1" />
		<rect x="3" y="0" width="1" height="1" />
		<rect x="3" y="8" width="1" height="1" />
		<rect x="2" y="8" width="1" height="1" />
		<rect x="0" y="8" width="1" height="1" />
		<rect x="3" y="7" width="1" height="1" />
		<rect x="3" y="6" width="1" height="1" />
	</svg>
);

// should count up to the # of tree sprite images we have
// map it
const treeImages = {
	1: SVG_TreeSprite1,
	2: SVG_TreeSprite2,
	3: SVG_TreeSprite3,
	4: SVG_TreeSprite4,
	5: SVG_TreeSprite5,
};
export const TreeSprite = ({
	variant,
	className = "",
}: {
	variant: 1 | 2 | 3 | 4 | 5;
	className?: string;
}) => {
	const Icon = treeImages[variant];
	return <div className={className}><Icon /></div>;
};

const kLinks = [
	{ href: "/", label: "HOME" },
	{ href: "/about", label: "ABOUT" },
	{ href: "/timeline", label: "TIMELINE" },
	{ href: "/roster", label: "ROSTER" },
	{ href: "/gallery", label: "BADGES" },
	{ href: "/projects", label: "PROJECTS" },
];
const kSocialLinks = [
	{ href: "https://www.instagram.com/quackhacksuo/", label: "INSTAGRAM", icon: InstagramIcon },
	// { href: "https://twitter.com", label: "TWITTER", icon: TwitterIcon },
	{ href: "https://discord.gg/qAPmEMpGt3", label: "DISCORD", icon: DiscordIcon },
	{ href: "https://www.linkedin.com/company/quackhacks/posts/", label: "LINKEDIN", icon: LinkedinIcon },
	// { href: "mailto:hello@quackhacks.com", label: "EMAIL", icon: "@" },
];

export function TreeFooterBar({ children }: { children: React.ReactNode }) {
	return <div className="relative h-12 w-full bg-brand-700 pointer-events-none">{children}</div>;
}

const Footer = React.memo(() => {
	return (
		<footer className="w-full flex flex-col">
			<div className="px-4 md:px-30 py-5 border-t border-neutral-300">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 py-6">
					<div className="text-center md:text-left">
						<div className="flex items-center gap-3 mb-6 justify-center md:justify-start">
							<div className="relative md:mr-4">
								<HomeButton />
							</div>
							<div className="text-2xl font-bold">QUACKHACKS</div>
						</div>
						<p className="text-sm text-neutral-400 leading-relaxed max-w-xs mx-auto md:mx-0">
							A 24-hour hackathon bringing together students, developers, and innovators to build whats
							awesome.
						</p>
						<p className="text-xs text-neutral-400 mt-4">© 2026 QuackHacks. All rights reserved.</p>
					</div>

					<div className="text-center md:text-left">
						<h3 className="text-sm font-bold tracking-widest mb-4 uppercase">NAVIGATE</h3>
						<nav className="flex flex-col gap-3 items-center md:items-start">
							{kLinks.map((link) => (
								<Link
									key={link.href}
									href={link.href}
									className="text-sm text-neutral-400 hover:text-brand-500 transition-colors"
								>
									{link.label}
								</Link>
							))}
						</nav>
					</div>

					<div className="text-center md:text-left">
						<h3 className="text-sm font-bold tracking-widest mb-4 uppercase">CONNECT</h3>
						<div className="flex flex-col gap-3 items-center md:items-start">
							{kSocialLinks.map((social) => (
								<a
									key={social.label}
									href={social.href}
									target="_blank"
									rel="noopener noreferrer"
									className="group flex items-center gap-3 text-sm text-neutral-400 hover:text-brand-500 transition-colors"
								>
									<div className="w-6 fill-neutral-400 group-hover:fill-brand-500 transition-colors">
										<social.icon />
									</div>
									{social.label}
								</a>
							))}
						</div>
					</div>
				</div>
			</div>

            {/* very bottom part */}
			<div className="mt-4 border-t border-neutral-300 bg-brand-700 overflow-hidden">
				<div className="relative mx-auto px-4 md:px-30 py-6">
					<div className="hidden mt-4 md:block absolute inset-0 pointer-events-none z-0">
						<TreeFooterBar>
							<TreeSprite variant={1} className="w-8 absolute bottom-0 left-[40px] text-white" />
							<TreeSprite variant={2} className="w-8 absolute bottom-0 left-[600px] text-white" />
							<TreeSprite variant={4} className="w-7 absolute bottom-0 right-[760px] text-white" />
							<TreeSprite variant={3} className="w-8 absolute bottom-0 right-[280px] text-white" />
							<TreeSprite variant={1} className="w-7 absolute bottom-0 right-[360px] text-white" />
						</TreeFooterBar>
					</div>

					<div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-neutral-100">
						<div className="flex flex-wrap gap-4 justify-center md:justify-start">
							<Link href="https://github.com/MLH/mlh-policies/blob/main/privacy-policy.md" className="hover:text-white transition-colors">
								Privacy Policy
							</Link>
							<Link href="/terms" className="hover:text-white transition-colors">
								Terms of Service
							</Link>
							<Link
								href="https://github.com/MLH/mlh-policies/blob/main/code-of-conduct.md"
								className="hover:text-white transition-colors"
							>
								Code of Conduct
							</Link>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
});
Footer.displayName = "Footer";
export default Footer;
