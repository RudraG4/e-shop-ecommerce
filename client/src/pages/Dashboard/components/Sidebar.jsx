import {
	IoHome,
	IoAnalyticsSharp,
	IoTrendingUpSharp,
	IoPeopleSharp,
	IoStorefrontSharp,
	IoBarChartSharp,
	IoSettingsSharp,
	IoNotificationsSharp,
	IoLogOutSharp,
	IoInformationCircleSharp
} from 'react-icons/io5';
import { FaRupeeSign } from 'react-icons/fa';
import { BiCategory } from 'react-icons/bi';
import { RxDoubleArrowRight, RxDoubleArrowLeft } from 'react-icons/rx';
import { Link, NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { useState } from 'react';

const SideBar = styled.div`
	position: sticky;
	top: 51px;
	left: 0;
	width: ${(props) => (props.show ? '200px' : '0px')};
	max-width: 250px;
	padding: 20px 10px;
	border-right: 1px solid rgb(0 0 0 /5%);
	background-color: white;
	z-index: 1020;

	@media screen and (max-width: 580px) {
		width: ${(props) => (props.show ? '72px' : '0px')};
	}
`;

const SideBarGroup = styled.div`
	margin-bottom: 1rem;
`;

const SideBarButtonGroup = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	gap: 0.2rem;

	@media screen and (max-width: 580px) {
		align-items: center;
	}
`;

const SideBarNavToggler = styled.div`
	display: none;
	position: absolute;
	width: 20px;
	height: 40px;
	top: 18px;
	right: -20px;
	background: black;
	color: white;
	padding: 0px 2px;
	border-top-right-radius: 5px;
	border-bottom-right-radius: 5px;
	cursor: pointer;

	@media screen and (max-width: 580px) {
		display: block;
	}
`;

const SideBarNav = styled.nav`
	flex: 1 1 auto;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	width: 100%;
	height: 100%;

	${SideBarGroup}:last-child {
		margin-top: auto;
		margin-bottom: 0px;
	}
`;

const SideBarHeader = styled.div`
	font-weight: 700;
	color: rgb(0, 0, 0, 60%);
	margin-bottom: 5px;

	@media screen and (max-width: 580px) {
		font-size: 8px;
		text-align: center;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}
`;

const SideBarButton = styled(NavLink)`
	position: relative;
	outline: 0;
	border: 0;
	border-left: 2px solid transparent;
	background: white;
	display: flex;
	align-items: center;
	justify-content: flex-start;
	gap: 0.5rem;
	padding: 5px 10px;
	height: 30px;
	border-radius: 0;
	text-decoration: none;

	&:hover {
		background: rgba(0, 0, 0, 5%);
	}

	&.active {
		background: rgba(0, 0, 0, 5%);
		border-left-color: black;
	}

	> svg {
		width: 30px;
	}

	@media screen and (max-width: 580px) {
		width: 30px;
		padding: 0px;

		> span {
			opacity: 0;
			visibility: hidden;
			position: absolute;
			left: 52px;
			font-size: 10px;
			background: rgb(0, 0, 0, 95%);
			color: white;
			padding: 2px 6px;
			border-radius: 4px;
			transition: width 0.2s ease-in-out;
		}

		&:hover > span {
			opacity: 1;
			visibility: visible;
		}
	}
`;

export default function Sidebar() {
	const [show, setShow] = useState(true);

	return (
		<SideBar show={show}>
			<SideBarNavToggler onClick={() => setShow(!show)}>
				{show ? <RxDoubleArrowLeft /> : <RxDoubleArrowRight />}
			</SideBarNavToggler>
			{show && (
				<SideBarNav>
					<SideBarGroup>
						<SideBarHeader>Dashboard</SideBarHeader>
						<SideBarButtonGroup>
							<SideBarButton to="" end>
								<IoHome />
								<span>Home</span>
							</SideBarButton>
							<SideBarButton to="analytics">
								<IoAnalyticsSharp />
								<span>Analytics</span>
							</SideBarButton>
						</SideBarButtonGroup>
					</SideBarGroup>
					<SideBarGroup>
						<SideBarHeader>Quick Menu</SideBarHeader>
						<SideBarButtonGroup>
							<SideBarButton to="users">
								<IoPeopleSharp />
								<span>Users</span>
							</SideBarButton>
							<SideBarButton to="categories">
								<BiCategory />
								<span>Categories</span>
							</SideBarButton>
							<SideBarButton to="products">
								<IoStorefrontSharp />
								<span>Products</span>
							</SideBarButton>
							<SideBarButton to="transactions">
								<FaRupeeSign />
								<span>Transactions</span>
							</SideBarButton>
							<SideBarButton to="reports">
								<IoBarChartSharp />
								<span>Reports</span>
							</SideBarButton>
						</SideBarButtonGroup>
					</SideBarGroup>
					<SideBarGroup>
						<SideBarHeader>Common</SideBarHeader>
						<SideBarButtonGroup>
							<SideBarButton to="notifications">
								<IoNotificationsSharp />
								<span>Notifications</span>
							</SideBarButton>
							<SideBarButton to="settings">
								<IoSettingsSharp />
								<span>Settings</span>
							</SideBarButton>
							<SideBarButton to="info">
								<IoInformationCircleSharp />
								<span>Info</span>
							</SideBarButton>
						</SideBarButtonGroup>
					</SideBarGroup>
					<SideBarGroup>
						<SideBarButtonGroup>
							<SideBarButton to="/auth/signout">
								<IoLogOutSharp />
								<span>Logout</span>
							</SideBarButton>
						</SideBarButtonGroup>
					</SideBarGroup>
				</SideBarNav>
			)}
		</SideBar>
	);
}
