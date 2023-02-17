import React, { Fragment, useEffect, useState } from 'react';
import ShippingAddress from './ShippingAddress';
import PaymentCheckoutForm from './PaymentCheckoutForm';
import ItemConfirmation from './ItemConfirmation';
import styled from 'styled-components';
import { Accordion, Stack, Button } from 'react-bootstrap';
import { Loader } from 'components';
import { useStripe, useElements } from '@stripe/react-stripe-js';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const SAccordian = styled(Accordion)`
	--bs-accordion-border-color: transparent;
	--bs-accordion-active-bg: white;
	--bs-accordion-active-color: black;
	max-width: 500px;
	margin: auto;
`;
const AccordianContent = styled.div`
	margin: auto;
`;

const SAccordionHeader = styled(Accordion.Header)`
	> .accordion-button {
		padding: 0.5rem;
		align-items: flex-start;

		&:focus {
			box-shadow: none;
		}

		&:after {
			margin-top: 10px;
		}

		&:not(.collapsed)::after {
			--bs-accordion-btn-active-icon: var(--bs-accordion-btn-icon);
		}
	}
`;

const SATabWrapper = styled.div`
	display: flex;
	justify-content: flex-start;
	align-items: flex-start;
	flex-grow: 1;
	cursor: pointer;
`;

const SAKey = styled.div.attrs({ className: 'btn btn-light' })`
	border-radius: 50%;
	border: 1px solid #dee2e6;
	font-weight: 700;
	padding-top: 0.5rem !important;
	padding-bottom: 0.5rem !important;
	padding-right: 1rem !important;
	padding-left: 1rem !important;

	&.is-active {
		--bs-btn-bg: #ffc107;
		--bs-btn-hover-bg: #ffc107;
		--bs-btn-active-bg: #ffc107;
		--bs-btn-border-color: #ffc107;
		--bs-btn-hover-border-color: #ffc107;
		--bs-btn-active-border-color: #ffc107;
	}
`;

const SATitleWrapper = styled(Stack).attrs({ direction: 'vertical' })`
	justify-content: center;
	flex-grow: 1;
	margin-left: 0.5rem;
`;

const SATitle = styled.div`
	font-size: 1.25rem;
	font-weight: 700;
`;

const SASubtitle = styled.div``;

export default function CheckoutForm() {
	const initData = {
		step: 1,
		name: '',
		mobilenumber: '',
		address: '',
		paymentMode: ''
	};
	const stripe = useStripe();
	const elements = useElements();
	const navigate = useNavigate();
	const [data, setData] = useState(initData);
	const [error, setError] = useState(null);
	const [isPaying, setIsPaying] = useState(false);
	const { step, name, address } = data;

	const prevStep = () => {
		setData((oldData) => {
			return { ...oldData, step: oldData.step - 1 };
		});
	};

	const nextStep = () => {
		setData((oldData) => {
			return { ...oldData, step: oldData.step + 1 };
		});
	};

	const setStep = (step) => {
		setData((oldData) => {
			return { ...oldData, step: step };
		});
	};

	const handleStepClick = (curStep) => () => {
		if (step > curStep) setStep(curStep);
	};

	const onAddressChange = ({ name, address }) => {
		setData((oldData) => {
			return { ...oldData, name, address };
		});
	};

	const onPaymentChange = ({ type }) => {
		setData((oldData) => {
			return {
				...oldData,
				payment: { type }
			};
		});
	};

	const notify = () => {
		return (
			error?.message &&
			toast.error(error?.message, {
				position: 'bottom-center',
				autoClose: 5000,
				hideProgressBar: true,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: 'light'
			})
		);
	};

	const onConfirm = async (e) => {
		e.preventDefault();

		if (!stripe || !elements) return;

		setIsPaying(true);
		setError();

		const paymentObj = {
			elements,
			confirmParams: {
				return_url: `${location.origin}/checkout_post`
			}
		};
		const { error } = await stripe.confirmPayment(paymentObj);

		setError(error);
		setIsPaying(false);
	};

	const onCancel = async (e) => {
		e.preventDefault();
		navigate('/cart');
	};

	useEffect(() => {
		if (error?.message) {
			if (error.type === 'validation_error') {
				setStep(1);
			} else {
				setStep(2);
			}
		}
		notify();
	}, [error]);

	return (
		<Fragment>
			<Loader show={isPaying} />
			<div className="position-relative">
				<SAccordian defaultActiveKey={step} activeKey={step}>
					<Accordion.Item eventKey={1}>
						<AccordianContent>
							<SAccordionHeader onClick={handleStepClick(1)}>
								<SATabWrapper>
									<SAKey className={step === 1 ? 'is-active' : ''}>{1}</SAKey>
									<SATitleWrapper>
										<SATitle>Delivery Address</SATitle>
										<SASubtitle>
											{name && (
												<div>
													<small>{name}</small>
												</div>
											)}
											{address && (
												<div>
													<small>
														{[
															address.line1,
															address.line2,
															address.city,
															address.state,
															address.postal_code,
															address.country
														].join(', ')}
													</small>
												</div>
											)}
										</SASubtitle>
									</SATitleWrapper>
								</SATabWrapper>
							</SAccordionHeader>
							<Accordion.Body>
								<ShippingAddress nextStep={nextStep} onChange={onAddressChange} />
							</Accordion.Body>
						</AccordianContent>
					</Accordion.Item>

					<Accordion.Item eventKey={2}>
						<AccordianContent>
							<SAccordionHeader onClick={handleStepClick(2)}>
								<SATabWrapper>
									<SAKey className={step === 2 ? 'is-active' : ''}>{2}</SAKey>
									<SATitleWrapper>
										<SATitle>Payment method</SATitle>
										<SASubtitle>
											<div>
												<small className="text-capitalize">
													{data.payment?.type
														? `Pay with ${data.payment?.type}`
														: ''}
												</small>
											</div>
										</SASubtitle>
									</SATitleWrapper>
								</SATabWrapper>
							</SAccordionHeader>
							<Accordion.Body>
								<PaymentCheckoutForm
									prevStep={prevStep}
									nextStep={nextStep}
									onChange={onPaymentChange}
									value={data.address}
								/>
							</Accordion.Body>
						</AccordianContent>
					</Accordion.Item>

					<Accordion.Item eventKey={3}>
						<AccordianContent>
							<SAccordionHeader onClick={handleStepClick(3)}>
								<SATabWrapper>
									<SAKey className={step === 3 ? 'is-active' : ''}>{3}</SAKey>
									<SATitleWrapper>
										<SATitle>Confirmation</SATitle>
									</SATitleWrapper>
								</SATabWrapper>
							</SAccordionHeader>
							<Accordion.Body>
								{step === 3 && (
									<ItemConfirmation
										prevStep={prevStep}
										onConfirm={onConfirm}
										isPaying={isPaying}
									/>
								)}
							</Accordion.Body>
						</AccordianContent>
					</Accordion.Item>

					<div className="d-grid gap-2 py-0 accordion-body">
						<Button variant="light" className="border" onClick={onCancel}>
							Cancel
						</Button>
					</div>
				</SAccordian>
			</div>
		</Fragment>
	);
}
