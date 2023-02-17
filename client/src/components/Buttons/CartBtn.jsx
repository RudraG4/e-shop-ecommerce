import styled from 'styled-components';
import { Button } from 'react-bootstrap';
import { FaCartPlus } from 'react-icons/fa';

const StyledButton = styled(Button).attrs({ variant: 'light' })`
	font-size: 1.2rem;
	border: ${(props) => (props.rounded !== 'true' ? 'none' : '')};
	border-radius: ${(props) => (props.rounded === 'true' ? '50%' : '0')};
	padding: ${(props) => (props.rounded === 'true' ? '0.25rem 0.5rem' : '0.5rem 1rem')};
	background: ${(props) => (props.rounded === 'true' ? '#f8f9fa' : 'transparent')};
	color: #000;
	display: flex;
	align-items: center;
	justify-content: center;
`;

export default function CartBtn(props) {
	const { onClick, className, rounded, title, label } = props;
	return (
		<StyledButton
			rounded={rounded ? rounded.toString() : 'false'}
			title={title || 'Add to Cart'}
			onClick={onClick}
			className={`${className || ''} cart-btn`}
		>
			{label && <span className="flex-grow-1 fs-7">{label}</span>}
			<FaCartPlus />
		</StyledButton>
	);
}

CartBtn.defaultProps = {
	rounded: false,
	onClick: () => {}
};
