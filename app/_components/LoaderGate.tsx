"use client";
import { useState, useEffect } from "react";

export default function LoaderGate({ children }: { children: React.ReactNode }) {
	const [show, setShow] = useState(false);

	useEffect(() => {
		const isMobile = window.matchMedia("(max-width: 767px)").matches;

		if (isMobile || sessionStorage.getItem("hasSeenLoading")) {
			setShow(true);
			return;
		}

		const id = setInterval(() => {
			if (sessionStorage.getItem("hasSeenLoading")) {
				setShow(true);
				clearInterval(id);
			}
		}, 50);
		return () => clearInterval(id);
	}, []);

	return <div style={{ visibility: show ? "visible" : "hidden" }}>{children}</div>;
}
