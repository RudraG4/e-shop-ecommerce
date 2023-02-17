export const createAction = (action, value) => {
	return { type: action, value };
};

export function createSlice(reducerObj) {
	const { initialState, reducers } = reducerObj;
	const actions = Object.keys(reducers).reduce((reducer, action) => {
		reducer[action] = function (value) {
			return createAction(action, value);
		};
		return reducer;
	}, {});
	const reducer = function (state, action) {
		return reducers[action.type].apply(reducers, [state, action.value]);
	};
	reducer.initialState = initialState?.value;
	return { initialState, actions, reducer };
}
