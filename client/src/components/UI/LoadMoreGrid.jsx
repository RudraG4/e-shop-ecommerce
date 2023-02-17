import { cloneElement } from 'react';
import { Button, EshopBanner } from 'components';

const NoResults = ({ search }) => {
	return (
		<div className="vstack justify-content-center align-items-center p-0">
			{search && (
				<div className="text-center pt-4 pb-3">
					<span>You searched for </span>
					<span className="fw-semibold">{search}</span>
				</div>
			)}
			<div className="m-auto" style={{ width: '300px', height: '300px' }}>
				<img
					width="100%"
					className="d-block"
					src="https://img.freepik.com/free-vector/curious-concept-illustration_114360-2185.jpg"
					alt="Search Not Found"
					srcSet="https://img.freepik.com/free-vector/curious-concept-illustration_114360-2185.jpg"
				/>
			</div>
			<div className="text-center pb-4">
				<div className="fs-5 fw-bold pt-4 mb-2">We could'nt find any matches!</div>
				<div>Please check the spelling or try searching something else</div>
			</div>
			<EshopBanner className="w-100 ps-2 pe-2" />
		</div>
	);
};

export default function LoadMoreGrid(props) {
	const { render = () => {}, data = [] } = props;
	const { LoadingComponent, loadingCount = 8 } = props;
	const { isLoading } = props;

	const renderSkeleton = () => {
		if (isLoading && LoadingComponent) {
			return [...Array(loadingCount)].map((_, index) => {
				return cloneElement(LoadingComponent, { key: index });
			});
		}
	};

	const renderResults = () => {
		if (data.length) {
			return data.map((_d, index) => {
				_d.key = index;
				return render(_d);
			});
		}
	};

	function renderGrid() {
		if (!isLoading && !data.length) return <NoResults />;

		return (
			<section className="container-fluid p-0">
				<div className="d-flex flex-wrap gap-3">
					{renderResults()}
					{renderSkeleton()}
				</div>
			</section>
		);
	}

	return <div className="result-grid">{renderGrid()}</div>;
}
