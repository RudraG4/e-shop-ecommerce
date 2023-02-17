import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Loader, RatingsBadge, FavouriteBtn, CartBtn, ShareBtn } from 'components';
import { Badge, Stack } from 'react-bootstrap';
import { useCartContext, usePreferenceContext } from 'hooks';
import { formatCurrency } from 'utils';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import styled from 'styled-components';

const Product = styled.div`
	position: relative;
	padding: 1rem;
	border-radius: 0.375rem;
	max-width: 234px;
	background-color: white;
	/* box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px; */
	border: 1px solid #dee2e6;
	overflow: hidden;

	&:hover {
		background: #e3e3e3;

		#product-action {
			visibility: visible;
			opacity: 1;
			transform: translateY(0);
		}
	}
`;

const AbsoluteRatingsBadge = styled(RatingsBadge)`
	position: absolute;
	bottom: 10px;
	left: 10px;
`;

const Wrapper = styled.div`
	margin: 0.5rem 0;
`;

const ProductImage = styled.div`
	position: relative;
	overflow: hidden;
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 0 auto 1rem;
	height: 200px;
	width: 200px;

	img {
		width: 100%;
		height: 100%;
		object-fit: fill;
		object-position: center;
		transition: transform 0.1s linear;
	}
`;

const ProductTitle = styled.p`
	font-size: 1.4rem;
	line-height: 1.3;
	color: #353535;
	min-height: 37px;
	height: 3.6rem;
	overflow: hidden;
	text-overflow: ellipsis;
	-webkit-line-clamp: 2;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	font-weight: 500;
	text-transform: none;
	margin: 0.5rem 0;
`;

const ProductSubtTitle = styled.p`
	margin: 0;
	text-transform: capitalize;
	font-size: 12px;
`;

const ProductPrice = styled.span`
	font-weight: 600;
	font-size: 1.3rem;
	line-height: 1;
`;

const ProductMRP = styled.span`
	font-size: 0.75rem;
	font-weight: 400;
	color: #6c757d;
	text-decoration: line-through;
`;

const ProductOfferRibbon = styled.div`
	position: absolute;
	inset: 0 auto auto 0;
	background: #ffc107;
	text-align: center;
	color: white;
	width: 45%;
	padding: 0.15rem 0;
	transform-origin: 100% 0;
	transform: translate(-46%, -70%) rotate(-45deg);
	box-shadow: rgb(0 0 0) 0px 3px 3px 0px;
	clip-path: inset(0 -100%);
	z-index: 10;
	font-size: 12px;
	font-weight: 700;
`;

export default function ProductCard(props) {
	const { preference } = usePreferenceContext();
	const { addToCart } = useCartContext();
	const { data: product, className = '', showPrice = true, showAction = true } = props;
	const { _id, title, thumbnail, images, image, category } = product;
	const { price, mrp } = product;
	const { ratings, isFavourite = false } = product;
	const [isFav, setIsFav] = useState(isFavourite);
	const [isLoading, setIsLoading] = useState(false);

	if (!product) return;

	const onToggleFav = (isFav) => {
		setIsFav(isFav);
	};

	const onAddToCart = async () => {
		setIsLoading(true);
		try {
			await addToCart({ _id: product._id, quantity: 1 });
		} catch (e) {}
		setIsLoading(false);
	};

	return (
		<Product className={className}>
			<Loader show={isLoading} position="absolute" />
			<div className="product-main">
				<Link to={`/product-info/${_id}`} className="bg-white">
					<div className="product-image">
						<ProductImage>
							<LazyLoadImage
								src={thumbnail || images?.length ? images[0] : image}
								width={200}
								height={200}
								effect="blur"
							/>
							<AbsoluteRatingsBadge
								rating={ratings.rating || 0}
								color="#ffc107"
								readOnly
								short
								showLabel
							/>
						</ProductImage>
					</div>
					<div className="product-body">
						<Wrapper>
							<Badge bg="secondary" text="light" as="div">
								<ProductSubtTitle>{category}</ProductSubtTitle>
							</Badge>
							<ProductTitle>{title}</ProductTitle>
						</Wrapper>
						{showPrice && (
							<Wrapper>
								<Stack direction="horizontal" gap="1">
									<ProductPrice>{price.displayAmount}</ProductPrice>
									<ProductMRP>{mrp.displayAmount}</ProductMRP>
								</Stack>
								<div className="fs-7 fw-normal">(Incl. of all taxes)</div>
							</Wrapper>
						)}
					</div>
				</Link>
			</div>
			{showAction && (
				<div className="product-action">
					<Stack direction="horizontal" className="justify-content-evenly">
						<CartBtn onClick={onAddToCart} />
						<FavouriteBtn isfav={isFav} onToggle={onToggleFav} />
						<ShareBtn url={`/product-info/${_id}`} />
					</Stack>
				</div>
			)}
		</Product>
	);
}
