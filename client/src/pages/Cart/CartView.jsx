import { useEffect } from 'react';
import { SubscribeBox, Slider, Cart, CartSummary, SavedForLater } from 'components';
import ProductCard, { ProductCardSkeleton } from 'components/Cards/Product';
import { Container, Stack } from 'react-bootstrap';
import styled from 'styled-components';
import { useAuthContext } from 'hooks';

const RecommendedForYou = (props) => {
	const { title, url, card, LoadingComponent } = props;
	return (
		<div className="bg-white mt-4">
			<h4 className="fw-bold">{title}</h4>
			<Slider url={url} card={card} LoadingComponent={LoadingComponent} />
		</div>
	);
};

const StyledContainer = styled(Container)`
	max-width: 1260px;
	padding: 1rem;
`;

const Row = styled.div`
	display: flex;
	flex-wrap: wrap;
	justify-content: center !important;
	gap: 1rem;
`;

const Column = styled.div`
	display: flex;
	flex-direction: column;
	gap: 2rem;
`;

const LeftView = styled.div`
	padding: 0;
	flex-grow: 1 !important;
	flex: 1 0 0%;
	min-width: calc(375px - 2rem);
	width: 100%;
	max-width: 100%;
`;

const RightView = styled.div`
	width: 400px;

	@media (max-width: 400px) {
		width: 100%;
	}
`;

export default function CartView() {
	const { auth } = useAuthContext();
	const { isAuthenticated } = auth;

	useEffect(() => {
		document.title = 'E-Shop Cart';
	}, []);

	return (
		<StyledContainer fluid>
			<Column>
				<Row>
					<LeftView>
						<Stack className="gap-3 w-100">
							<Cart />
							<SavedForLater />
						</Stack>
					</LeftView>
					<RightView>
						<CartSummary />
					</RightView>
				</Row>

				{!isAuthenticated && <SubscribeBox />}

				<RecommendedForYou
					title="Recommended for you"
					url="/products/suggest"
					card={<ProductCard />}
					LoadingComponent={<ProductCardSkeleton />}
				/>
			</Column>
		</StyledContainer>
	);
}
