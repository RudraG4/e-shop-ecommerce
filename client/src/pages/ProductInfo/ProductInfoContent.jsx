import {
	Counter,
	Ratings,
	FavouriteBtn,
	ShareBtn,
	RatingsCard,
	ReviewList,
	Slider,
	Gallery,
	GalleryZoomWindow
} from 'components';
import { Link } from 'react-router-dom';
import { createRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faCircleXmark, faTruckFast } from '@fortawesome/free-solid-svg-icons';
import { Badge } from 'react-bootstrap';

export default function ProductInfoContent(props) {
	const { onAddToCart, onBuyNow, onToggleFavorite } = props;
	const [data] = useState(props.data);
	const [quantity, setQuantity] = useState(1);
	const [showZoomWindow, setShowZoomWindow] = useState(false);
	const [currentImage, setCurrentImage] = useState(
		data?.images?.length ? data.images[0] : data?.thumbnail
	);
	const [isFavourite, setIsFavourite] = useState(data?.isFavourite || false);
	const ratingRef = createRef();

	if (!data) return;

	let color = '#e92c2c';
	let availIcon = faCircleXmark;
	let isOutOfStock = true;

	if (data.availability === 'In Stock') {
		color = '#00ba34';
		availIcon = faCircleCheck;
		isOutOfStock = false;
	}

	const onToggleFav = (isFavourite) => {
		setIsFavourite(isFavourite);
		onToggleFavorite(isFavourite);
	};

	const onCurrentImgClick = () => {
		setShowZoomWindow(true);
	};

	const onZoomWindowClose = () => {
		setShowZoomWindow(false);
	};

	const renderBadge = () => {
		return (
			<div className="text-muted text-capitalize mb-2">
				<Badge bg="secondary" text="light" as="div">
					{data.category}
				</Badge>
			</div>
		);
	};

	const renderRatingInfo = () => {
		const scrollIntoView = () => {
			if (ratingRef && ratingRef.current) {
				ratingRef.current.scrollIntoView({ behavior: 'smooth' });
			}
		};

		if (data.ratings) {
			return (
				<div className="product-rating d-flex mb-3">
					<Ratings rating={data.ratings.rating} color="#ffc107" showLabel />
					<Link
						to="#"
						className="ms-2 text-decoration-underline"
						onClick={scrollIntoView}
					>{`(${data.ratings.ratingCount || 0} ratings)`}</Link>
				</div>
			);
		}
	};

	const renderPricingInfo = () => {
		if (isOutOfStock) return;
		return (
			<div className="product-price-info">
				<div className="product-price-box lh-base">
					<span className="product-price fs-4 fw-bold">{data.price.displayAmount}</span>
					<span className="ms-2">(Inclusive of all taxes)</span>
				</div>
				<div
					className="product-price-discount d-flex flex-wrap mb-3 gap-2 text-muted"
					style={{ '--bs-border-color': '#cacbcc' }}
				>
					<span className="text-decoration-line-through">
						{`MRP: ${data.mrp.displayAmount}`}
					</span>
					<span>{` (Save ${data.savedAmt.displayAmount}, ${data.discountPercentage}% off)`}</span>
				</div>
			</div>
		);
	};

	const renderStockInfo = () => {
		return (
			<div className="border-top py-3" style={{ '--bs-border-color': '#cacbcc' }}>
				<div className="d-flex mb-2 align-items-center fw-semibold" style={{ color }}>
					<FontAwesomeIcon icon={availIcon} size="lg" />
					{!isOutOfStock && data.stock < 5 ? (
						<div className="ms-2">{`Only ${data.stock} left in stock.`}</div>
					) : (
						<div className="ms-2">{data.availability}</div>
					)}
				</div>
				{isOutOfStock ? (
					<div className="lh-1">
						We don't know when or if this item will be back in stock
					</div>
				) : (
					<div className="d-flex mb-2 align-items-center fw-semibold">
						<FontAwesomeIcon icon={faTruckFast} size="lg" />
						<div className="ms-2">
							{data.price >= 500
								? 'Eligible for FREE Delivery'
								: 'Standard delivery available'}
						</div>
					</div>
				)}
			</div>
		);
	};

	const renderCartAction = () => {
		if (isOutOfStock) return;

		return (
			<div className="border-top py-3" style={{ '--bs-border-color': '#cacbcc' }}>
				<div className="counter-wrapper mb-2">
					<Counter
						label="Quantity"
						updateCount={(newVal) => setQuantity((oldVal) => oldVal + newVal)}
						value={quantity}
						min={1}
						max={data.stock}
					/>
				</div>
				<div className="row gap-2 m-0">
					<div className="col p-0 mb-2">
						<button
							className="btn btn-warning rounded-50 w-100"
							onClick={() => onAddToCart(data._id, quantity)}
						>
							Add to Cart
						</button>
					</div>
					<div className="col p-0 mb-2">
						<button
							className="btn btn-light border rounded-50 w-100"
							onClick={() => onBuyNow(data._id, quantity)}
						>
							Buy Now
						</button>
					</div>
				</div>
			</div>
		);
	};

	const renderProductSummary = () => {
		const images = data?.images?.length ? data.images : [data.thumbnail];

		return (
			<div className="mb-3">
				<div className="row">
					<div className="col-md-6 mb-3">
						<div className="position-relative">
							<Gallery
								currentImage={currentImage}
								images={images}
								onChange={setCurrentImage}
							>
								<Gallery.Current title={data.title} onClick={onCurrentImgClick} />
								<Slider
									className="gallery-thumbs"
									dataList={images}
									card={(data) => <Gallery.Thumb src={data} title={data.title} />}
								/>
							</Gallery>
							<div className="position-absolute end-0 top-0 d-flex flex-column">
								<FavouriteBtn isFavourite={isFavourite} onToggle={onToggleFav} />
								<ShareBtn url={`/product-info/${data._id}`} title="Share" />
							</div>
						</div>
					</div>
					<div className="col-md-6 mb-3">
						<div>
							<h3>{data.title}</h3>
							<div>
								{renderBadge()}
								{renderRatingInfo()}
								{renderPricingInfo()}
								{renderStockInfo()}
								{renderCartAction()}
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	};

	const renderProductDescription = () => {
		return (
			<div className="mb-3">
				<div className="fs-5 fw-bold mb-2">About this item</div>
				<p>{data.description}</p>
			</div>
		);
	};

	const renderReviewsRatings = () => {
		return (
			<div className="mb-3" ref={ratingRef}>
				<div className="fs-5 fw-bold mb-2">Reviews</div>
				<div>
					<div className="rating-stats pb-3">
						<RatingsCard
							rating={data.ratings?.rating}
							totalRating={data.ratings?.ratingCount}
							stats={data.ratings?.stats}
						/>
					</div>
					<div className="review-product-wrapper pb-3">
						<div className="review-product border-bottom pt-3 pb-4">
							<div className="mb-3">
								<p className="fw-bold mb-1">Review this product</p>
								<p className="m-0">Help other customers make their decision</p>
							</div>
							<button className="btn btn-light border rounded-50 ps-5 pe-5">
								Write a Review
							</button>
						</div>
					</div>
					<ReviewList />
				</div>
			</div>
		);
	};

	const renderGallerZoomWindow = () => {
		// if (!showZoomWindow) return;
		if (!data) return;

		const images = data?.images?.length ? data.images : [data.thumbnail];

		return (
			<GalleryZoomWindow
				images={images}
				show={showZoomWindow}
				onHide={onZoomWindowClose}
				currentImage={currentImage}
				title={data.title}
			/>
		);
	};

	return (
		<div className="product-details">
			{renderProductSummary()}
			{renderProductDescription()}
			{renderReviewsRatings()}
			{renderGallerZoomWindow()}
		</div>
	);
}

ProductInfoContent.defaultProps = {
	onAddToCart: (productId, quantity) => {},
	onBuyNow: (productId, quantity) => {},
	onToggleFavorite: (isFav) => {}
};
