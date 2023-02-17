import { SummaryContextProvider } from 'context/SummaryContext';
import { CartContextProvider } from 'context/CartContext';
import { SavedItemsContextProvider } from 'context/SavedItemsContext';
import { PreferenceContextProvider } from 'context/PreferenceContext';
import SavedItemsReducer from 'context/Reducers/SavedItemsReducer';
import { Outlet } from 'react-router';

export default function ContextProviders({ children }) {
	return (
		<PreferenceContextProvider>
			<CartContextProvider>
				<SavedItemsContextProvider reducer={SavedItemsReducer}>
					<SummaryContextProvider>
						<Outlet />
					</SummaryContextProvider>
				</SavedItemsContextProvider>
			</CartContextProvider>
		</PreferenceContextProvider>
	);
}
