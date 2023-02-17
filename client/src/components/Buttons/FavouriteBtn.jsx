import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as fHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as eHeart } from '@fortawesome/free-regular-svg-icons';
import styled from 'styled-components';
import { Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

const StyledButton = styled(Button).attrs({ variant: 'light' })`
	font-size: 1.2rem;
	border: ${(props) => (props.rounded !== 'true' ? 'none' : '')};
	border-radius: ${(props) => (props.rounded === 'true' ? '50%' : '0')};
	padding: ${(props) => (props.rounded === 'true' ? '0.25rem 0.5rem' : '0.5rem 1rem')};
	background: ${(props) => (props.rounded === 'true' ? '#f8f9fa' : 'transparent')};
	color: ${(props) => (props.isfav === 'true' ? '#ffc107' : '#000')};

	display: flex;
	align-items: center;
	justify-content: center;

	&:hover,
	&:active,
	&:focus {
		.fa-heart {
			color: ${(props) => (props.isfav === 'true' ? '#ffc107' : '#000')};
		}
	}
`;

export default function FavouriteBtn(props) {
	const { onToggle, rounded, isfav, title, label } = props;
	const heartIcon = isfav ? fHeart : eHeart;

	return (
		<StyledButton
			rounded={rounded ? rounded.toString() : 'false'}
			isfav={isfav ? isfav.toString() : 'false'}
			title={title || 'Save for later'}
			onClick={() => onToggle(!isfav)}
			className={`${props.className || ''} favourite-btn`}
		>
			{label && <span className="flex-grow-1 fs-7">{label}</span>}
			<FontAwesomeIcon icon={heartIcon} />
		</StyledButton>
	);
}

FavouriteBtn.propTypes = {
	isfav: PropTypes.bool
};
