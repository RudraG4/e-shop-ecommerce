import { Image } from 'react-bootstrap';
import styled from 'styled-components';

const AvatarWrapper = styled.div`
	width: 40px;
	height: 40px;
	display: flex;
	flex-direction: row;
	align-items: center;
	align-self: stretch;
	justify-content: center;
	background: #e5e5e5;
	overflow: hidden;
	border-radius: 50%;
`;

export default function Avatar(props) {
	const { className, rounded, src, alt, width, height } = props;
	const { style = {}, title, children, onClick = () => {} } = props;
	let _className = '';
	if (rounded) {
		_className = `${_className} rounded-circle`;
	}
	if (className) {
		_className = `${_className} ${className}`;
	}
	const avatarStyle = { ...style };
	if (width !== undefined) {
		avatarStyle['width'] = `${width}px`;
	}
	if (height !== undefined) {
		avatarStyle['height'] = `${height}px`;
	}
	return (
		<AvatarWrapper className={_className} style={avatarStyle} onClick={onClick}>
			{src && <Image className={_className} fluid src={src} alt={alt} title={title} />}
			{!src && children}
		</AvatarWrapper>
	);
}
