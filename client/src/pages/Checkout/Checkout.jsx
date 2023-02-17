import React, { useState, useEffect, useRef } from 'react';
import { useCartSummary } from 'hooks';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';
import { Loader } from 'components';
import { api } from 'api/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { Link, useSearchParams } from 'react-router-dom';
import { Stack, Col, Row } from 'react-bootstrap';
import styled from 'styled-components';
import { CartSummary } from 'components';

const stripePromise = loadStripe(
	'pk_test_51MFZkxSFzS23wjYed4FrMTfhHhYknZRcxXnFnOkGyoVYtEgI1ihPmGse3qwOkqzynUZexB8FLF11URz4E1EEGcjC00BiUXiHZC'
);

const FlexRow = styled(Row)`
	width: 100%;
	padding: 0;
	margin: 0;

	@media (max-width: 990px) {
		flex-direction: column-reverse;
	}
`;

const LeftColumn = styled(Col)`
	background: rgba(255, 255, 255, 1);
	border: none;

	@media (max-width: 990px) {
		border-top: 1px solid gainsboro;
		padding: 20px 0px;
	}
`;

const RightColumn = styled(Col)`
	background: rgba(255, 255, 255, 1);
	border-left: 1px solid gainsboro;

	@media (max-width: 990px) {
		border: none;
		padding: 20px 0px;
	}
`;

const ElementWrapper = styled(Stack).attrs({ direction: 'vertical' })`
	max-height: 100%;
	min-height: 100vh;
`;

const Sticky = styled.div`
	position: sticky;
	inset: ${(props) =>
		`${props.top || 0}px ${props.right || 0}px ${props.bottom || 0}px ${props.left || 0}px`};
`;

export default function Checkout() {
	const { summary } = useCartSummary();
	const [paymentIntent, setPaymentIntent] = useState({});
	const [isLoading, setIsLoading] = useState(false);
	const [isError, setIsError] = useState(false);
	const didInitialise = useRef(false);

	async function createPaymentIntent() {
		setIsLoading(true);
		try {
			setIsError(false);
			const body = {
				cartId: summary._id,
				deliveryType: summary.deliveryOption.deliveryType
			};
			const { data } = await api.client.post('/checkout/create', body);
			if (data?._clst) {
				setPaymentIntent(data);
			}
			setIsLoading(false);
			return data;
		} catch (e) {
			console.log(e);
			setIsError(true);
		}
		setIsLoading(false);
	}

	async function cancelPaymentIntent(paymentIntent) {
		if (paymentIntent?._pid) {
			try {
				const body = { _pid: paymentIntent._pid };
				await api.client.post('/checkout/cancel', body);
			} catch (e) {}
		}
	}

	useEffect(() => {
		document.title = 'Eshop - Checkout';
	}, []);

	useEffect(() => {
		let _paymentIntent;
		if (summary.products?.length) {
			if (didInitialise.current) return;

			didInitialise.current = true;
			if (!paymentIntent._clst) {
				createPaymentIntent().then((data) => {
					_paymentIntent = data;
				});
			}
		}
		return () => cancelPaymentIntent(_paymentIntent);
	}, [summary.products]);

	const elementOptions = {
		clientSecret: paymentIntent._clst,
		_pid: paymentIntent._pid,
		appearance: { theme: 'stripe' }
	};

	return (
		<FlexRow>
			<Loader show={isLoading} />
			<LeftColumn lg={7}>
				<ElementWrapper>
					<div style={{ minWidth: '350px' }} className="w-100 h-100 m-auto">
						{paymentIntent._clst && (
							<div className="p-1 h-100 mb-3 bg-white">
								<Elements options={elementOptions} stripe={stripePromise}>
									<CheckoutForm />
								</Elements>
							</div>
						)}
						{isError && (
							<Stack className="align-items-center justify-content-center my-auto h-100 text-dark">
								<FontAwesomeIcon
									icon={faTriangleExclamation}
									color="#ffc107"
									fontSize="5rem"
								/>
								<h2>OOPS!!</h2>
								<div className="mb-3">
									Payment service unavailable. Try again later
								</div>
								<Link to="/" className="btn btn-warning text-dark">
									Continue Shopping
								</Link>
							</Stack>
						)}
					</div>
				</ElementWrapper>
				<footer className="py-2">
					<p className="text-center fs-7 fw-bold m-0">© 2022, E-Shop.com, Inc.</p>
				</footer>
			</LeftColumn>
			<RightColumn lg={5}>
				<Sticky top={50}>
					<CartSummary readOnly className="mx-auto" />
				</Sticky>
			</RightColumn>
		</FlexRow>
	);
}
