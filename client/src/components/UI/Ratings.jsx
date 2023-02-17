import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as rStar, faStarHalfStroke as hStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as uStar } from '@fortawesome/free-regular-svg-icons';

export default function Ratings(props) {
	const {
		rating = 0,
		total = 5,
		readOnly,
		className,
		color,
		showLabel,
		onClick = (score) => {}
	} = props;

	const roundedValue = Math.round(rating * 2) / 2;
	const title = `${rating.toFixed(1)} out of ${total.toFixed(1)} stars`;
	const label = `${rating.toFixed(1)}`;

	return (
		<div className={`${className || ''} rating`}>
			<fieldset className="lh-1">
				<span
					className={`d-inline-flex ${readOnly ? 'pe-none' : 'pe-auto'}`}
					aria-disabled={readOnly ? 'true' : 'false'}
					title={title}
				>
					{[...Array(total)].map((_, i) => {
						const index = i + 1;
						let starIcon = uStar;
						if (index <= roundedValue) {
							starIcon = rStar;
						} else if (Math.abs(roundedValue - index) === 0.5) {
							starIcon = hStar;
						}
						return (
							<button
								className="btn border-0 p-0 m-0 opacity-100"
								disabled={readOnly ? true : false}
								key={i}
								onClick={() => onClick(index)}
								style={{ color }}
							>
								<FontAwesomeIcon icon={starIcon} />
							</button>
						);
					})}
				</span>
				{showLabel && <span className="ms-1 text-dark">{label}</span>}
			</fieldset>
		</div>
	);
}
