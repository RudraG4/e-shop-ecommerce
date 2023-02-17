import { createContext, useReducer } from 'react';

const SavedItemsContext = createContext();

export default SavedItemsContext;

export const SavedItemsContextProvider = ({ reducer, children }) => {
	const [state, dispatch] = useReducer(reducer, reducer.initialState);

	return (
		<SavedItemsContext.Provider value={{ state, dispatch }}>
			{children}
		</SavedItemsContext.Provider>
	);
};
