import { useCartSummary } from 'hooks';
import { Button, Stack } from 'react-bootstrap';
import { useStripe, useElements } from '@stripe/react-stripe-js';

export default function ItemConfirmation(props) {
	const { summary } = useCartSummary();
	const stripe = useStripe();
	const elements = useElements();
	const { onConfirm } = props;

	return (
		<div>
			<div className="d-block">
				{summary.products.map((product, index) => {
					return (
						<div className="border-bottom py-2" key={index}>
							<Stack
								direction="horizontal"
								className="flex-no-wrap align-items-start gap-2"
							>
								<div
									className="d-flex align-items-center"
									style={{ width: '75px', height: '75px' }}
								>
									<img
										src={product.thumbnail}
										alt={product.title}
										className="d-block m-auto"
										style={{
											maxWidth: '75px',
											maxHeight: '75px'
										}}
										srcSet={product.thumbnail}
										title={product.title}
										loading="lazy"
									/>
								</div>
								<div className="flex-grow-1 text-truncate" title={product.title}>
									<div className="fw-bold text-wrap text-truncate">
										{product.title}
									</div>
									<div className="fs-7">
										<span className="text-decoration-line-through">
											{product.mrp.displayAmount}
										</span>
										<span className="fw-bold ms-2">
											{product.price.displayAmount}
										</span>
									</div>
									<div className="fs-7">{`Qty: ${product.quantity}`}</div>
								</div>
								<div className="fs-6 fw-bold text-end">
									{product.totalPrice.displayAmount}
								</div>
							</Stack>
						</div>
					);
				})}
			</div>
			<div className="d-grid mt-3 gap-2">
				<Button
					type="submit"
					variant="warning"
					onClick={onConfirm}
					disabled={!stripe || !elements}
				>
					Place the order
				</Button>
			</div>
		</div>
	);
}
