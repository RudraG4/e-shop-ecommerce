import { useNavigate, useParams } from 'react-router-dom';
import { Container, Modal, Button } from 'react-bootstrap';
import { Loader, BreadCrumbs } from 'components';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import ProductInfoContent from './ProductInfoContent';
import { useCartContext, useFetch, usePreferenceContext } from 'hooks';

export default function ProductInfo(props) {
	const navigate = useNavigate();
	const { preference } = usePreferenceContext();
	const { productId } = useParams();
	const { addToCart } = useCartContext();
	const [isExecuting, setIsExecuting] = useState(false);
	const [modalShow, setModalShow] = useState(false);
	const [quantity, setQuantity] = useState(0);
	const { data = {}, isLoading, error } = useFetch(`/products/${productId}`, {}, [preference]);
	const { result: product } = data;

	const _addToCart = async (productId, quantity) => {
		setQuantity(quantity);
		await addToCart({ _id: productId, quantity: quantity });
	};

	const onAddToCart = async (productId, quantity) => {
		setIsExecuting(true);
		await _addToCart(productId, quantity);
		setIsExecuting(false);
		setModalShow(true);
	};

	const onBuyNow = async (productId, quantity) => {
		setIsExecuting(true);
		await _addToCart(productId, quantity);
		setIsExecuting(false);
		navigate('/cart');
	};

	const onToggleFavorite = (isFav) => {
		console.log(isFav);
	};

	const renderExecutingLoader = () => {
		return isExecuting && <Loader />;
	};

	const renderProductInfo = () => {
		if (isLoading) return <Loader />;
		return (
			<ProductInfoContent
				data={product}
				onAddToCart={onAddToCart}
				onBuyNow={onBuyNow}
				onToggleFavorite={onToggleFavorite}
			/>
		);
	};

	const renderCartAddModal = () => {
		if (!modalShow) return;
		return (
			<Modal
				show={modalShow}
				onHide={() => setModalShow(false)}
				size="1x"
				aria-labelledby="contained-modal-title-vcenter"
				centered
				className="rounded-1"
			>
				<Modal.Header className="border-0" closeButton>
					<Modal.Title>
						<div className="hstack">
							<FontAwesomeIcon icon={faCircleCheck} color="#00ba34" />
							<div className="ms-3">1 Item added to the cart!</div>
						</div>
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div className="hstack gap-2">
						<div
							className="d-flex align-items-center"
							style={{ width: '75px', height: '75px' }}
						>
							<img
								src={product.thumbnail}
								alt={product.title}
								className="d-block m-auto"
								style={{
									maxWidth: '75px',
									maxHeight: '75px'
								}}
								srcSet={product.thumbnail}
								title={product.title}
								loading="lazy"
							/>
						</div>
						<div className="hstack flex-grow-1 gap-1">
							<div className="fs-6 flex-grow-1 pe-4">{product.title}</div>
							<div className="vstack justify-content-center align-items-end lh-1">
								<div className="fs-6 fw-bold">{product.formattedPrice}</div>
								<div className="fs-6 text-muted">{`x ${quantity}`}</div>
							</div>
						</div>
					</div>
				</Modal.Body>
				<Modal.Footer className="justify-content-center">
					<Button
						variant="warning"
						onClick={() => {
							setModalShow(false);
							navigate('/cart');
						}}
					>
						Proceed to Cart
					</Button>
				</Modal.Footer>
			</Modal>
		);
	};

	const renderError = () => {
		if (error) {
			return (
				<div className="d-flex flex-column align-items-center justify-content-center vh-100">
					<FontAwesomeIcon icon={faTriangleExclamation} color="#ffc107" fontSize="5rem" />
					<h2>OOPS!!</h2>
					<div>Error loading the product info. Try again later</div>
				</div>
			);
		}
	};

	useEffect(() => {
		if (product) {
			document.title = product.title || 'Product Details';
		}
	}, [product]);

	return (
		<Container className="container position-relative p-3">
			<BreadCrumbs product={product} />
			{renderProductInfo()}
			{renderExecutingLoader()}
			{renderCartAddModal()}
			{renderError()}
		</Container>
	);
}
