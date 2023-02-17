import { createContext, useEffect, useReducer, useState } from 'react';
import { toast } from 'react-toastify';
import CartService from 'services/CartService';
import { usePreferenceContext } from 'hooks';

const CartContext = createContext();

export default CartContext;

const ACTIONS = {
	INTIALISED: 'INITIALIZED',
	ADD_TO_CART: 'ADD_TO_CART',
	REMOVE_FROM_CART: 'REMOVE_FROM_CART',
	CLEAR_CART: 'CLEAR_CART',
	UPDATE_CART: 'UPDATE_CART'
};

const initCartState = {
	products: [],
	totalProducts: 0,
	subTotal: 0,
	total: 0,
	deliveryType: 'standard',
	deliveryCharge: 100,
	deliveryBy: undefined,
	isAvailFreeDelivery: false,
	promotionApplied: 0,
	coupon: undefined
};

const reducer = (cart, action) => {
	const updateCartItem = (cart, value) => {
		const { _id, quantity } = value;
		if (!_id) return cart;

		const { products } = cart;
		const index = products.findIndex((a) => a._id === _id);
		if (index > -1) {
			const product = products[index];
			const newQuantity = product['quantity'] + quantity;
			const newProducts = [...products];
			newProducts[index]['quantity'] = newQuantity;
			const totalCost = newProducts[index]['price'] * newQuantity;
			newProducts[index]['totalPrice'] = parseFloat(totalCost.toFixed(2));
			cart.products = newProducts;
			cart.totalProducts = cart.products.length;
			// ls.set(LOCAL_CART_KEY, cart);
			return { ...cart };
		}
		return cart;
	};

	switch (action.type) {
		case ACTIONS.INTIALISED: {
			return { ...cart, ...action.value };
		}
		case ACTIONS.UPDATE_CART: {
			return { ...cart, ...action.value };
		}
		case ACTIONS.ADD_TO_CART: {
			if (!action.value) return cart;

			const product = action.value;
			const { products } = cart;
			const index = products.findIndex((a) => a._id === product._id);
			if (index > -1) {
				return updateCartItem(cart, { _id: product._id, quantity: product.quantity });
			}
			cart.products = [...products, product];
			cart.totalProducts = cart.products.length;
			return { ...cart };
		}
		case ACTIONS.REMOVE_FROM_CART: {
			if (!action.value) return cart;

			const _id = action.value;
			const { products } = cart;
			const index = products.findIndex((a) => a._id === _id);
			if (index > -1) {
				cart.products = [...products.slice(0, index), ...products.slice(index + 1)];
				cart.totalProducts = cart.products.length;
				// cart = { ...calculateSummary(cart) };
				// ls.set(LOCAL_CART_KEY, cart);
				return { ...cart };
			}
			return cart;
		}
		case ACTIONS.CLEAR_CART: {
			return initCartState;
		}
		default:
			return cart;
	}
};

export const CartContextProvider = ({ children }) => {
	const [cart, dispatch] = useReducer(reducer, initCartState);
	const { preference } = usePreferenceContext();
	const [isLoading, setIsLoading] = useState(false);

	const addToCart = async (product) => {
		setIsLoading(true);
		try {
			if (product) {
				const data = await CartService.addToCart(product);
				if (data?.success) {
					dispatch({ type: ACTIONS.UPDATE_CART, value: data.cart });
					notify(
						<div>
							{product.title && (
								<div className="fw-bold">{`${product.title.substr(0, 20)}...`}</div>
							)}
							<small>Added Successfully</small>
						</div>
					);
				}
			}
		} catch (e) {}
		setIsLoading(false);
	};

	const updateCart = async (product) => {
		setIsLoading(true);
		try {
			if (product) {
				const data = await CartService.addToCart(product);
				if (data?.success) {
					dispatch({ type: ACTIONS.UPDATE_CART, value: data.cart });
				}
			}
		} catch (e) {}
		setIsLoading(false);
	};

	const removeFromCart = async (product) => {
		setIsLoading(true);
		if (product) {
			const data = await CartService.removeFromCart(product._id);
			if (data?.success) {
				dispatch({ type: ACTIONS.UPDATE_CART, value: data.cart });
				notify(
					<div>
						{product.title && (
							<div className="fw-bold">{`${product.title.substr(0, 20)}...`}</div>
						)}
						<small>Removed Successfully</small>
					</div>
				);
			}
		}
		setIsLoading(false);
	};

	const clearCart = async () => {
		setIsLoading(true);
		const data = await CartService.clearCart();
		if (data?.success) {
			dispatch({ type: ACTIONS.CLEAR_CART });
			notify('Success');
		}
		setIsLoading(false);
	};

	const notify = (message) => {
		const config = {
			position: 'top-right',
			autoClose: 1500,
			hideProgressBar: true,
			closeOnClick: true,
			pauseOnHover: false,
			draggable: true,
			progress: undefined,
			theme: 'light'
		};
		return message && toast.success(message, config);
	};

	useEffect(() => {
		(async () => {
			setIsLoading(true);
			try {
				let cartState = initCartState;
				const response = await CartService.getCart();
				if (response.cart) {
					cartState = response.cart;
				}
				dispatch({ type: ACTIONS.INTIALISED, value: cartState });
			} catch (error) {}
			setIsLoading(false);
		})();
	}, [preference]);

	return (
		<CartContext.Provider
			value={{ cart, isLoading, addToCart, updateCart, removeFromCart, clearCart }}
		>
			{children}
		</CartContext.Provider>
	);
};
