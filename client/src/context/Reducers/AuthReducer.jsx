export const ACTIONS = {
	INITIALISE_STARTED: 'INITIALISE_STARTED',
	CURRENTUSER: 'CURRENTUSER',
	ACCESS_TOKEN_COMPLETE: 'ACCESS_TOKEN_COMPLETE',
	SIGNOUT: 'SIGNOUT',
	REFRESH: 'REFRESH'
};

export default (state, action) => {
	switch (action.type) {
		case ACTIONS.CURRENTUSER: {
			return {
				isAuthenticated: !!action.currentUser,
				currentUser: action.currentUser,
				preference: action.preference
			};
		}
		case ACTIONS.SIGNOUT: {
			return {
				isAuthenticated: false,
				currentUser: undefined,
				preference: undefined
			};
		}
		default:
			return state;
	}
};
