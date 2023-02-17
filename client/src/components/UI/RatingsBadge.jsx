import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as rStar } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';

const RatingsBadgeWrapper = styled.div`
	background: white;
	padding: 0.25rem;
	border-radius: 0.375rem;
	box-shadow: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
`;

export default function RatingsBadge(props) {
	const { rating = 0, className, color } = props;
	const label = `${rating.toFixed(1)}`;

	return (
		<RatingsBadgeWrapper className={`${className || ''} rating-badge`}>
			<fieldset className="lh-1">
				<span>
					<FontAwesomeIcon icon={rStar} color={color} />
				</span>
				<span className="ms-1 text-dark">{label}</span>
			</fieldset>
		</RatingsBadgeWrapper>
	);
}
