import { useNavigate } from 'react-router-dom';
import { useCartSummary } from 'hooks';
import { Alert, Divider, PromoChecker, ToggleButtonGroup, Card, Loader } from 'components';
import { Fragment } from 'react';
import { Stack, Button } from 'react-bootstrap';

const DeliveryOption = (props) => {
	const { onChange, type, info, expected, readOnly = false } = props;

	return (
		<Stack>
			<div className="text-body mb-2">Delivery Options</div>
			<div className="text-body mb-2">
				<ToggleButtonGroup value={type} onChange={onChange} disabled={readOnly}>
					<ToggleButtonGroup.Button value="free">Free</ToggleButtonGroup.Button>
					<ToggleButtonGroup.Button value="standard">Standard</ToggleButtonGroup.Button>
					<ToggleButtonGroup.Button value="express">Express</ToggleButtonGroup.Button>
				</ToggleButtonGroup>
			</div>
			{info && <div className="text-body mb-1 fs-7">{info}</div>}
			{expected && (
				<div className="text-body mb-2 fs-7">{`Expected delivery by: ${expected}`}</div>
			)}
		</Stack>
	);
};

export default function CartSummary({ readOnly = false, className = '' }) {
	const navigate = useNavigate();
	const { summary, isLoading, deliveryType, setDeliveryType } = useCartSummary();
	const { setCoupon } = useCartSummary();

	const { products = [], deliveryOption = {}, totalProducts = 0 } = summary;
	const { subTotal, total, coupon, discount, promotionApplied } = summary;

	const summaryStyle = {
		position: 'sticky',
		top: '1rem',
		height: 'fit-content',
		minWidth: 'calc(375px - 2rem)',
		maxWidth: '400px'
	};

	const onDeliveryChange = (event, type) => {
		setDeliveryType(type);
	};

	const handlePromoApply = (event, value) => {
		setCoupon(value);
	};

	const handlePromoRemove = () => {
		setCoupon();
	};

	const proceedCheckOut = () => {
		navigate('/checkout');
	};

	const renderSummary = () => {
		if (!products?.length) return;

		return (
			<Card className={className} style={summaryStyle}>
				<Card.Body>
					<Loader show={isLoading} position="absolute" />
					<DeliveryOption
						type={deliveryType}
						info={deliveryOption.deliveryDesc}
						expected={deliveryOption.deliveryBy}
						onChange={(...args) => !readOnly && onDeliveryChange(...args)}
						readOnly={readOnly}
					/>

					<Divider />

					{/* {!readOnly && !coupon?.code && (
						<Stack>
							<PromoChecker onClick={handlePromoApply} />
							<Divider />
						</Stack>
					)}
					{coupon?.code && coupon?.discount && (
						<Stack>
							<Alert variant="success" onClose={!readOnly && handlePromoRemove}>
								<div>
									<div className="fw-bold">{`Offer: ${coupon?.discount}% off discount`}</div>
									<div>{`${coupon?.code} Applied`}</div>
								</div>
							</Alert>
							<Divider />
						</Stack>
					)} */}

					<Stack>
						<div className="fw-bold fs-5 mb-2">
							{`Order Summary (${totalProducts} item${totalProducts > 1 ? 's' : ''})`}
						</div>
						<Stack direction="horizontal" className="justify-content-between mb-2">
							<div className="fs-5">Subtotal</div>
							<div className="fs-5">{subTotal.displayAmount}</div>
						</Stack>
						{/* {coupon?.discount && (
							<Stack direction="horizontal" className="justify-content-between mb-2">
								<div className="fs-6">Coupon Discount</div>
								<div className="fs-6">
									{coupon?.code
										? `(${coupon?.discount}%)  - ${discount.displayAmount}`
										: ` - ${discount.displayAmount}`}
								</div>
							</Stack>
						)} */}
						<Stack direction="horizontal" className="justify-content-between mb-2">
							<div className="fs-6">Delivery</div>
							<div className="fs-6">
								{deliveryOption.deliveryType === 'free'
									? 'Free'
									: `+ ${deliveryOption.deliveryCharge.displayAmount}`}
							</div>
						</Stack>
						{promotionApplied.amount > 0 && (
							<Stack direction="horizontal" className="justify-content-between mb-2">
								<div className="fs-6">Promotion Applied</div>
								<div className="fs-6">{`- ${promotionApplied.displayAmount}`}</div>
							</Stack>
						)}
					</Stack>
					<Divider />
					<Stack direction="horizontal" className="justify-content-between mb-3">
						<div className="fs-5 fw-semibold text-body">Total</div>
						<div className="d-inline-flex gap-2 align-items-center">
							<div className="fs-6 text-secondary">{total.currency}</div>
							<div className="fs-5 fw-bold text-dark">{total.displayAmount}</div>
						</div>
					</Stack>
					{!readOnly && (
						<Fragment>
							<div className="d-grid gap-2">
								<Button variant="warning" onClick={proceedCheckOut} type="submit">
									Proceed to checkout
								</Button>
								<Button
									variant="light"
									className="border"
									onClick={() => navigate('/')}
								>
									Continue shopping
								</Button>
							</div>
						</Fragment>
					)}
				</Card.Body>
			</Card>
		);
	};
	return renderSummary();
}
