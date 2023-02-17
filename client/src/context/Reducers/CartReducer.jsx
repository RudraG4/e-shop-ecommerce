import { createSlice } from 'context/Redux';
import ls from 'local-storage';

const LOCAL_CART_KEY = 'cart_eshop';
const initCartState = {
	items: [],
	totalItems: 0,
	subTotal: 0,
	total: 0,
	deliveryType: 'standard',
	deliveryCharge: 100,
	deliveryBy: undefined,
	isAvailFreeDelivery: false,
	promotionApplied: 0,
	coupon: undefined
};

const calculateSummary = (cart, delivery) => {
	const { items } = cart;
	const subTotalReducer = (accum, item) => {
		accum += parseFloat(item.productTotalCost);
		return accum;
	};
	cart.totalItems = items.length;
	cart.subTotal = items.reduce(subTotalReducer, 0).toFixed(2);
	cart.subTotal = parseFloat(cart.subTotal);
	cart.discountValue = 0;
	if (cart.coupon && cart.coupon.code) {
		cart.discountValue = cart.subTotal * (cart.coupon.discount / 100);
		cart.discountValue = parseFloat(cart.discountValue);
	}

	cart.isAvailFreeDelivery = cart.subTotal >= 500.0;

	let deliveryType = delivery;
	if (!delivery) {
		if (cart.isAvailFreeDelivery) {
			deliveryType = 'free';
		} else {
			deliveryType = 'standard';
		}
	}

	if (deliveryType === 'standard') {
		cart.deliveryType = 'standard';
		cart.deliveryCharge = 100;
		cart.deliveryBy = new Date().toDateString();
	} else if (deliveryType === 'express') {
		cart.deliveryType = 'express';
		cart.deliveryCharge = 199;
		cart.deliveryBy = new Date().toDateString();
	} else {
		cart.deliveryType = 'free';
		cart.deliveryCharge = 0;
		cart.deliveryBy = new Date().toDateString();
	}

	cart.remFreeDelAmt = cart.isAvailFreeDelivery ? 0 : Math.abs(500.0 - cart.subTotal);
	cart.promotionApplied =
		cart.isAvailFreeDelivery && (deliveryType === 'standard' || deliveryType === 'free')
			? cart.deliveryCharge
			: 0;

	cart.total = (
		cart.subTotal -
		cart.discountValue +
		cart.deliveryCharge -
		cart.promotionApplied
	).toFixed(2);
	cart.total = parseFloat(cart.total);
	return cart;
};

const CartSlice = createSlice({
	initialState: {
		value: { ...(ls.get(LOCAL_CART_KEY) || initCartState) }
	},
	reducers: {
		addToCart: async function (cart, item) {
			if (!item) return cart;

			const { items } = cart;
			const index = items.findIndex((a) => a.productId === item.productId);
			if (index > -1) {
				return this.updateCartItem(cart, {
					productId: items[index]['productId'],
					productQuantity: item.productQuantity
				});
			}
			cart.items = [...items, item];
			cart = { ...calculateSummary(cart) };
			ls.set(LOCAL_CART_KEY, cart);
			return cart;
		},
		removeFromCart: async function (cart, productId) {
			if (!productId) return cart;
			const { items } = cart;
			const index = items.findIndex((a) => a.productId === productId);
			if (index > -1) {
				cart.items = [...items.slice(0, index), ...items.slice(index + 1)];
				cart = { ...calculateSummary(cart) };
				ls.set(LOCAL_CART_KEY, cart);
				return cart;
			}
			return cart;
		},
		updateCartItem: async function (cart, value) {
			const { productId, productQuantity } = value;
			if (!productId) return cart;
			const { items } = cart;
			const index = items.findIndex((a) => a.productId === productId);
			if (index > -1) {
				const product = items[index];
				const newQuantity = product['productQuantity'] + productQuantity;
				if (newQuantity < 1) return this.removeFromCart(items, value);

				const newItems = [...items];
				newItems[index]['productQuantity'] = newQuantity;
				const totalCost = newItems[index]['productCost'] * newQuantity;
				newItems[index]['productTotalCost'] = parseFloat(totalCost.toFixed(2));
				cart.items = newItems;
				cart = { ...calculateSummary(cart) };
				ls.set(LOCAL_CART_KEY, cart);
				return cart;
			}
			return cart;
		},
		clearCart: function () {
			ls.set(LOCAL_CART_KEY, null);
			return initCartState;
		},
		setDeliveryType: function (cart, type) {
			cart = { ...calculateSummary(cart, type) };
			ls.set(LOCAL_CART_KEY, cart);
			return cart;
		},
		applyCoupon: function (cart, coupon) {
			cart.coupon = coupon;
			cart = { ...calculateSummary(cart) };
			ls.set(LOCAL_CART_KEY, cart);
			return cart;
		}
	}
});

export const {
	addToCart,
	removeFromCart,
	updateCartItem,
	clearCart,
	setDeliveryType,
	applyCoupon
} = CartSlice.actions;

export default CartSlice.reducer;
