import axios from 'api/config_';
import { useAuthContext } from 'hooks';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

export default function useAxios() {
	// const { authContext, refresh } = useAuthContext();
	// const { access_token } = authContext;
	// const navigate = useNavigate();
	// const location = useLocation();

	// useEffect(() => {
	// 	const requestSuccess = (config) => {
	// 		if (!config.headers['Authorization']) {
	// 			if (access_token) {
	// 				config.headers['Authorization'] = `Bearer ${access_token}`;
	// 			}
	// 		}
	// 		return config;
	// 	};
	// 	const requestError = async (error) => Promise.reject(error);

	// 	const responseSuccess = (response) => response;
	// 	const responseError = async (error) => {
	// 		console.log(error);
	// 		const originalRequest = error?.config;
	// 		if (error?.response?.status === 401 && !originalRequest._retry) {
	// 			if (error.config.url === '/auth/refresh') {
	// 				return navigate('/auth/signin', { redirect: location.pathname });
	// 			}
	// 			originalRequest._retry = true;
	// 			const accessToken = await refresh();
	// 			if (accessToken) {
	// 				originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
	// 				return await axios.getInstance()(originalRequest);
	// 			}
	// 		}
	// 		return Promise.reject(error);
	// 	};

	// 	const requestId = axios.registerRequestInterceptor({
	// 		fullfilled: requestSuccess,
	// 		rejected: requestError
	// 	});
	// 	const responseId = axios.registerResponseInterceptor({
	// 		fullfilled: responseSuccess,
	// 		rejected: responseError
	// 	});

	// 	return () => {
	// 		axios.unregisterRequestInterceptor(requestId);
	// 		axios.unregisterResponseInterceptor(responseId);
	// 	};
	// }, [access_token]);

	return axios;
}
