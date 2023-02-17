import ls from 'local-storage';
const LOCAL_CURRENT_USER = 'current_user';
const LOCAL_ISAUTHENTICATED = 'signedin';
const LOCAL_SESSION_ID = 'session-id';
const LOCAL_ACCESS_TOKEN = 'access-token';
const LOCAL_REFRESH_TOKEN = 'refresh-token';

export default class LocalStorageService {
	setTokens({ access_token, refresh_token }) {
		this.setAccessToken(access_token);
		this.setRefreshToken(refresh_token);
	}

	setAccessToken(access_token) {
		ls.set(LOCAL_ACCESS_TOKEN, access_token || '');
	}

	setRefreshToken(refresh_token) {
		ls.set(LOCAL_REFRESH_TOKEN, refresh_token || '');
	}

	setCurrentUser(current_user) {
		ls.set(LOCAL_CURRENT_USER, current_user || '');
	}

	setSessionID(sessionId) {
		ls.set(LOCAL_SESSION_ID, sessionId);
	}

	setCustom(key, value) {
		ls.set(key, value);
	}

	getAccessToken() {
		return ls.get(LOCAL_ACCESS_TOKEN);
	}

	getRefreshToken() {
		return ls.get(LOCAL_REFRESH_TOKEN);
	}

	getCurrentUser() {
		return ls.get(LOCAL_CURRENT_USER);
	}

	getSessionID() {
		return ls.get(LOCAL_SESSION_ID);
	}

	getCustom(key) {
		return ls.get(key);
	}

	removeTokens() {
		ls.remove(LOCAL_ACCESS_TOKEN);
		ls.remove(LOCAL_REFRESH_TOKEN);
	}

	removeCurrentuser() {
		ls.remove(LOCAL_CURRENT_USER);
	}

	removeSessionId() {
		ls.remove(LOCAL_SESSION_ID);
	}

	removeCustom(key) {
		ls.remove(key);
	}
}

export const localStorageService = new LocalStorageService();
