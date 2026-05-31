import { DiscordIcon } from "./OtherBrandIcons";

const DiscordButton = ({ style = 'fancy' }: { style?: 'plain' | 'fancy' }) => (
	style === 'plain' ? (
		<a
			href="https://discord.gg/qAPmEMpGt3"
			className="flex items-center w-fit px-2 py-1 gap-2 bg-blue-700 hover:bg-blue-500 duration-200 transition-colors fill-white text-white"
			target="_blank"
			rel="noopener noreferrer"
		>
			<div className="w-6">
				<DiscordIcon />
			</div>
			<h3 className="font-semibold font-sans">Our Discord Server</h3>
		</a>
	) : (
		<a
			href="https://discord.gg/qAPmEMpGt3"
			className="relative cursor-pointer overflow-hidden flex items-center justify-between w-fit px-5 py-2 rounded-sm bg-blue-700 hover:bg-blue-500 transition-colors duration-200 text-white fill-white shadow-[inset_1px_0.5px_0px_rgba(255,255,255,0.5),inset_-0.5px_-0.5px_0px_rgba(0,0,0,0.25)]"
			target="_blank"
			rel="noopener noreferrer"
		>
			<h3 className="font-sans font-semibold pr-15">Our Discord Server</h3>
			<div className="w-6 absolute right-5 top-1/2 -translate-y-1/2 opacity-50 scale-200 rotate-20">
				<DiscordIcon />
			</div>
		</a>
	)
);

export default DiscordButton;