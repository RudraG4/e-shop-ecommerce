import { useFetch } from 'hooks';
import { useState } from 'react';
import { Loader } from 'components';
import { Form } from 'react-bootstrap';

export default function CategoryFilter(props) {
	const url = '/categories';
	const { data = {}, isLoading, error } = useFetch(url);
	const { results = [] } = data;
	const { onChange = () => {}, value } = props;
	const [showMore, setShowMore] = useState(false);
	const maxItems = 5;

	const onShowMoreClick = () => setShowMore(!showMore);

	const renderExpansion = () => {
		if (results.length > maxItems) {
			return (
				<p
					className="text-underline-hover cursor-pointer fw-bold fs-7"
					onClick={onShowMoreClick}
				>
					{showMore ? 'SEE LESS -' : 'SEE MORE +'}
				</p>
			);
		}
	};

	return (
		<div className="category-filter ">
			<p className="fw-semibold me-2 pt-2 pb-2 m-0">Category</p>
			<div className="options position-relative">
				<Loader show={isLoading} position="absolute" />
				{!isLoading &&
					results.map((category, i) => {
						if (i + 1 > 5 && !showMore) {
							return undefined;
						}
						return (
							<Form.Check
								className="w-100"
								id={`category_${i}`}
								key={`category_${i}`}
							>
								<Form.Check.Input
									type="radio"
									className={`${
										category.name === value ? 'bg-warning border-warning' : ''
									}`}
									checked={category.name === value}
									onChange={onChange}
									name="category"
									value={category.name}
								/>
								<Form.Check.Label className="text-capitalize">
									{category.label}
								</Form.Check.Label>
							</Form.Check>
						);
					})}
				{renderExpansion()}
				{error && <div className="text-center">Error loading the filter</div>}
			</div>
		</div>
	);
}
