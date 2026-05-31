import QHLogo from "../../_assets/elements/transparentQHLogo.svg";

const BrandIcon = ({
	className = "",
	style,
}: {
	className?: string;
	style?: React.CSSProperties;
}) => {
	return (
		<div
			className={`aspect-square ${className}`}
			style={{
				WebkitMaskImage: `url(${QHLogo.src})`,
				maskImage: `url(${QHLogo.src})`,
				WebkitMaskRepeat: "no-repeat",
				maskRepeat: "no-repeat",
				WebkitMaskPosition: "center",
				maskPosition: "center",
				WebkitMaskSize: "contain",
				maskSize: "contain",
				...style,
			}}
		/>
	);
};
export default BrandIcon;
