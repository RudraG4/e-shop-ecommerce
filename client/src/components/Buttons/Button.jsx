import React, { forwardRef } from 'react';
import { Button as BSButton } from 'react-bootstrap';
import PropTypes from 'prop-types';

const Button = forwardRef((props, ref) => {
	const { variant, outlined, size, className } = props;
	const { disabled, onClick, as, startIcon, endIcon, type, children } = props;

	const _props = {};

	let _className = [];

	if (variant && typeof variant !== 'boolean') {
		_className.push(`btn${outlined ? '-outline' : ''}-${variant}`);
	} else if (outlined) {
		_className.push('btn-outline');
	}
	if (size && typeof size !== 'boolean') {
		_className.push(`btn-${size}`);
	}
	if (className && typeof className !== 'boolean') {
		_className.push(className);
	}

	_props['className'] = _className.join(' ');
	_props['onClick'] = onClick;
	_props['ref'] = ref;
	if (disabled) {
		_props['disabled'] = 'disabled';
		_props['aria-disabled'] = 'true';
	}
	if (as === 'a') {
		_props['role'] = 'button';
		_props['href'] = '#';
		return <a {..._props}>{children}</a>;
	}
	_props['type'] = 'button';
	if (type && typeof type !== 'boolean') {
		_props['type'] = type;
	}
	return (
		<BSButton variant="default" {..._props}>
			{React.isValidElement(startIcon) && <span className="me-2">{startIcon}</span>}
			{children}
			{React.isValidElement(endIcon) && <span className="ms-2">{endIcon}</span>}
		</BSButton>
	);
});

Button.displayName = 'Button';

Button.propTypes = {
	variant: PropTypes.oneOf([
		'primary',
		'secondary',
		'success',
		'danger',
		'warning',
		'info',
		'light',
		'dark',
		'default'
	]),
	outlined: PropTypes.bool,
	size: PropTypes.oneOf(['sm', 'lg']),
	className: PropTypes.string,
	disabled: PropTypes.bool,
	onClick: PropTypes.func,
	as: PropTypes.string,
	type: PropTypes.oneOf(['button', 'submit', 'reset']),
	startIcon: PropTypes.element,
	endIcon: PropTypes.element
};

export default Button;
