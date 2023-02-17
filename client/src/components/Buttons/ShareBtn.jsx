import { RiShareFill } from 'react-icons/ri';
import styled from 'styled-components';
import { Button } from 'react-bootstrap';

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

export default function ShareBtn(props) {
	const { rounded, title, label, className = '' } = props;
	const { url, shareTitle, shareText } = props;
	const shareDetails = { url, title: shareTitle, text: shareText };

	const onShareClick = async () => {
		if (navigator?.share && url) {
			try {
				await navigator
					.share(shareDetails)
					.then(() => console.log('Hooray! Your content was shared to tha world'));
			} catch (error) {
				console.log(`Couldnt share the product: ${error}`);
			}
		} else {
			console.log('Web share is currently not supported on this browser');
		}
	};
	return (
		<StyledButton
			rounded={rounded ? rounded.toString() : 'false'}
			title={title || 'Share'}
			onClick={onShareClick}
			className={`${className} favourite-btn`}
		>
			{label && <span className="flex-grow-1 fs-7">{label}</span>}
			<RiShareFill />
		</StyledButton>
	);
}
