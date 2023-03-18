import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { api } from 'api/client';

export default function useFetch(url, config, dependencies = []) {
	const cancelTokenSource = axios.CancelToken.source();
	const [fetchedData, setFecthedData] = useState({
		data: undefined,
		isLoading: true,
		error: false
	});

	const fetchData = useCallback(async () => {
		if (url) {
			try {
				setFecthedData({ isLoading: true, error: false });
				const axiosConfig = {
					...config,
					cancelToken: cancelTokenSource.token,
					withCredentials: true
				};
				if (!url.startsWith('https://')) {
					axiosConfig['baseURL'] = process.env.REACT_APP_API_ORIGIN;
				}
				axiosConfig['headers'] = axiosConfig['headers'] || {};
				const response = await api.client.get(url, axiosConfig);
				const data = await response.data;
				if (data) {
					setFecthedData({ data, isLoading: false, error: false });
				} else {
					setFecthedData({ isLoading: false, error: false });
				}
			} catch (e) {
				if (axios.isCancel(e)) {
				}
				setFecthedData({ isLoading: false, error: e });
			}
		} else {
			setFecthedData({ isLoading: false });
		}
	}, [url, ...dependencies]);

	useEffect(() => {
		if (typeof url === 'function') {
			async function getData() {
				const response = await url();
				setFecthedData({
					data: response,
					isLoading: false,
					error: false
				});
			}
			getData();
		} else {
			fetchData();
		}
		return () => cancelTokenSource.cancel();
	}, [url, fetchData]);

	const { data, isLoading, error } = fetchedData;
	return { data, isLoading, error };
}
