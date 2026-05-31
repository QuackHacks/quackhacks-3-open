"use client";

import { createContext, useCallback, useContext, useState } from "react";
import DropBanner from "./DropBanner";

type BannerContextType = {
	triggerBanner: (message: string, color: "red" | "blue" | "green") => void;
};

const BannerContext = createContext<BannerContextType | undefined>(undefined);

export const useBanner = () => {
	const context = useContext(BannerContext);
	if (!context) {
		throw new Error("useBanner must be used within a BannerProvider");
	}
	return context;
};

export const BannerProvider = ({ children }: { children: React.ReactNode }) => {
	const [message, setMessage] = useState("");
	const [visible, setVisible] = useState(false);
	const [color, setColor] = useState<"red" | "blue" | "green">("red");

	const triggerBanner = useCallback((msg: string, color: "red" | "blue" | "green") => {
		setColor(color);
		setMessage(msg);
		setVisible(true);
	}, []);

	return (
		<BannerContext.Provider value={{ triggerBanner }}>
			{children}
			<DropBanner color={color} message={message} visible={visible} onClose={() => setVisible(false)} />
		</BannerContext.Provider>
	);
};
