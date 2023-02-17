const Loader = ({ show = true, position = 'fixed', style = {} }) => {
	if (!show) return;

	return (
		<div
			className={`hstack justify-content-center position-${position} top-0 bottom-0 start-0 end-0 bg-light bg-opacity-75`}
			style={{ zIndex: 1043, ...style }}
		>
			<div className="spinner-border text-warning" role="status">
				<span className="visually-hidden">Loading...</span>
			</div>
		</div>
	);
};

export default Loader;
