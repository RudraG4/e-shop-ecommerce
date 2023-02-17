import { Outlet } from 'react-router';
import { Logo, NavBar } from 'components';
import { Stack, Col, Row } from 'react-bootstrap';
import styled from 'styled-components';

const SharedContainer = styled(Stack).attrs({ direction: 'vertical' })`
	width: 100%;
	padding: 0px;
	background: rgba(248, 249, 250, 1);
	min-height: 100vh;
`;

const Background = styled(Col)`
	background: rgba(248, 249, 250, 1);
	color: rgba(33, 37, 41, 1);
	padding: 0;
`;

const Center = styled(Stack).attrs({ direction: 'vertical' })`
	display: flex;
	flex: 1 1 auto;
	flex-direction: column;
	align-self: stretch;
	justify-content: center !important;
	align-items: center !important;
`;

const Footer = styled.footer`
	height: 60px;
	width: 100%;
	display: flex;
	align-items: center !important;
	justify-content: center !important;
`;

const NavLeft = styled.div`
	height: 60px;
	display: flex;
	align-items: center;
	justify-content: space-between;
`;

export default function SharedAuthLayout() {
	return (
		<SharedContainer>
			<Row className="w-100 p-0 m-0 flex-grow-1">
				<Background>
					<Stack className="h-100">
						<NavBar className="w-100">
							<NavLeft className="w-100">
								<Logo size="md" />
							</NavLeft>
						</NavBar>
						<Center className="px-3 h-100">
							<Outlet />
						</Center>
						<Footer className="px-3">
							<p className="text-center fs-7 fw-bold m-0 w-100">
								© 2022, E-Shop.com, Inc.
							</p>
						</Footer>
					</Stack>
				</Background>
			</Row>
		</SharedContainer>
	);
}
