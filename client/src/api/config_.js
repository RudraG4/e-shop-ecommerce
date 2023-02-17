import axios from 'axios';
import ls from 'local-storage';

const preRequest = (auth) => (config) => {
	if (!config.headers['Authorization']) {
		if (auth?.access_token) {
			config.headers['Authorization'] = `Bearer ${auth?.access_token}`;
		}
	}
	const sessionId = ls.get('session-id');
	if (!config.headers['x-session-id'] && sessionId) {
		config.headers['x-session-id'] = sessionId;
	}
	return config;
};

class Requestor {
	#axios;
	#requestInterceptors = [];
	#responseInterceptors = [];

	constructor() {
		if (this.axios) {
			console.log(this.axios);
			throw new Error('Axios already instansiated');
		}

		this.#axios = axios.create({
			baseURL: process.env.REACT_API_DOMAIN,
			headers: { 'Content-Type': 'application/json' },
			responseType: 'json'
		});
	}

	registerRequestInterceptor(interceptor) {
		if (!interceptor) return;

		if (!interceptor.fullfilled) {
			interceptor.fullfilled = (config) => config;
		}
		if (!interceptor.rejected) {
			interceptor.rejected = async (error) => Promise.reject(error);
		}
		if (!interceptor.options) {
			interceptor.options = { synchronous: true };
		}
		const index = this.#requestInterceptors.findIndex(({ handler }) => {
			return (
				handler.fullfilled === interceptor.fullfilled &&
				handler.rejected === interceptor.rejected
			);
		});
		if (index > -1) return this.#requestInterceptors[index]['id'];
		const id = this.#axios.interceptors.request.use(
			interceptor.fullfilled,
			interceptor.rejected,
			interceptor.options
		);
		this.#requestInterceptors.push({ id, handler: interceptor });
		return id;
	}

	unregisterRequestInterceptor(id) {
		if (!id) return;
		const index = this.#requestInterceptors.find((_interceptor) => _interceptor.id === id);
		if (index > -1) {
			this.#requestInterceptors.splice(index, 1);
		}
		this.#axios.interceptors.request.eject(id);
	}

	registerResponseInterceptor(interceptor) {
		if (!interceptor) return;

		if (!interceptor.fullfilled) {
			interceptor.fullfilled = (response) => response;
		}
		if (!interceptor.rejected) {
			interceptor.rejected = async (error) => Promise.reject(error);
		}
		if (!interceptor.options) {
			interceptor.options = { synchronous: true };
		}
		const index = this.#responseInterceptors.findIndex(({ handler }) => {
			return (
				handler.fullfilled === interceptor.fullfilled &&
				handler.rejected === interceptor.rejected
			);
		});
		if (index > -1) return this.#responseInterceptors[index]['id'];
		const id = this.#axios.interceptors.response.use(
			interceptor.fullfilled,
			interceptor.rejected,
			interceptor.options
		);
		this.#responseInterceptors.push({ id, handler: interceptor });
		return id;
	}

	unregisterResponseInterceptor(id) {
		if (!id) return;
		const index = this.#responseInterceptors.find((_interceptor) => _interceptor.id === id);
		if (index > -1) {
			this.#responseInterceptors.splice(index, 1);
		}
		this.#axios.interceptors.response.eject(id);
	}

	getInstance() {
		return this.#axios;
	}
}

export default Object.freeze(new Requestor());
