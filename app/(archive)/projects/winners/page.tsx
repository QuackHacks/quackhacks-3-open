import { Metadata } from "next";
import { getWinnersView } from "@/lib/winners";
import { WinnersClient } from "./WinnersClient";

export const metadata: Metadata = {
	title: "Winners | QuackHacks",
	description: "The grand prize podium and every track champion from QuackHacks 3.",
};

export default function WinnersPage() {
	const view = getWinnersView();

	return <WinnersClient view={view} />;
}
