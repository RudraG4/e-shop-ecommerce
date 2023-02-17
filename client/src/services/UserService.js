import { api } from 'api/client';
import { localStorageService } from 'api/storage';

export default class UserService {
	static async getUser() {
		const { data } = await api.client.get('/users/info');
		localStorageService.setCurrentUser(data);
		return data;
	}

	static async findUser(email) {
		const { data } = await api.client.get('/users/find', { params: { email } });
		return data;
	}

	static async getUserAddresses() {
		const { data } = await api.client.get('/users/get-addresses');
		return data;
	}

	static async addressChange(id) {
		const body = { id };
		const { data } = await api.client.post('/users/address-change', body);
		return data;
	}

	static async makeAdmin(id) {
		const body = { id };
		const { data } = await api.client.post('/users/make-admin', body);
		return data;
	}

	static async revokeAdmin(id) {
		const body = { id };
		const { data } = await api.client.post('/users/revoke-admin', body);
		return data;
	}

	static async setPreference(preference) {
		const body = { preference };
		const { data } = await api.client.post('/users/update-preference', body);
		return data;
	}
}
