import { useState, createContext, useContext, forwardRef } from 'react';
import { Stack } from 'react-bootstrap';

const DropDownContext = createContext();

const UpArrow = (props) => {
	const { style } = props;
	return (
		<svg
			width="3em"
			height="3em"
			viewBox="0 0 18 18"
			className="position-absolute translate-middle"
			style={style}
			fill="#fff"
		>
			<path d="M 9.039 7.496 L 14.265 12.88 L 3.813 12.88 L 9.039 7.496 Z"></path>
		</svg>
	);
};

const DownArrow = (props) => {
	return (
		<svg width="1em" height="1em" viewBox="0 0 15 15" fill="#ffff">
			<path d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
		</svg>
	);
};

const DropDown = ({ className, children }) => {
	const [show, toggle] = useState(false);

	const onmouseover = (event) => {
		toggle(true);
	};

	const onmouseout = (event) => {
		toggle(false);
	};

	return (
		<DropDownContext.Provider value={{ onmouseover, onmouseout, show }}>
			<div
				className={`${className || ''} dropdown d-block h-100`}
				onMouseOver={onmouseover}
				onMouseOut={onmouseout}
			>
				{children}
			</div>
		</DropDownContext.Provider>
	);
};

const Toggle = forwardRef(({ children, className }, ref) => {
	const { show } = useContext(DropDownContext);
	return (
		<Stack
			direction="horizontal"
			className={`${className || ''} dropdown-toggler align-items-end h-100`}
			aria-expanded={show}
			ref={ref}
		>
			<Stack direction="horizontal" className="align-items-end w-100">
				<div className="flex-grow-1 hstack align-items-end text-truncate p-2">
					{children}
				</div>
				<Stack className="vstack justify-content-end ps-0 p-2" style={{ maxWidth: '24px' }}>
					<DownArrow />
				</Stack>
			</Stack>
		</Stack>
	);
});

const Menu = forwardRef((props, ref) => {
	const { show } = useContext(DropDownContext);
	const { style = {} } = props;

	if (!show) return;

	const menuStyle = { marginTop: '2px', ...style };
	const contentStyle = { maxHeight: '240px', overflowY: 'auto', width: '100%' };
	return (
		<div
			className="dropdown-menu position-absolute d-block rounded-1"
			style={menuStyle}
			ref={ref}
		>
			<div className="dropdown-content" style={contentStyle}>
				{props.children}
			</div>
		</div>
	);
});

DropDown.Toggle = Toggle;
DropDown.Toggle.displayName = 'DropDown.Toggle';
DropDown.Menu = Menu;
DropDown.Menu.displayName = 'DropDown.Menu';

export default DropDown;
