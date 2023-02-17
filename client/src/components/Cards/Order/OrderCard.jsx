import styled from 'styled-components';
import { Row, Col, Stack, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const StyledOrderCard = styled.div`
	margin-bottom: 1rem;
	background: #fff;
	overflow: hidden;
`;

const OrderInfo = styled.div`
	border-radius: 8px 8px 0 0;
	margin-top: 0;
	border: 1px #d5d9d9 solid;
	background-color: #f0f2f2 !important;
	font-size: 14px;
`;

const Shipment = styled.div`
	border-radius: 0px 0px 8px 8px;
	border: 1px #d5d9d9 solid;
	border-top: none;
	background-color: #fff !important;
`;

const Label = styled.div`
	font-size: 12px;
	color: rgba(108, 117, 125, 1);
	text-transform: uppercase;
`;

const Value = styled.div`
	font-size: 14px;
	color: rgba(33, 37, 41, 1);
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`;

const ProductTitle = styled(Link)`
	&:hover::after {
		content: ' #';
		color: rgba(108, 117, 125, 1);
	}
`;

export default function OrderCard(props) {
	const { order } = props;

	return (
		<StyledOrderCard>
			<OrderInfo>
				<div className="p-3">
					<Row className="position-relative p-0">
						<Col lg={8}>
							<Row>
								<Col xs={6} lg={4} className="mb-2">
									<Label>ORDER #</Label>
									<Value>{order._id}</Value>
								</Col>
								<Col xs={6} lg={3} className="mb-2">
									<Label>ORDER PLACED</Label>
									<Value>{order.orderOn.toLocaleString('en-US')}</Value>
								</Col>
								<Col xs={6} lg={2} className="mb-2">
									<Label>TOTAL</Label>
									<div className="text-body">
										{order.totalCost?.displayAmount}
									</div>
								</Col>
								<Col xs={6} lg={3} className="mb-2">
									<Label>SHIP TO</Label>
									<Value>{order.shipping?.name}</Value>
								</Col>
							</Row>
						</Col>
						<Col lg={4}>
							<Row>
								<Col className="mb-2">
									<Label>STATUS</Label>
									<Value>{order.status}</Value>
								</Col>
								<Col className="mt-3 mb-2">
									<Link
										to={`/account/order-details?orderId=${order._id}`}
										className="fw-semibold"
									>
										View order details
									</Link>
								</Col>
							</Row>
						</Col>
					</Row>
				</div>
			</OrderInfo>
			<Shipment>
				<div className="py-3 px-4">
					<div className="mt-3">
						<Row>
							{order.products.map((product) => {
								return (
									<Col lg={12} key={product._id} className="mb-3">
										<Stack direction="horizontal" className="align-items-start">
											<Link to={`/product-info/${product._id}`}>
												<img
													src={product.thumbnail}
													alt={product.title}
													style={{
														maxWidth: '90px',
														maxHeight: '90px'
													}}
													loading="lazy"
												/>
											</Link>
											<div className="flex-grow-1">
												<Row className="m-0">
													<Col lg={12} className="mb-2">
														<ProductTitle
															to={`/product-info/${product._id}`}
															className="fw-bold"
														>
															{product.title}
														</ProductTitle>
													</Col>
													<Col lg={12} className="mb-2">
														<Stack
															gap="2"
															direction="horizontal"
															className="flex-wrap"
														>
															<Button variant="warning" size="sm">
																Buy it again
															</Button>
															<Button
																variant="light"
																className="border"
																size="sm"
															>
																View your item
															</Button>
														</Stack>
													</Col>
													<Col lg={12} className="mb-2"></Col>
												</Row>
											</div>
										</Stack>
									</Col>
								);
							})}
						</Row>
					</div>
				</div>
			</Shipment>
		</StyledOrderCard>
	);
}
