import axios from 'axios';
import { localStorageService } from './storage';

export default class Api {
	constructor(options = {}) {
		this.client = options.client;
		this.access_token = options.access_token;
		this.refresh_token = options.refresh_token;
		this.refreshRequest = null;
		this.useInterceptors();
	}

	useInterceptors() {
		this.useRequestInterceptors();
		this.useResponseInterceptors();
	}

	useRequestInterceptors() {
		this.client.interceptors.request.use(
			(config) => this.onFulfilledRequestInterceptor(config),
			(e) => this.onRejectedRequestInterceptor(e)
		);
	}

	onFulfilledRequestInterceptor(config) {
		const sessionId = localStorageService.getSessionID();
		const currency = localStorageService.getCustom('currency-pref');
		if (sessionId) {
			config.headers['session-id'] = sessionId;
		}
		if (currency) {
			config.headers['currency'] = currency;
		}

		if (!this.access_token) {
			return config;
		}

		const newConfig = { headers: {}, ...config };
		newConfig.headers.Authorization = `Bearer ${this.access_token}`;
		return newConfig;
	}

	onRejectedRequestInterceptor(error) {
		return Promise.reject(error);
	}

	useResponseInterceptors() {
		this.client.interceptors.response.use(
			(r) => this.onFulfilledResponseInterceptor(r),
			async (error) => this.onRejectedResponseInterceptor(error)
		);
	}

	onFulfilledResponseInterceptor(response) {
		if (response.headers['session-id']) {
			localStorageService.setSessionID(response.headers['session-id']);
		}
		if (response.headers['currency']) {
			localStorageService.setCustom('currency-pref', response.headers['currency']);
		}
		return response;
	}

	async onRejectedResponseInterceptor(error) {
		if (error?.response?.headers['session-id']) {
			localStorageService.setSessionID(error.response.headers['session-id']);
		}

		if (error?.response?.headers['currency']) {
			localStorageService.setCustom('currency-pref', error.response.headers['currency']);
		}

		if (!this.refresh_token || error.response?.status !== 401 || error.config.retry) {
			return Promise.reject(error);
		}

		if (this.refreshRequest) {
			this.refreshRequest = null;
			this.removeTokens();
			localStorageService.removeCurrentuser();
			localStorageService.removeCustom('signed_in');
			window.location.href = window.location.origin + '/auth/signin';
			return Promise.reject(error);
		}

		const data = await this.makeRefreshRequest();
		this.refreshRequest = null;

		this.setAccessToken(data.access_token);
		if (data.refresh_token) {
			this.setRefreshToken(data.refresh_token);
		}

		const newRequestConfig = {
			...error.config,
			retry: true
		};
		return this.client(newRequestConfig);
	}

	async makeRefreshRequest() {
		this.refreshRequest = this.client.post('/auth/token/refresh', {
			refresh_token: this.refresh_token
		});
		const { data } = await this.refreshRequest;
		return data;
	}

	setAccessToken(access_token) {
		this.access_token = access_token;
		localStorageService.setAccessToken(access_token);
	}

	setRefreshToken(refresh_token) {
		this.refresh_token = refresh_token;
		localStorageService.setRefreshToken(refresh_token);
	}

	removeTokens() {
		this.access_token = undefined;
		this.refresh_token = undefined;
		localStorageService.removeTokens();
	}
}

export const api = new Api({
	client: axios.create({
		withCredentials: true,
		baseURL: process.env.REACT_APP_API_ORIGIN,
		headers: { 'Content-Type': 'application/json' },
		responseType: 'json'
	}),
	access_token: localStorageService.getAccessToken(),
	refresh_token: localStorageService.getRefreshToken()
});
