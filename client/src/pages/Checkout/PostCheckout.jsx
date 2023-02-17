import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { Container, Accordion, Stack, Button } from 'react-bootstrap';
import { Loader } from 'components';
import { useStripe } from '@stripe/react-stripe-js';
import { useSearchParams, Link } from 'react-router-dom';
import { MdOutlineAccessTime, MdOutlineError, MdCheckCircleOutline } from 'react-icons/md';
import { Slider } from 'components';
import ProductCard, { ProductCardSkeleton } from 'components/Cards/Product';

const stripePromise = loadStripe(
	'pk_test_51MFZkxSFzS23wjYed4FrMTfhHhYknZRcxXnFnOkGyoVYtEgI1ihPmGse3qwOkqzynUZexB8FLF11URz4E1EEGcjC00BiUXiHZC'
);

const RecommendedForYou = (props) => {
	const { title, url, card, LoadingComponent } = props;
	return (
		<div className="bg-white mt-4">
			<h4 className="fw-bold">{title}</h4>
			<Slider url={url} card={card} LoadingComponent={LoadingComponent} />
		</div>
	);
};

const TransactionStatus = (props) => {
	const { clientSecret } = props;
	const stripe = useStripe();
	const [message, setMessage] = useState();
	const [status, setStatus] = useState();
	const [Icon, setIcon] = useState();
	const [paymentInfo, setPaymentInfo] = useState();
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (!stripe) return;

		if (!clientSecret) return;

		setIsLoading(true);
		(async () => {
			try {
				const paymentInfo = await stripe.retrievePaymentIntent(clientSecret);
				if (paymentInfo) {
					setPaymentInfo(paymentInfo);
					setStatus(paymentInfo.paymentIntent.status);
					switch (paymentInfo.paymentIntent.status) {
						case 'succeeded':
							setMessage('Order Confirmed!!');
							setIcon(MdCheckCircleOutline);
							break;
						case 'processing':
							setMessage('Your payment is processing.');
							setIcon(MdOutlineAccessTime);
							break;
						case 'requires_payment_method':
							setMessage('Your payment was not successful, please try again.');
							setIcon(MdOutlineError);
							break;
						default:
							setMessage('Something went wrong.');
							setIcon(MdOutlineError);
							break;
					}
				}
			} catch (error) {
				console.log(error.message);
			} finally {
				setIsLoading(false);
			}
		})();
	}, [stripe]);

	return (
		<>
			<Loader show={isLoading} />
			{!isLoading && (
				<div className="text-center my-3">
					{Icon && React.cloneElement(Icon, { size: '86px' })}
					<div className="mb-2 fw-bold fs-3">{message}</div>
					<div className="fw-bold">{`Payment Id: ${
						paymentInfo?.paymentIntent?.id || ''
					}`}</div>
					{paymentInfo?.paymentIntent?.metadata?.orderId && (
						<div className="fw-bold">{`Order Id: ${
							paymentInfo?.paymentIntent?.metadata?.orderId || ''
						}`}</div>
					)}
				</div>
			)}
		</>
	);
};

export default function PostCheckout() {
	const [urlParams] = useSearchParams();
	const [clientSecret] = useState(urlParams.get('payment_intent_client_secret'));

	return (
		<Container className="position-relative bg-white p-3">
			<div className="text-center my-3">
				{clientSecret && (
					<Elements options={{ clientSecret }} stripe={stripePromise}>
						<TransactionStatus clientSecret={clientSecret} />
					</Elements>
				)}
			</div>
			<div className="text-center my-3">
				<Link className="btn btn-warning" to="/">
					Continue Shopping
				</Link>
			</div>
			<RecommendedForYou
				title="Recommended for you"
				url="/products/suggest"
				card={<ProductCard showAction={false} />}
				LoadingComponent={<ProductCardSkeleton />}
			/>
		</Container>
	);
}
