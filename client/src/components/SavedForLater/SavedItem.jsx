import { Link } from 'react-router-dom';
import { usePreferenceContext } from 'hooks';
import { formatCurrency } from 'utils';
import { Card } from 'components';
import { Button, Stack } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faTrash } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';

const Wrapper = styled.div`
	display: flex;
	flex: 1 1 auto;
	flex-direction: column;
	height: 100%;
	gap: 1rem;
	justify-content: space-between;
`;

const InfoWrapper = styled(Stack).attrs({ direction: 'horizontal' })`
	align-items: flex-start;
	flex-wrap: wrap;
	flex-grow: 1;
`;

const ActionWrapper = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-end;
	align-items: flex-end;
	flex-grow: 1;
`;

const Action = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	flex-wrap: wrap;
	gap: 0.5rem;
`;

const ProductInfoWrapper = styled.div`
	flex-grow: 1;
`;

const Title = styled(Link)`
	display: -webkit-box;
	-webkit-line-clamp: 2;
	max-width: 600px;
	-webkit-box-orient: vertical;
	overflow: hidden;
	text-decoration: none;
	line-height: 1.25;
	font-weight: 600;
	font-size: 1.25rem;
	margin-bottom: 0rem;
`;

const SubTitle = styled.div`
	font-weight: 600;
	color: ${(props) => (props.availability === 'In Stock' ? '#00ba34' : '#e92c2c')};
	margin-bottom: 0.5rem;
`;

const ProductPriceWrapper = styled.div`
	text-align: end;
`;

const CardBody = styled(Card.Body)`
	&.vstack {
		${ProductInfoWrapper} {
			width: 100%;
		}

		${ProductPriceWrapper} {
			width: 100%;
			text-align: start;
		}
	}
`;

export default function SavedItem(props) {
	const { style, direction, item, moveToCart, removeItem } = props;
	const { preference } = usePreferenceContext();

	const _formatCurrency = (number) => {
		return formatCurrency(number, preference.currency);
	};

	const onMoveToCart = (event) => {
		moveToCart(item.productId);
	};

	const onRemoveItem = () => {
		removeItem(item.productId);
	};

	if (!item) return;

	const fProductCost = _formatCurrency(item.productCost);

	return (
		<Card direction={direction} style={style} className="box-hover gap-3">
			<Card.ActionArea as="a" to={`/product-info/${item.productId}`}>
				<Card.Media
					src={item.productImg}
					alt="Product Thumbnail"
					height={direction === 'horizontal' ? '150px' : '200px'}
					width={direction === 'horizontal' ? '150px' : '200px'}
				/>
			</Card.ActionArea>
			<CardBody>
				<Wrapper>
					<InfoWrapper>
						<ProductInfoWrapper>
							<Title to={`/product-info/${item.productId}`}>
								{item.productTitle}
							</Title>
							<SubTitle availability={item.productAvailability}>
								{item.productAvailability}
							</SubTitle>
						</ProductInfoWrapper>
						<ProductPriceWrapper>
							<div className="fs-4 fw-bold lh-1">{fProductCost}</div>
							<div className="fs-6">(Incl. of all taxes)</div>
						</ProductPriceWrapper>
					</InfoWrapper>
					<ActionWrapper>
						<Action>
							<Button variant="dark" className="flex-grow-1" onClick={onMoveToCart}>
								<FontAwesomeIcon icon={faCartShopping} className="me-2" />
								<small>Move to Cart</small>
							</Button>
							<Button
								variant="light"
								className="flex-grow-1 border"
								onClick={onRemoveItem}
							>
								<FontAwesomeIcon icon={faTrash} className="me-2" />
								<small>Delete</small>
							</Button>
						</Action>
					</ActionWrapper>
				</Wrapper>
			</CardBody>
		</Card>
	);
}
