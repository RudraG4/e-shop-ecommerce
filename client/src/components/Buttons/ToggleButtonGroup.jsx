import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'components';
import styled from 'styled-components';

const TButton = styled(Button)`
	outline: 0;
	border-radius: 0.375rem !important;
	padding: 0.25rem 1rem !important;
	font-weight: 600 !important;

	color: ${(props) => (props.isactive ? 'black !important' : 'rgb(108,117,125) !important')};
	background-color: ${(props) => (props.isactive ? 'white !important' : 'initial')};
	border-color: ${(props) => (props.isactive ? 'black !important' : '#dee2e6 !important')};
	box-shadow: ${(_props) =>
		_props.isactive
			? 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,	rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;'
			: 'none'};
`;

const TGroup = styled.div`
	position: relative;
	display: inline-flex;
	vertical-align: middle;
	border: 1px solid #dee2e6;
	border-radius: 0.375rem;
	padding: 1px;
	background: rgba(248, 249, 250, 1);
	color: rgba(108, 117, 125, 1);

	> ${TButton} {
		position: relative;
		flex: 1 1 auto;
		border: none !important;
		border-color: transparent !important;
	}
`;

const ToggleButtonGroup = (props) => {
	const { value, onChange, className, disabled, children } = props;

	return (
		<TGroup className={className} role="group">
			{React.Children.map(children, (child) => {
				const { value: _value, disabled: _disabled } = child.props;

				const newprops = {
					...child.props,
					selected: _value === value,
					disabled: !disabled ? (_disabled ? true : false) : true,
					onClick: onChange
				};
				return React.cloneElement(child, newprops);
			})}
		</TGroup>
	);
};

ToggleButtonGroup.defaultProps = {
	onChange: () => {},
	disabled: false
};

ToggleButtonGroup.propTypes = {
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	disabled: PropTypes.bool,
	className: PropTypes.string,
	onChange: PropTypes.func,
	children: function (props) {
		const { children } = props;
		for (const child in children) {
			if (children[child].type.displayName !== 'ToggleButtonGroup.Button') {
				const error =
					"ToggleButtonGroup has children that aren't ToggleButtonGroup.Button components";
				console.warn(error);
				return new Error(error);
			}
		}
	}
};

const ToggleButton = (props, ref) => {
	const { value, selected, disabled, onClick, className, children } = props;
	return (
		<TButton
			isactive={selected}
			className={className}
			onClick={(event) => (disabled ? null : onClick(event, value))}
			disabled={disabled}
			ref={ref}
		>
			{children}
		</TButton>
	);
};

ToggleButtonGroup.Button = forwardRef(ToggleButton);

ToggleButtonGroup.Button.displayName = 'ToggleButtonGroup.Button';

ToggleButtonGroup.Button.defaultProps = {
	onClick: (event, value) => {},
	selected: false,
	disabled: false,
	className: ''
};

ToggleButtonGroup.Button.propTypes = {
	selected: PropTypes.bool,
	disabled: PropTypes.bool,
	defaultChecked: PropTypes.bool,
	className: PropTypes.string,
	onClick: PropTypes.func
};

export default ToggleButtonGroup;
