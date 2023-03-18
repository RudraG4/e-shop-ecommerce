import { Button } from 'react-bootstrap';
import { AddressElement } from '@stripe/react-stripe-js';
import useAuthContext from 'hooks/useAuthContext';

export default function ShippingAddress(props) {
	const { nextStep, onChange } = props;
	const { auth } = useAuthContext();

	const Continue = (e) => {
		e.preventDefault();
		nextStep(e);
	};

	const options = {
		mode: 'shipping',
		allowedCountries: ['IN', 'US'],
		defaultValues: {
			name: auth.currentUser.name,
			address: {
				line1: '',
				line2: '',
				city: '',
				country: '',
				state: '',
				postal_code: ''
			}
		}
	};

	return (
		<div>
			<AddressElement
				options={options}
				onChange={(event) => event.complete && onChange(event.value)}
			/>
			<div className="d-grid my-3">
				<Button type="submit" variant="warning" onClick={Continue} tabIndex="4">
					Use this address
				</Button>
			</div>
		</div>
	);
}
