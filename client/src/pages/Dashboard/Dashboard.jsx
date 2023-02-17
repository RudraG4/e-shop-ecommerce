import { Routes, Route } from 'react-router-dom';
import Topbar from './components/Topbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Analytics from './pages/Analytics';
import ComingSoon from './pages/ComingSoon';
import Users from './pages/Users/Users';
import Products from './pages/Products/Products';
import Categories from './pages/Categories/Categories';
import styled from 'styled-components';

const Container = styled.div`
	position: relative;
	display: flex;
	min-height: calc(100vh - 50px);
	height: calc(100vh - 50px);
`;
const ContentContainer = styled.div`
	position: relative;
	flex: 2;
	overflow: auto;
`;

export default function Dashboard() {
	return (
		<div>
			<Topbar />
			<Container>
				<Sidebar />
				<ContentContainer>
					<Routes>
						<Route path="/">
							<Route index path="/" element={<Home />} />
							<Route path="analytics" element={<Analytics />} />
							<Route path="users" element={<Users />} />
							<Route path="categories" element={<Categories />} />
							<Route path="products" element={<Products />} />
							<Route path="*" element={<ComingSoon />} />
						</Route>
					</Routes>
				</ContentContainer>
			</Container>
		</div>
	);
}
