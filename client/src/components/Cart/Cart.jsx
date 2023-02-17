import { Button, Card, Loader } from 'components';
import { useCartContext, useSavedItemsContext } from 'hooks';
import { addToSaved } from 'context/Reducers/SavedItemsReducer';
import EmptyCart from './EmptyCart';
import CartItem from './CartItem';

export default function Cart() {
	const { isLoading, cart, updateCart, removeFromCart, clearCart } = useCartContext();
	const { dispatch: dispatchToSaved } = useSavedItemsContext();
	const { products } = cart;

	const saveForLater = (productId) => {
		const index = products.findIndex((a) => a.productId === productId);
		if (index > -1) {
			const product = products[index];
			removeFromCart(productId);
			dispatchToSaved(addToSaved(product));
		}
	};

	const renderCartItems = () => {
		if (products.length > 0) {
			return products.map((product, _id) => (
				<CartItem
					key={_id}
					item={product}
					updateQty={updateCart}
					saveForLater={saveForLater}
					removeItem={removeFromCart}
				/>
			));
		}
		return <EmptyCart />;
	};

	const renderActions = () => {
		return products.length > 0 ? (
			<Button variant="light" className="border" onClick={clearCart}>
				Clear All
			</Button>
		) : undefined;
	};

	return (
		<Card className="position-relative">
			<Loader show={isLoading} position="absolute" />
			<Card.Header title="Your Cart" actions={renderActions()} />
			<Card.Body className="gap-3">{renderCartItems()}</Card.Body>
		</Card>
	);
}
