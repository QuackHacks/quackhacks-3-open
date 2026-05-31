


const MLHBadge = ({type} : {type: 'black' | 'red' | 'white' | 'blue' | 'gray' | 'yellow'}) => {
	return (
		<a
			id="mlh-trust-badge"
			href={`https://mlh.io/na?utm_source=na-hackathon&utm_medium=TrustBadge&utm_campaign=2026-season&utm_content=${type}`}
			target="_blank"
			rel="noopener noreferrer"
		>
			<img
				src={`https://s3.amazonaws.com/logged-assets/trust-badge/2026/mlh-trust-badge-2026-${type}.svg`}
				alt="Major League Hacking 2026 Hackathon Season"
				className="w-20 md:w-26"
			/>
		</a>
	);
};
export default MLHBadge;
