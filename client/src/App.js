import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-data-grid/lib/styles.css';
import './styles.scss';
import { config } from 'dotenv';
import { Routes, Route, Navigate } from 'react-router-dom';
import * as Pages from 'pages';
import * as Auth from 'pages/Auth';
import * as Layouts from 'pages/Layouts';

config();

function withProtectedRoute(component) {
	if (!component) return;
	return <Pages.ProtectedRoute component={component} />;
}

export default function EShop() {
	const ProtectedOrders = withProtectedRoute(<Pages.Orders />);
	const ProtectedOrderDetails = withProtectedRoute(<Pages.OrderDetails />);
	const ProtectedCheckout = withProtectedRoute(<Layouts.CheckOutLayout />);

	return (
		<Routes>
			<Route path="/">
				<Route element={<Layouts.ContextProviders />}>
					<Route element={<Layouts.BaseLayout />}>
						<Route index element={<Pages.Home />} />
						<Route path="products" element={<Pages.Products />} />
						<Route path="product-info">
							<Route index element={<Navigate to="/" />} />
							<Route path=":productId" element={<Pages.ProductInfo />} />
						</Route>

						<Route path="account">
							<Route index element={<Pages.Account />} />
							<Route path="order-history" element={ProtectedOrders} />
							<Route path="order-details" element={ProtectedOrderDetails} />
						</Route>

						<Route path="cart" element={<Pages.CartView />} />
						<Route path="saveditems" element={<Pages.SavedForLaterView />} />
						<Route path="*" element={<Pages.NotFound />} />
					</Route>

					<Route path="checkout" element={ProtectedCheckout}>
						<Route index element={<Pages.Checkout />} />
					</Route>

					<Route path="checkout_post" element={ProtectedCheckout}>
						<Route index element={<Pages.PostCheckout />} />
					</Route>
				</Route>

				<Route path="auth" element={<Layouts.SharedAuthLayout />}>
					<Route index element={<Navigate to="signin" />} />
					<Route path="signin" element={<Auth.SignIn />} />
					<Route path="signout" element={<Auth.SignOut />} />
					<Route path="register" element={<Auth.Register />} />
					<Route path="forgotpassword" element={<Auth.ForgotPassword />} />
					<Route path="*" element={<Navigate to="signin" />} />
				</Route>

				<Route path="dashboard/*" element={<Pages.Dashboard />} />
			</Route>
		</Routes>
	);
}
