import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Container } from 'react-bootstrap';
import { useEffect } from 'react';

const AccountContainer = styled(Container)`
	max-width: 1260px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	gap: 1rem;
	margin-bottom: 30px;
`;

const AccountCard = ({ title, subTitle, image, to = '#' }) => {
	return (
		<div className="flex-grow-1" style={{ width: '320px', maxWidth: '320px' }}>
			<Link to={to} className="text-decoration-none ">
				<div className="card bg-white h-100 box-hover">
					<div className="row m-0 p-3 h-100">
						<div className="col-md-3 p-0">
							<img
								width="70px"
								height="70px"
								src={image}
								srcSet={image}
								alt={`${title} ${subTitle}`}
							/>
						</div>
						<div className="col-md-9 p-0">
							<div className="card-body p-0 ms-1 flex-grow-1 h-100">
								<h5 className="card-title">{title}</h5>
								<div className="lh-sm text-muted">{subTitle}</div>
							</div>
						</div>
					</div>
				</div>
			</Link>
		</div>
	);
};

const MenuItems = [
	{
		title: 'Your Orders',
		subTitle: 'Track, return, or buy again',
		to: '/account/order-history',
		image: '/assets/account/orders.png'
	},
	{
		title: 'Login & Security',
		subTitle: 'Edit login, name and mobile number',
		to: '/account/mydetails',
		image: '/assets/account/security.png'
	},
	{
		title: 'Your Payments',
		subTitle: 'View all transactions and payment methods',
		to: '/account/payments',
		image: '/assets/account/payments.png'
	},
	{
		title: 'Your Addresses',
		subTitle: 'Edit addresses for orders',
		to: '/account/addresses',
		image: '/assets/account/addresses.png'
	},
	{
		title: 'Your Saved Items',
		subTitle: 'Manage, add or remove saved items',
		to: '/account/saveditems',
		image: '/assets/account/wishlist.png'
	},
	{
		title: 'Account Preferences',
		subTitle: 'Manage your account preferences',
		to: '/account/preference',
		image: '/assets/account/preferences.png'
	},
	{
		title: 'Browsing History',
		subTitle: 'View your products browsing history',
		to: '/account/pbhistory',
		image: '/assets/account/preferences.png'
	}
];
export default function Account() {
	useEffect(() => {
		document.title = 'Your Account';
	}, []);

	return (
		<AccountContainer className="p-3">
			<h2 className="mb-3">Your Account</h2>

			<section className="hstack justify-content-center flex-wrap gap-3 m-auto">
				{MenuItems.map((_items, _index) => (
					<AccountCard key={_index} {..._items} />
				))}
			</section>
		</AccountContainer>
	);
}
