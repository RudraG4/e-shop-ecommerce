import { useEffect } from 'react';
import { Slider, SubscribeBox, EshopBanner } from 'components';
import BannerCard, { BannerCardSkeleton } from 'components/Cards/Banner';
import ProductCard, { ProductCardSkeleton } from 'components/Cards/Product';
import CategoryCard, { CategoryCardSkeleton } from 'components/Cards/Category';
import { useAuthContext } from 'hooks';
import styled from 'styled-components';
import { Container } from 'react-bootstrap';

const HomeContainer = styled(Container)`
	max-width: 1200px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	gap: 1rem;
	margin-bottom: 30px;
`;

const Banner = styled(Slider)`
	.slider-container .slider-list {
		padding: 0 !important;
	}
`;

const Wrapper = ({ children }) => {
	return <div className="bg-white p-3">{children}</div>;
};

const Title = ({ title }) => {
	return <h4 className="fw-bold">{title}</h4>;
};

export default function Home() {
	const { auth } = useAuthContext();
	const { isAuthenticated } = auth;

	useEffect(() => {
		document.title = 'Online Shopping';
	}, []);

	return (
		<Container fluid className="p-0">
			<Banner
				url="/categories"
				serviceParams={{ skip: 0, limit: 5 }}
				infiniteScroll
				autoScroll
				scrollDuration={5000}
				showTrackers
				card={<BannerCard />}
				LoadingComponent={<BannerCardSkeleton />}
				className="p-0"
			/>

			<HomeContainer className="p-3 bg-white">
				<Wrapper>
					<Title title="Shop by Category" />
					<Slider
						url="/categories"
						serviceParams={{ skip: 0, limit: 1000, sort: 'name', direction: 'ASC' }}
						card={<CategoryCard />}
						LoadingComponent={<CategoryCardSkeleton />}
					/>
				</Wrapper>

				<Wrapper>
					<Title title="Recently Viewed" />
					<Slider
						url="/products"
						card={<ProductCard showPrice={false} showAction={false} />}
						LoadingComponent={<ProductCardSkeleton />}
					/>
				</Wrapper>

				<Wrapper>
					<Title title="Featured Products" />
					<Slider
						url="/products"
						card={<ProductCard />}
						LoadingComponent={<ProductCardSkeleton />}
					/>
				</Wrapper>

				<Wrapper>
					<Title title="Laptops" />
					<Slider
						url="/products?category=laptops"
						card={<ProductCard />}
						LoadingComponent={<ProductCardSkeleton />}
					/>
				</Wrapper>

				<Wrapper>
					<Title title="Smartphones" />
					<Slider
						url="/products?category=smartphones"
						card={<ProductCard />}
						LoadingComponent={<ProductCardSkeleton />}
					/>
				</Wrapper>

				{!isAuthenticated && (
					<Wrapper>
						<SubscribeBox />
					</Wrapper>
				)}

				<Wrapper>
					<Title title="Recommended for you" />
					<Slider
						url="/products/suggest"
						card={<ProductCard />}
						LoadingComponent={<ProductCardSkeleton />}
					/>
				</Wrapper>

				<Wrapper>
					<EshopBanner className="ps-2 pe-2" />
				</Wrapper>
			</HomeContainer>
		</Container>
	);
}
