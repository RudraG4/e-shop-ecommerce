import { createContext, useEffect, useState } from 'react';
import ls from 'local-storage';
import { useAuthContext } from 'hooks';
import UserService from 'services/UserService';

const LOCAL_CURRENCY_KEY = 'currency-pref';
const defaultCurrency = 'INR';
const initialPref = {
	currency: ls.get(LOCAL_CURRENCY_KEY) || defaultCurrency
};

const PreferenceContext = createContext();

export default PreferenceContext;

export const PreferenceContextProvider = ({ children }) => {
	const { auth } = useAuthContext();

	const [preference, setPreference] = useState(auth?.preference || initialPref);

	function setCurrency(currency) {
		try {
			const newPreference = { ...preference, currency };
			setPreference(newPreference);
			ls.set(LOCAL_CURRENCY_KEY, currency);
			if (auth?.currentUser) {
				UserService.setPreference(newPreference);
			}
		} catch (e) {}
	}

	function setDelivery(delivery) {
		try {
			const newPreference = { ...preference, delivery };
			setPreference(newPreference);
			if (auth?.currentUser) {
				UserService.setPreference(newPreference);
			}
		} catch (e) {}
	}

	useEffect(() => {
		if (auth?.preference) {
			setPreference(auth?.preference);
			ls.set(LOCAL_CURRENCY_KEY, auth?.preference?.currency || defaultCurrency);
			return;
		}
		if (!ls.get(LOCAL_CURRENCY_KEY)) {
			ls.set(LOCAL_CURRENCY_KEY, defaultCurrency);
		}
	}, [auth]);

	return (
		<PreferenceContext.Provider value={{ preference, setCurrency, setDelivery }}>
			{children}
		</PreferenceContext.Provider>
	);
};
