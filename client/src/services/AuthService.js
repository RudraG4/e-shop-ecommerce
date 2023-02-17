import { api } from 'api/client';
import { localStorageService } from '../api/storage';

export default class AuthService {
	static async signIn({ email, password }) {
		const body = { email, password };
		const { data } = await api.client.post('/auth/signin', body);
		api.setAccessToken(data.access_token);
		api.setRefreshToken(data.refresh_token);
		localStorageService.setTokens(data);
		localStorageService.setCustom('signed_in', true);
		return data;
	}

	static async signOut() {
		const body = { refresh_token: api.refresh_token };
		const { data } = await api.client.post('/auth/signout', body);
		api.removeTokens();
		localStorageService.removeTokens();
		localStorageService.removeCustom('signed_in');
		localStorageService.removeSessionId();
		localStorageService.removeCurrentuser();
		return data;
	}

	static async register(body) {
		const { data } = await api.client.post('/auth/register', body);
		api.setAccessToken(data.access_token);
		api.setRefreshToken(data.refresh_token);
		localStorageService.setTokens(data);
		return data;
	}

	static async verify(body) {
		const { data } = await api.client.post('/auth/verify', body);
		return data;
	}

	static async forgotPassword(email) {
		const { data } = await api.client.post('/auth/forgot-password', { email });
		return data;
	}

	static async resetPassword({ email, password, verify_token }) {
		const body = { email, password, verify_token };
		const { data } = await api.client.post('/auth/reset-password', body);
		return data;
	}
}
