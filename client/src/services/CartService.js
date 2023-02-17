import { api } from 'api/client';

export default class CartService {
	static async getCart() {
		const { data } = await api.client.get('/cart');
		return data;
	}

	static async addToCart(product) {
		const { data } = await api.client.post('/cart/add', product);
		return data;
	}

	static async removeFromCart(_id) {
		const { data } = await api.client.post('/cart/remove', { _id });
		return data;
	}

	static async clearCart() {
		const { data } = await api.client.post('/cart/clear', {});
		return data;
	}

	static async getSummary(body) {
		const { data } = await api.client.post('/cart/summary', body);
		return data;
	}
}
