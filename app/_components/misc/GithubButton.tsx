import { GithubIcon } from "./OtherBrandIcons";

const GithubButton = ({ style = "fancy", href }: { style?: "plain" | "fancy"; href: string }) => {
	return style == "plain" ? (
		<a
			href={href}
			className="flex items-center w-fit px-2 py-1 gap-2 bg-purple-900 hover:bg-purple-600 transition-colors duration-300 text-white fill-white "
		>
			<div className="w-6">
				<GithubIcon />
			</div>
			<h3 className="font-sans font-semibold">Link With Github</h3>
		</a>
	) : (
		<a
			href={href}
            className="relative cursor-pointer overflow-hidden flex items-center justify-between w-fit px-5 py-2 rounded-sm bg-purple-900 hover:bg-purple-600 transition-colors duration-300 text-white fill-white shadow-[inset_1px_0.5px_0px_rgba(255,255,255,0.5),inset_-0.5px_-0.5px_0px_rgba(0,0,0,0.25)]"
		>
			<h3 className="font-sans font-semibold pr-15">Link With Github</h3>
			<div className="w-6 absolute right-5 top-1/2 -translate-y-1/2 opacity-50 scale-200 rotate-20">
				<GithubIcon />
			</div>
		</a>
	);
};

export default GithubButton;
