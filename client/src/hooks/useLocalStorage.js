import { useState, useCallback } from 'react';

/** Custom Hook useLocalStorage */
export default function useLocalStorage(key, defaultValue) {
	const getOrSetDefault = useCallback(() => {
		try {
			const value = localStorage.getItem(key);
			if (value) return JSON.parse(value);
			/** If no value set, set the defaultValue */
			localStorage.setItem(key, JSON.stringify(defaultValue));
		} catch (e) {
			console.log('Error retrieving local value ' + e);
		}
		return defaultValue;
	}, [key, defaultValue]);

	const [value, setStoredValue] = useState(getOrSetDefault);

	const setValue = useCallback(
		(value) => {
			try {
				localStorage.setItem(key, JSON.stringify(value));
			} catch (e) {
				console.log('Error setting local value');
			}
			setStoredValue(value);
		},
		[key]
	);

	return [value, setValue];
}
