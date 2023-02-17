import { createContext } from 'react';
import { useCartContext, usePreferenceContext } from 'hooks';
import { useEffect, useState } from 'react';
import CartService from 'services/CartService';

const SummaryContext = createContext();

export default SummaryContext;

export const SummaryContextProvider = ({ children }) => {
	const defaultSummary = {
		totalProducts: 0,
		products: [],
		deliveryOption: {},
		promoCode: {},
		subTotal: {},
		discount: {},
		total: {},
		promotionApplied: {}
	};
	const [isLoading, setIsLoading] = useState(false);
	const [summary, setSummary] = useState(defaultSummary);
	const [coupon, _setCoupon] = useState();
	const [deliveryType, _setDeliveryType] = useState('standard');
	const { cart } = useCartContext();
	const { preference } = usePreferenceContext();

	async function retriveAndSetSummary(coupon, deliveryType) {
		setIsLoading(true);
		const response = await CartService.getSummary({
			couponCode: coupon?.code,
			deliveryType,
			currency: preference.currency
		});
		setSummary(response);
		setIsLoading(false);
	}

	function setCoupon(coupon) {
		_setCoupon(coupon);
		retriveAndSetSummary(coupon, deliveryType);
	}

	function setDeliveryType(type) {
		_setDeliveryType(type);
		retriveAndSetSummary(coupon, type);
	}

	useEffect(() => {
		retriveAndSetSummary(coupon, deliveryType);
	}, [cart]);

	return (
		<SummaryContext.Provider
			value={{ summary, isLoading, coupon, setCoupon, deliveryType, setDeliveryType }}
		>
			{children}
		</SummaryContext.Provider>
	);
};
