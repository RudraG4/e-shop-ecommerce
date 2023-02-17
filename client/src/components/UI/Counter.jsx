import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';

export default function Counter({ label, updateCount, value, min, max, className = '' }) {
	return (
		<div className={`counter d-flex align-items-center ${className}`}>
			{label && <label className="counter-label me-2 ">{label}</label>}
			<div
				className="d-inline-flex align-items-center border rounded fs-6"
				style={{ '--bs-border-color': '#cacbcc' }}
			>
				<button
					className="btn pt-1 pb-1 ps-2 pe-2 text-muted"
					onClick={() => updateCount(-1)}
					disabled={value <= min}
				>
					<FontAwesomeIcon icon={faMinus} />
				</button>
				<div
					className="pt-1 pb-1 ps-2 pe-2 fw-semibold text-secondary text-center"
					style={{ minWidth: '32px' }}
				>
					{value}
				</div>
				<button
					className="btn pt-1 pb-1 ps-2 pe-2 text-muted"
					onClick={() => updateCount(1)}
					disabled={value >= max}
				>
					<FontAwesomeIcon icon={faPlus} />
				</button>
			</div>
		</div>
	);
}

Counter.defaultProps = {
	updateCount: () => {},
	value: 1,
	max: 10,
	min: 0
};

Counter.propTypes = {
	updateCount: PropTypes.func,
	value: PropTypes.number
};
