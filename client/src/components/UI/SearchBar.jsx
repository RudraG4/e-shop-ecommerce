import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { Link, useSearchParams } from 'react-router-dom';
import { DropDown } from 'components';
import { useFetch } from 'hooks';
import { useEffect, useState } from 'react';

const Selector = (props) => {
	const { options = [], value = 'all', onSelect = () => {} } = props;

	if (options.findIndex((obj) => obj.name === 'all') < 0) {
		options.unshift({ label: 'All Categories', name: 'all' });
	}

	const selectedOp = options.find((obj) => obj.name === value);

	return (
		<DropDown className="border rounded-start text-white">
			<DropDown.Toggle>
				<small>{selectedOp?.label || value}</small>
			</DropDown.Toggle>
			<DropDown.Menu>
				{options &&
					options.map((curr, index) => {
						return (
							<Link
								key={index}
								className={`dropdown-item text-capitalize ${
									value === curr.name ? 'active' : ''
								}`}
								to="javascript(void)"
								style={{
									'--bs-dropdown-link-active-bg': '#ffc107',
									'--bs-dropdown-link-active-color': '#000'
								}}
								onClick={(e) => {
									e.preventDefault();
									onSelect(curr.name);
								}}
							>
								{curr.label}
							</Link>
						);
					})}
			</DropDown.Menu>
		</DropDown>
	);
};

export default function SearchBar(props) {
	const { className = '', onSearch, onFocus, onBlur } = props;
	const [searchParams] = useSearchParams();
	const [category, setCategory] = useState(getParam('category', 'all'));
	const [keyword, setKeyword] = useState(getParam('keyword'));
	const url = '/categories';
	const params = { params: { sort: 'name', direction: 'ASC' } };
	const { data = {} } = useFetch(url, params);
	const { results: options = [] } = data;

	const onSubmit = (event) => {
		event.preventDefault();
		onSearch({ category, keyword, sort: 'newest' });
	};

	function getParam(param, defaultValue) {
		return searchParams.get(param) || defaultValue || '';
	}

	useEffect(() => {
		setCategory(getParam('category', 'all'));
		setKeyword(getParam('keyword'));
	}, [searchParams]);

	return (
		<Form
			role="search"
			className={`${className} w-100`}
			onSubmit={onSubmit}
			onFocus={onFocus}
			onBlur={onBlur}
		>
			<InputGroup>
				<Selector value={category} options={options} onSelect={setCategory} />
				<Form.Control
					className="shadow-none flex-grow-1"
					type="search"
					placeholder="What are you looking for?"
					aria-label="Search"
					value={keyword}
					onChange={(e) => setKeyword(e.target.value)}
				/>
				<Button type="submit" variant="warning">
					<FontAwesomeIcon icon={faMagnifyingGlass} />
				</Button>
			</InputGroup>
		</Form>
	);
}

SearchBar.defaultProps = {
	onSearch: () => {},
	onFocus: () => {}
};
