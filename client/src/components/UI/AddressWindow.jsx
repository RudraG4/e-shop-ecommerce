import { Modal } from 'react-bootstrap';
import { useAuthContext } from 'hooks';
import { Divider, DropDown, Loader } from 'components';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import UserService from 'services/UserService';
import styled from 'styled-components';

const DeliveryList = styled.ul`
	.list-item button.active {
		border-color: #fdd300 !important;
		background: #f9ebba;
	}

	.list-item button:disabled {
		opacity: 1 !important;
	}
`;

const DeliveryAddressItem = (props) => {
	const { data = {}, onClick = () => {} } = props;
	const { _id, address = {}, name = '', isDefault = false } = data;
	const fullAddressString = [
		address.line1,
		address.line2,
		address.city,
		address.state,
		address.postal_code,
		address.country
	]
		.filter((_) => _)
		.join(', ');

	const onOptionClick = () => {
		onClick(data);
	};

	return (
		<li className="list-item mb-2" data-id={_id}>
			<Button
				variant="light"
				className={`text-start border ${isDefault ? 'active' : ''} w-100`}
				disabled={isDefault === 'true'}
				onClick={onOptionClick}
			>
				<div className="fs-7 fw-bold">{name}</div>
				<div className="fs-7">{fullAddressString}</div>

				{isDefault && (
					<div className="fs-7 fw-bold mt-2 text-secondary">Default address</div>
				)}
			</Button>
		</li>
	);
};

export default function AddressWindow(props) {
	const { show, onHide = () => {} } = props;
	const { auth } = useAuthContext();
	const countries = [{ label: 'India', code: 'IN' }];
	const [_delivery, _setDelivery] = useState();
	const [isLoading, setIsLoading] = useState(false);
	const [addresses, setAddresses] = useState([]);

	const style = {
		'--bs-dropdown-link-active-bg': '#ffc107',
		'--bs-dropdown-link-active-color': '#000'
	};

	const onOptionClick = (country) => {
		_setDelivery({ country });
		onHide();
	};

	const onAddressSelect = async (address) => {
		setIsLoading(true);
		await UserService.addressChange(address._id);
		setIsLoading(false);
		onHide();
	};

	useEffect(() => {
		(async () => {
			if (auth.isAuthenticated) {
				try {
					setIsLoading(true);
					const data = await UserService.getUserAddresses();
					setAddresses(data.results);
				} catch (error) {
					console.log(error);
				} finally {
					setIsLoading(false);
				}
			}
		})();
	}, [auth]);

	return (
		<Modal show={show} onHide={onHide} size="sm" centered className="rounded-1">
			<Modal.Header className="border py-2" closeButton>
				<Modal.Title className="fs-6 fw-bold">Choose your location</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Loader show={isLoading} position="absolute" />
				<div className="group">
					<div className="address-list">
						<div className="address-block">
							<div className="fs-7 mb-3">
								Select a delivery location to deliver your products
							</div>
							{!auth.isAuthenticated ? (
								<div className="d-grid">
									<Button
										variant="warning"
										as="a"
										className="mb-1"
										href="/auth/signin"
									>
										Sign in to see your addresses
									</Button>
								</div>
							) : (
								<DeliveryList>
									{addresses?.map((delivery, _index) => (
										<DeliveryAddressItem
											data={delivery}
											key={_index}
											onClick={onAddressSelect}
										/>
									))}
								</DeliveryList>
							)}
						</div>
					</div>
					<Divider message="or" />
					<div className="mb-3">
						<DropDown className="border rounded-1">
							<DropDown.Toggle>
								{_delivery?.country?.label || 'Select location'}
							</DropDown.Toggle>
							<DropDown.Menu>
								{countries.map((country, _index) => {
									return (
										<Link
											key={`${country.code}_${_index}`}
											className={`dropdown-item active`}
											style={style}
											onClick={() => onOptionClick(country)}
										>
											{country.label}
										</Link>
									);
								})}
							</DropDown.Menu>
						</DropDown>
					</div>
				</div>
			</Modal.Body>
		</Modal>
	);
}
