import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-regular-svg-icons';
import { faCircleExclamation, faXmarkCircle } from '@fortawesome/free-solid-svg-icons';

export default function Alert(props) {
	let { variant = 'success', bgColor, icon, onClose, className, children } = props;

	let style = { fontSize: '13px' };

	if (variant === 'success') {
		style = { ...style, backgroundColor: '#dcf2dc', color: '#1e4620' };
		icon = icon ? icon : <FontAwesomeIcon icon={faCircleCheck} />;
	}
	if (variant === 'error') {
		style = { ...style, backgroundColor: '#fdeded', color: '#5f2120' };
		icon = icon ? icon : <FontAwesomeIcon icon={faCircleExclamation} />;
	}
	if (variant === 'info') {
		style = { ...style, backgroundColor: '#e5f6fd', color: '#014361' };
		icon = icon ? icon : <FontAwesomeIcon icon={faCircleExclamation} />;
	}

	if (bgColor) {
		style = { ...style, backgroundColor: bgColor };
	}

	return (
		<div className="hstack gap-1 w-100 ps-3 pe-3 pt-1 pb-1 rounded" style={style}>
			{icon && <div className="fs-6 mt-auto mb-auto me-2">{icon}</div>}
			<div className="flex-grow-1">{children}</div>
			{onClose && (
				<button
					type="button"
					className="btn fs-6 border-0 rounded-circle mt-auto mb-auto m-0 p-0"
					style={{ color: 'inherit', fontSize: 'inherit' }}
					onClick={onClose}
				>
					<FontAwesomeIcon icon={faXmarkCircle} />
				</button>
			)}
		</div>
	);
}
