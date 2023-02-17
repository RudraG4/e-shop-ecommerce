import { SortBy, LoadMoreGrid, Button } from 'components';
import FilterBy from 'components/Filters';
import ProductCard, { ProductCardSkeleton } from 'components/Cards/Product';
import { useState, useEffect } from 'react';
import { useFetch } from 'hooks';
import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faSort } from '@fortawesome/free-solid-svg-icons';
import './Products.scss';

function ProductFilters(props) {
	const [showSortMob, setShowSortMob] = useState(false);
	const [showFilterMob, setShowFilterMob] = useState(false);

	function onSortChange(sort) {
		if (showSortMob) {
			setShowSortMob(false);
		}
		props.onSortChange(sort);
	}

	function onFilterChange(filter) {
		if (showFilterMob) {
			setShowFilterMob(false);
		}
		props.onFilterChange(filter);
	}

	function onSortMobClick() {
		setShowSortMob(!showSortMob);
		setShowFilterMob(false);
	}

	function onFilterMobClick() {
		setShowFilterMob(!showFilterMob);
		setShowSortMob(false);
	}

	return (
		<>
			<div className="filter-show-mobile position-fixed start-0 end-0 bottom-0 text-bg-dark">
				<div
					className="col-6 p-3 text-uppercase cursor-pointer hstack justify-content-center"
					onClick={onSortMobClick}
				>
					<FontAwesomeIcon icon={faSort} className="me-2" />
					<span className="fw-bold">SORT</span>
				</div>
				<div
					className="col-6 p-3 text-uppercase cursor-pointer hstack justify-content-center"
					onClick={onFilterMobClick}
				>
					<FontAwesomeIcon icon={faFilter} className="me-2" />
					<span className="fw-bold">FILTER</span>
				</div>
			</div>
			<div className="filter-show-web h-100 bg-white">
				<SortBy
					sort={props.sort}
					onChange={onSortChange}
					labelDirection="column"
					className={`mt-2 mb-2${showSortMob ? ' is-show' : ''}`}
				/>
				<FilterBy
					filter={props.filter}
					onChange={onFilterChange}
					className={`mt-2 mb-2${showFilterMob ? ' is-show' : ''}`}
				/>
			</div>
		</>
	);
}

function ProductResults(props) {
	const limit = 10;
	const { filter, sort } = props;
	const [page, setPage] = useState(1);
	const [total, setTotal] = useState(0);
	const [results, setResults] = useState([]);
	const [isLoadMore, setIsLoadMore] = useState(false);
	const [url, setUrl] = useState(generateURL(filter, sort, (page - 1) * limit, limit));
	const { data = {}, isLoading } = useFetch(url);

	function generateURL(filter, sort, skip, limit) {
		return `/products?${createSearchParams({ ...filter, sort, skip, limit })}`;
	}

	function onLoadMore() {
		setIsLoadMore(true);
		setPage((oldPage) => oldPage + 1);
		setUrl(generateURL(filter, sort, (page + 1 - 1) * limit, limit));
	}

	useEffect(() => {
		if (data) {
			if (data.results) {
				if (isLoadMore) {
					setResults((old) => {
						return [...old, ...data.results];
					});
				} else {
					setResults(data.results);
				}
			}
			setTotal(data.total || 0);
		} else {
			setResults([]);
			setTotal(0);
		}
	}, [data]);

	useEffect(() => {
		setIsLoadMore(false);
		setPage(1);
		setUrl(generateURL(filter, sort, 0, limit));
		setResults([]);
	}, [filter, sort]);

	return (
		<div className="result-grid-wrapper h-100 bg-white position-relative top-0">
			<div className="mb-3">
				<div className="d-flex align-items-center justify-content-between w-100">
					<div className="fs-3 fw-bold">Results</div>
					<div className="fs-5 fw-sem-bold">{`${total} Products found`}</div>
				</div>
			</div>
			<LoadMoreGrid
				isLoading={isLoading}
				data={results}
				title="Results"
				render={(e) => <ProductCard key={e._id} data={e} />}
				LoadingComponent={<ProductCardSkeleton />}
			/>
			<div>
				<div className="d-flex justify-content-center my-3">
					{total > limit && total > page * limit && (
						<Button variant="light" className="border border px-5" onClick={onLoadMore}>
							{isLoading ? 'Loading..' : 'Load More'}
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}

export default function Products() {
	const navigate = useNavigate();
	const [urlParams] = useSearchParams();
	const [sort, setSort] = useState(getParam('sort', 'newest'));
	const [filter, setFilter] = useState(getURLFilterParams);

	function getParam(param, defaultValue) {
		return urlParams.get(param) || defaultValue;
	}

	function onSortChange(sort) {
		setSort(sort);
		navigate({
			pathname: '/products',
			search: `${createSearchParams({ ...filter, sort })}`
		});
	}

	function onFilterChange(filter) {
		setFilter(filter);
		navigate({
			pathname: '/products',
			search: `${createSearchParams({ ...filter, sort })}`
		});
	}

	function getURLFilterParams() {
		const filter = {};
		if (getParam('category')) {
			filter['category'] = getParam('category');
		}

		if (getParam('keyword')) {
			filter['keyword'] = getParam('keyword');
		}

		if (getParam('price')) {
			filter['price'] = getParam('price');
		}

		if (getParam('includeOOSFlag')) {
			filter['includeOOSFlag'] = getParam('includeOOSFlag');
		}
		return filter;
	}

	useEffect(() => {
		setSort(getParam('sort', 'newest'));
		setFilter(getURLFilterParams());
	}, [urlParams]);

	return (
		<div className="container-fluid p-3" style={{ minHeight: '90vh', position: 'relative' }}>
			<div className="h-100">
				<div className="row m-0 p-0 h-100">
					<div className="filters col-sm-4 col-lg-2">
						<ProductFilters
							sort={sort}
							filter={filter}
							onSortChange={onSortChange}
							onFilterChange={onFilterChange}
						/>
					</div>
					<div className="results col p-3">
						<ProductResults sort={sort} filter={filter} />
					</div>
				</div>
			</div>
		</div>
	);
}
