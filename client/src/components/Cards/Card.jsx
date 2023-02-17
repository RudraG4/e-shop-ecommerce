import { createContext, forwardRef, useContext } from 'react';
import { Divider, Avatar } from 'components';
import PropType from 'prop-types';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const CardContext = createContext();

export default function Card({ direction, className, style, children }) {
	let _className = 'border rounded bg-white p-3 overflow-hidden';
	if (className) {
		_className = `${className} ${_className}`;
	}
	if (direction === 'horizontal') {
		_className = `hstack flex-wrap ${_className}`;
	} else {
		_className = `vstack ${_className}`;
	}
	return (
		<CardContext.Provider value={{ direction }}>
			<div className={`_card ${_className}`} style={style}>
				{children}
			</div>
		</CardContext.Provider>
	);
}

const Header = (props, ref) => {
	const { avatar, title, actions } = props;
	return (
		<div ref={ref} className="_card-header">
			<div className="hstack flex-wrap gap-1">
				{avatar && (
					<div className="_card-avatar me-3 flex-grow-0 flex-shrink-0">
						<Avatar rounded>{avatar}</Avatar>
					</div>
				)}
				{title && (
					<div className="_card-title d-block flex-grow-1">
						<h3 className="_card-title m-0">{title}</h3>
					</div>
				)}
				{actions && <div className="_card-actions m-0 flex-nowrap gap-3">{actions}</div>}
			</div>
			<Divider />
		</div>
	);
};

const Media = ({ src, height, width, alt, style, className }, ref) => {
	let _className = 'd-block mw-100';
	let _style = {
		backgroundSize: 'cover',
		backgroundRepeat: 'no-repeat',
		WebkitBackgroundPosition: 'center',
		backgroundPosition: 'center',
		objectFit: 'contain',
		...style
	};
	if (className) {
		_className = `${className} ${_className}`;
	}
	return (
		<img
			ref={ref}
			className={_className}
			style={_style}
			src={src}
			height={height}
			width={width}
			alt={alt}
		/>
	);
};

const Body = ({ className, children }, ref) => {
	const { direction } = useContext(CardContext);
	let _className = '';
	if (className) {
		_className = `${className} ${_className}`;
	}

	if (direction === 'horizontal') {
		_className = `hstack flex-wrap ${_className}`;
	} else {
		_className = `vstack ${_className}`;
	}

	return (
		<div ref={ref} className={`_card-body flex-grow-1 ${_className}`}>
			{children}
		</div>
	);
};

const ActionArea = ({ as, to, onClick, style, children }, ref) => {
	if (as === 'a') {
		return (
			<Link to={to} rel="no-referrer" referrerPolicy="no-referrer" style={style}>
				{children}
			</Link>
		);
	}
	return (
		<Button variant="default" className="p-0" onClick={onClick}>
			{children}
		</Button>
	);
};

Card.propTypes = {
	className: PropType.string,
	style: PropType.object
};

Card.Header = forwardRef(Header);
Card.Header.displayName = 'Card.Header';
Card.Header.propTypes = {
	avatar: PropType.element,
	title: PropType.oneOfType([PropType.string, PropType.element]),
	actions: PropType.element
};

Card.ActionArea = forwardRef(ActionArea);
Card.ActionArea.displayName = 'Card.ActionArea';

Card.Media = forwardRef(Media);
Card.Media.displayName = 'Card.Media';

Card.Body = forwardRef(Body);
Card.Body.displayName = 'Card.Body';
