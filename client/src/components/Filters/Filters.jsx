import CategoryFilter from './CategoryFilter';
import AvailabilityFilter from './AvailabilityFilter';
import PriceFilter from './PriceFilter';
import { useState } from 'react';

export default function Filters(props) {
	const { filter = {}, onChange = () => {}, className } = props;
	const [state, setState] = useState(filter);

	const onFilterChange = (event) => {
		const { name, value, checked } = event.target;
		let oldState = { ...state };
		function setNewState(state) {
			const newState = { ...state };
			if (checked) {
				newState[name] = value;
				return newState;
			}
			delete newState[name];
			return newState;
		}
		setState(setNewState(oldState));
		onChange(setNewState(oldState));
	};

	return (
		<div className={`filter-by ${className || ''}`}>
			<div className="d-flex flex-column">
				<p className="fw-semibold me-2 border-bottom pt-2 pb-2 mb-2">Filter By</p>
				<div className="filters ms-2">
					<div className="filter mb-3">
						<CategoryFilter onChange={onFilterChange} value={filter['category']} />
					</div>
					<div className="filter mb-3">
						<PriceFilter onChange={onFilterChange} value={filter['price']} />
					</div>
					<div className="filter mb-3">
						<AvailabilityFilter
							onChange={onFilterChange}
							value={filter['includeOOSFlag']}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
