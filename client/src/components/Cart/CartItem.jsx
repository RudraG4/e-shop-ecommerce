import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faTrash } from '@fortawesome/free-solid-svg-icons';
import { usePreferenceContext } from 'hooks';
import { Link } from 'react-router-dom';
import { Card, Counter, Button, Ratings } from 'components';
import { Stack } from 'react-bootstrap';
import { formatCurrency } from 'utils';
import styled from 'styled-components';

const HStack = styled(Stack).attrs({ direction: 'horizontal' })`
	flex-direction: row;
`;

const VStack = styled(Stack).attrs({ direction: 'vertical' })`
	flex-direction: column;
`;

export default function CartItem(props) {
	const { item, updateQty, saveForLater, removeItem } = props;

	if (!item) return;

	let color = '#e92c2c';
	if (item.availability === 'In Stock') {
		color = '#00ba34';
	}

	const updateCount = async (value) => {
		await updateQty({ _id: item._id, quantity: value });
	};

	const removeCartItem = async () => {
		await removeItem(item);
	};

	const saveItemForLater = async () => {
		await saveForLater(item._id);
	};

	return (
		<Card direction={'horizontal'} className="position-relative box-hover gap-3">
			<Card.ActionArea as="a" to={`/product-info/${item._id}`}>
				<Card.Media
					src={item.thumbnail}
					alt="Product Thumbnail"
					height="150px"
					width="150px"
				/>
			</Card.ActionArea>
			<Card.Body className="col-sm-12 col-md-12 col-lg-9">
				<VStack className="w-100 gap-2">
					<HStack className="align-items-start flex-wrap flex-grow-1">
						<div className="cart-item-info col-md-12 col-lg-8">
							<Link
								to={`/product-info/${item._id}`}
								className="cart-item-title text-decoration-none fs-5 fw-semibold text-dark lh-sm mb-2"
								style={{
									display: '-webkit-box',
									WebkitLineClamp: 2,
									WebkitBoxOrient: 'vertical',
									overflow: 'hidden'
								}}
							>
								{item.title}
							</Link>
							<div className="cart-item-subtitle d-flex flex-wrap mb-3">
								<div className="cart-item-cost text-secondary pe-2 me-2 border-end">
									{item.price.displayAmount}
								</div>
								<div
									className="cart-item-availability fw-semibold pe-2 me-2 border-end"
									style={{ color }}
								>
									{item.availability}
								</div>
								<div className="cart-item-rating fw-semibold pe-2 me-2">
									<Ratings rating={item?.rating || 0} color="#ffc107" readOnly />
								</div>
							</div>
						</div>
						<div className="cart-item-price col col-md-12 col-lg-4 text-end">
							<div className="fs-4 fw-bold lh-1">{item.totalPrice.displayAmount}</div>
							<div className="fs-6">(Incl. of all taxes)</div>
						</div>
					</HStack>
					<HStack className="justify-content-between align-items-end flex-grow-1">
						<div className="cart-item-quantity col-md-8 col-lg-8">
							<Counter
								updateCount={updateCount}
								max={item.stock}
								value={item.quantity}
							/>
						</div>
						<div className="cart-item-action col-md-4 col-lg-4">
							<Stack
								direction={'horizontal'}
								className="flex-wrap justify-content-end gap-2 "
							>
								<Button
									variant="dark"
									className="cart-item-save border-0 flex-grow-1 p-2"
									startIcon={<FontAwesomeIcon icon={faHeart} />}
									onClick={saveItemForLater}
								>
									Save
								</Button>
								<Button
									variant="light"
									className="cart-item-save border flex-grow-1 p-2"
									startIcon={<FontAwesomeIcon icon={faTrash} />}
									onClick={removeCartItem}
								>
									Delete
								</Button>
							</Stack>
						</div>
					</HStack>
				</VStack>
			</Card.Body>
		</Card>
	);
}

CartItem.defaultProps = {
	updateQty: () => {},
	saveForLater: () => {},
	removeItem: () => {}
};
