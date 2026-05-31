import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk, Instrument_Serif, DM_Serif_Display, DM_Sans } from "next/font/google";
import localFont from "next/font/local";
import { UserProvider } from "./_utils/UserProvider";
import { BannerProvider } from "./_utils/BannerProvider";
import Footer from "./_components/Footer";
import "./globals.css";

const Font_Geist = Geist({
	subsets: ["latin"],
	variable: "--font-geist-sans",
});
const Font_GeistMono = Geist_Mono({
	subsets: ["latin"],
	variable: "--font-geist-mono",
});
const Font_SpaceGrotesk = Space_Grotesk({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-space-grotesk",
});
const Font_InstrumentSerif = Instrument_Serif({
	weight: "400",
	style: "normal",
	subsets: ["latin"],
	display: "swap",
	variable: "--font-instrument-serif",
});
const Font_DMSerifDisplay = DM_Serif_Display({
	weight: "400",
	style: ["normal", "italic"],
	subsets: ["latin"],
	display: "swap",
	variable: "--font-dm-serif",
});
const Font_DMSans = DM_Sans({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-dm-sans",
});
const Font_Liebling = localFont({
	src: [
		{ path: "./_assets/fonts/Liebling_Black.woff2", weight: "900", style: "normal" },
		{ path: "./_assets/fonts/Liebling_Heavy.woff2", weight: "800", style: "normal" },
		{ path: "./_assets/fonts/Liebling_Bold.woff2", weight: "700", style: "normal" },
		{ path: "./_assets/fonts/Liebling_Medium.woff2", weight: "500", style: "normal" },
		{ path: "./_assets/fonts/Liebling_Regular.woff2", weight: "400", style: "normal" },
		{ path: "./_assets/fonts/Liebling_Light.woff2", weight: "300", style: "normal" },
		{ path: "./_assets/fonts/Liebling_Thin.woff2", weight: "100", style: "normal" },
	],
	variable: "--font-liebling",
	display: "swap",
});

export const metadata: Metadata = {
	title: "QuackHacks 3",
	description: "Archived QuackHacks 3 site.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			className={`${Font_Geist.variable} ${Font_GeistMono.variable} ${Font_SpaceGrotesk.variable} ${Font_Liebling.variable} ${Font_InstrumentSerif.variable} ${Font_DMSerifDisplay.variable} ${Font_DMSans.variable}`}
		>
			<body suppressHydrationWarning>
				<UserProvider user={null}>
					<BannerProvider>
						{children}
						<Footer />
					</BannerProvider>
				</UserProvider>
			</body>
		</html>
	);
}
