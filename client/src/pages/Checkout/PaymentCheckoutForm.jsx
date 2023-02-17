import { PaymentElement } from '@stripe/react-stripe-js';
import React from 'react';
import { Button, Form } from 'react-bootstrap';

export default function PaymentCheckoutForm(props) {
	const { nextStep, onChange } = props;

	const Continue = (e) => {
		e.preventDefault();
		nextStep(e);
	};

	return (
		<div>
			<PaymentElement
				id="payment-element"
				options={{ layout: 'tabs' }}
				onChange={(event) => {
					if (event.complete) {
						onChange(event.value);
					}
				}}
			/>
			<Form.Group className="d-grid my-3">
				<Button type="submit" variant="warning" onClick={Continue} tabIndex="4">
					Use this payment
				</Button>
			</Form.Group>
		</div>
	);
}
