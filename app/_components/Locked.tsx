import { LockIcon, LockKeyholeIcon } from "lucide-react";

export default function ConditionalLock({
	children,
	condition = false,
	conditionReason,
}: {
	children: React.ReactNode;
	condition?: boolean;
	conditionReason?: string;
}) {
	if (condition) return children;

	return (
		<div className="relative group bg-neutral-300/30 dark:bg-neutral-700/30">
			<div className="opacity-20 pointer-events-none select-none cursor-not-allowed">
				{children}
			</div>
			<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
				<LockKeyholeIcon className="h-4.5 aspect-square stroke-[1.75] opacity-75 drop-shadow-sm/5" />
			</div>
			{conditionReason && (
				<div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 px-2 py-1 text-xs bg-neutral-800 text-neutral-100 whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50">
					{conditionReason}
				</div>
			)}
		</div>
	);
}
