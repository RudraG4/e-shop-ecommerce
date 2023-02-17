import { createSlice } from 'context/Redux';
import ls from 'local-storage';

const LOCAL_SAVED_KEY = 'saved_eshop';

const SavedItemsSlice = createSlice({
	initialState: {
		value: ls.get(LOCAL_SAVED_KEY) || []
	},
	reducers: {
		addToSaved: function (savedItems, item) {
			if (!item) return savedItems;
			const index = savedItems.findIndex((a) => a.productId === item.productId);
			if (index > -1) {
				return this.updateSaved(savedItems, {
					productId: savedItems[index]['productId'],
					productQuantity: item.productQuantity
				});
			}
			const newItems = [...savedItems, item];
			ls.set(LOCAL_SAVED_KEY, newItems);
			return newItems;
		},
		removeFromSaved: function (savedItems, productId) {
			const index = savedItems.findIndex((a) => a.productId === productId);
			if (index > -1) {
				const newItems = [...savedItems.slice(0, index), ...savedItems.slice(index + 1)];
				ls.set(LOCAL_SAVED_KEY, newItems);
				return newItems;
			}
			return savedItems;
		},
		updateSaved: function (savedItems, value) {
			const { productId, productQuantity } = value;
			const index = savedItems.findIndex((a) => a.productId === productId);
			if (index > -1) {
				const oldItem = savedItems[index];
				const newItems = [...savedItems];
				const newQuantity = oldItem['productQuantity'] + productQuantity;
				newItems[index]['productQuantity'] = newQuantity;
				const totalCost = newItems[index]['productCost'] * newQuantity;
				newItems[index]['productTotalCost'] = parseFloat(totalCost.toFixed(2));
				ls.set(LOCAL_SAVED_KEY, newItems);
				return newItems;
			}
			return savedItems;
		},
		clearSaved: () => []
	}
});

export const { addToSaved, removeFromSaved, updateSaved, clearSaved } = SavedItemsSlice.actions;

export default SavedItemsSlice.reducer;
