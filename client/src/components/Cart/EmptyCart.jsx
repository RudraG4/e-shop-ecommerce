import { Link, useLocation } from 'react-router-dom';
import { useAuthContext } from 'hooks';

export default function EmptyCart() {
	const { auth } = useAuthContext();
	const location = useLocation();

	return (
		<div className="d-flex align-items-center justify-content-center flex-wrap bg-white p-3">
			<div className="text-center me-3" style={{ maxWidth: '25%' }}>
				<img
					src="https://cdni.iconscout.com/illustration/free/thumb/empty-cart-4085814-3385483.png"
					srcSet="https://cdni.iconscout.com/illustration/free/thumb/empty-cart-4085814-3385483.png"
					alt="Empty Cart"
					className="mw-100"
				/>
			</div>
			<div className="text-center">
				<h3 className="fw-bold mt-3 mb-3">Your Cart is Empty</h3>
				<div className="signin d-flex justify-content-center flex-wrap gap-2 mt-3 mb-3">
					{!auth.isAuthenticated && (
						<Link
							to="/auth/signin"
							state={{ from: location.pathname }}
							className="btn btn-warning"
						>
							Sign In to your account
						</Link>
					)}
					<Link
						to="/"
						state={{ from: location.pathname }}
						className="border btn btn-light"
					>
						Continue Shopping
					</Link>
				</div>
			</div>
		</div>
	);
}
