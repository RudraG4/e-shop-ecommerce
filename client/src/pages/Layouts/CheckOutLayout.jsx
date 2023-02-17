import { Outlet } from 'react-router';
import { Logo, NavBar } from 'components';
import { Stack } from 'react-bootstrap';
import styled from 'styled-components';

const Header = styled.header`
	width: 100%;
	z-index: 1400;
`;

const Container = styled(Stack).attrs({ direction: 'vertical' })`
	width: 100%;
	padding: 0px;
	background: rgba(255, 255, 255, 1);
	min-height: 100vh;
	max-height: 100vh;
	position: relative;
`;

const NavLeft = styled.div`
	height: 60px;
	display: flex;
	align-items: center;
	justify-content: space-between;
`;

const OutletWrapper = styled(Stack).attrs({ direction: 'vertical' })`
	min-height: 100vh;
`;

export default function CheckOutLayout() {
	return (
		<Container>
			<Header>
				<NavBar className="align-items-center">
					<NavLeft className="w-100">
						<Logo size="md" color="dark" />
						<div className="fs-2 fw-bold text-dark ms-3">Checkout</div>
					</NavLeft>
				</NavBar>
			</Header>

			<OutletWrapper>
				<Outlet />
			</OutletWrapper>
		</Container>
	);
}
