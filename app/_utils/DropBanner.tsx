"use client";

import { useEffect, useState } from "react";

type DropBannerProps = {
	color: string; // must be a hex color
	message: string;
	visible: boolean;
	onClose: () => void;
};

export default function DropBanner({ color, message, visible, onClose }: DropBannerProps) {
	const [show, setShow] = useState(false);

	useEffect(() => {
		if (visible) {
			setShow(true);
			const timeout = setTimeout(() => {
				setShow(false);
				onClose();
			}, 5000);
			return () => clearTimeout(timeout);
		}
	}, [visible, onClose]);

	return (
		<div
			className={`text-center fixed top-6 left-1/2 transform -translate-x-1/2 min-w-[70vw] mt-4 px-6 py-3 border border-black rounded-md text-white bg-${color}-600 shadow-lg z-1000 transition-all duration-500 font-sans font-bold tracking-wider ${
				show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10 pointer-events-none"
			}`}
		>
			{message}
		</div>
	);
}
