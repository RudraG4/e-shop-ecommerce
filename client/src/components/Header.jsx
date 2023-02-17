import { createSearchParams, Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import {
	DropDown,
	NavBar,
	Badge,
	SearchBar,
	Logo,
	Announcement,
	List,
	AddressWindow
} from 'components';
import { useAuthContext, useCartContext, usePreferenceContext } from 'hooks';
import { Stack } from 'react-bootstrap';
import React, { useState } from 'react';
import styled from 'styled-components';

const NavLeft = styled.div`
	height: 60px;
	margin-right: auto !important;
`;

const NavFill = styled.div`
	height: 60px;
	flex: 1 1 auto;
	display: flex;
	align-items: center;
`;

const NavRight = styled.div`
	height: 60px;
	margin-left: auto !important;
`;

const StyledNavLink = styled(Link)`
	color: inherit;
	line-height: 1.25 !important;
	padding: 0 !important;
	width: 100% !important;
	font-size: 14px;

	&::after {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 1;
		content: '';
	}
`;

const NavBarNav = styled(List)`
	display: flex;
	flex-direction: row;
	align-items: center;
	align-self: stretch;
	flex-wrap: nowrap !important;
	justify-content: flex-end !important;
	gap: 0.5rem !important;
`;

const NavBarItem = styled.li`
	position: relative;
	color: white;
	border: 1px solid transparent;
	border-radius: 0.2rem;

	&:hover {
		border-color: #fff !important;
	}
`;

const ContentWrapper = styled(Stack).attrs({ direction: 'vertical' })`
	color: inherit;
	line-height: 1.25 !important;
	padding: 0 !important;
	width: 100% !important;
	/* max-width: 80px; */
	font-size: 14px;
	justify-content: flex-end !important;
	cursor: pointer;
	overflow: hidden;
`;

const AddressSelector = () => {
	const { preference } = usePreferenceContext();
	const { delivery } = preference;
	const [show, setIsShow] = useState(false);

	const onClick = () => {
		setIsShow(true);
	};
	const onHide = () => {
		setIsShow(false);
	};

	return (
		<>
			<div className="hstack align-items-end p-2" onClick={onClick}>
				<div className="vstack justify-content-end pe-2 mb-1">
					<FontAwesomeIcon icon={faLocationDot} />
				</div>
				<div className="vstack justify-content-end">
					<ContentWrapper>
						<small>{delivery?.country ? 'Deliver to' : 'Hello'}</small>
						<div className="fw-bold">
							{delivery?.country ? delivery.country.label : 'Select your address'}
						</div>
					</ContentWrapper>
				</div>
			</div>
			{show && <AddressWindow show={show} onHide={onHide} />}
		</>
	);
};

const CurrencySelector = () => {
	const { preference, setCurrency } = usePreferenceContext();
	const { currency } = preference;
	const currencies = ['INR', 'USD'];
	const style = {
		'--bs-dropdown-link-active-bg': '#ffc107',
		'--bs-dropdown-link-active-color': '#000'
	};
	return (
		<DropDown>
			<DropDown.Toggle>
				<ContentWrapper>
					<small className="fw-normal text-truncate">Currency</small>
					<div className="fw-bold">{currency}</div>
				</ContentWrapper>
			</DropDown.Toggle>
			<DropDown.Menu>
				{currencies.map((_curr, _index) => {
					return (
						<Link
							key={_index}
							className={`dropdown-item ${currency === _curr ? 'active' : ''}`}
							style={style}
							onClick={() => setCurrency(_curr)}
						>
							{_curr}
						</Link>
					);
				})}
			</DropDown.Menu>
		</DropDown>
	);
};

const SignInBlock = () => {
	return (
		<Stack>
			<Link className="btn btn-warning w-100 mb-1" to="/auth/signin">
				Sign In
			</Link>
			<div className="text-center" style={{ fontSize: '14px' }}>
				<span>New customer? </span>
				<span>
					<Link to="/auth/register" className="text-underline-hover fw-semibold">
						Start here
					</Link>
				</span>
			</div>
			<hr />
		</Stack>
	);
};

const AccountActionSelector = () => {
	const { auth } = useAuthContext();
	const { isAuthenticated, currentUser } = auth;
	const userName =
		isAuthenticated && currentUser?.name ? currentUser.name.split(' ')[0] : 'Sign in';
	const content = `Hello, ${userName}`;
	const style = { fontSize: '13px' };

	return (
		<DropDown>
			<DropDown.Toggle>
				<StyledNavLink to="/account">
					<ContentWrapper>
						<small className="fw-normal text-truncate">{content}</small>
						<div className="fw-bold">Accounts</div>
					</ContentWrapper>
				</StyledNavLink>
			</DropDown.Toggle>
			<DropDown.Menu style={{ left: '-50%' }}>
				<div className="p-3">
					<Stack style={{ width: '250px' }}>
						{!isAuthenticated && <SignInBlock />}
						<Stack>
							<div className="fw-bold">Your Account</div>
							<Link className="text-underline-hover" style={style} to="/account">
								Your Account
							</Link>
							<Link
								className="text-underline-hover"
								style={style}
								to="/account/order-history"
							>
								Your Orders
							</Link>
							{isAuthenticated && (
								<>
									{currentUser && currentUser.admin && (
										<Link
											className="text-underline-hover"
											style={style}
											to="/dashboard"
										>
											Dashboard
										</Link>
									)}
									<Link
										className="text-underline-hover"
										style={style}
										to="/pbhistory"
									>
										Browsing History
									</Link>
									<hr className="my-2" />
									<Link
										className="text-underline-hover"
										style={style}
										to="/auth/signout"
									>
										Signout
									</Link>
								</>
							)}
						</Stack>
					</Stack>
				</div>
			</DropDown.Menu>
		</DropDown>
	);
};

const MyOrders = () => {
	return (
		<div className="p-2">
			<StyledNavLink to="/account/order-history">
				<ContentWrapper>
					<small>My</small>
					<div className="fw-bold">Orders</div>
				</ContentWrapper>
			</StyledNavLink>
		</div>
	);
};

const CartBadge = () => {
	const { cart } = useCartContext();
	const { totalProducts } = cart;
	return (
		<div className="p-2">
			<StyledNavLink to="/cart">
				<Badge badgeContent={totalProducts}>
					<FontAwesomeIcon icon={faCartShopping} fontSize="1.75rem" />
				</Badge>
			</StyledNavLink>
		</div>
	);
};

export default function Header() {
	const [isFocused, setIsFocused] = useState(false);
	const navigate = useNavigate();

	const onSearch = (searchParam) => {
		setIsFocused(false);
		if (searchParam.category === 'all' && !searchParam.keyword) {
			return navigate('/');
		}
		navigate({
			pathname: '/products',
			search: `${createSearchParams(searchParam)}`
		});
	};

	const onFocus = () => setIsFocused(true);

	const onBlur = () => setIsFocused(false);

	return (
		<header>
			<div className="position-relative" style={{ zIndex: 1050 }}>
				<NavBar className="bg-dark">
					<NavLeft>
						<NavBarNav className="navbar-nav">
							<Logo size="md" color="white" />
							<NavBarItem className="nav-item">
								<AddressSelector />
							</NavBarItem>
						</NavBarNav>
					</NavLeft>
					<NavFill>
						<SearchBar
							onSearch={onSearch}
							onFocus={onFocus}
							onBlur={onBlur}
							className=""
						/>
					</NavFill>
					<NavRight>
						<NavBarNav className="navbar-nav">
							<NavBarItem className="nav-item">
								<CurrencySelector />
							</NavBarItem>
							<NavBarItem className="nav-item">
								<AccountActionSelector />
							</NavBarItem>
							<NavBarItem className="nav-item">
								<MyOrders />
							</NavBarItem>
							<NavBarItem className="nav-item">
								<CartBadge />
							</NavBarItem>
						</NavBarNav>
					</NavRight>
				</NavBar>
				<Announcement />
			</div>
			{isFocused && (
				<div
					className="position-absolute top-0 start-0 w-100 h-100 d-block bg-dark opacity-75"
					style={{ zIndex: 1000 }}
				></div>
			)}
		</header>
	);
}
