import styled from 'styled-components';
import { Placeholder } from 'react-bootstrap';

const Product = styled.div`
	position: relative;
	padding: 1rem;
	border: 1px solid #dee2e6;
	border-radius: 0.375rem;
	max-width: 232px;
	background-color: white;
	/* box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px; */
`;

const ProductImage = styled.div`
	background: #c7cbce;
	margin: 0 auto 1rem;
	height: 200px;
	width: 200px;
`;

const Wrapper = styled.div`
	line-height: 1.2;
	margin: 0.5rem 0;
`;

const StyledPlaceholder = styled(Placeholder)`
	background: #c7cbce;
`;

export default function ProductCardSkeleton(props) {
	return (
		<Product>
			<Placeholder animation="glow">
				<ProductImage className="placeholder" />
			</Placeholder>
			<div className="product-body">
				<Placeholder animation="glow">
					<Wrapper>
						<StyledPlaceholder xs={5} size="sm" />
						<StyledPlaceholder xs={10} size="lg" />
					</Wrapper>
					<Wrapper>
						<StyledPlaceholder xs={7} size="lg" />
						<StyledPlaceholder xs={12} size="xs" />
					</Wrapper>
					<Wrapper>
						<StyledPlaceholder xs={6} size="lg" />
					</Wrapper>
				</Placeholder>
			</div>
		</Product>
	);
}
