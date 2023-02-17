import { useState } from 'react';
import { Card } from 'components';
import SavedItem from './SavedItem';
import { ToggleButton, ToggleButtonGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faGrip } from '@fortawesome/free-solid-svg-icons';
import { useCartContext, useSavedItemsContext } from 'hooks';
import { removeFromSaved } from 'context/Reducers/SavedItemsReducer';
import { addToCart } from 'context/Reducers/CartReducer';

export default function SavedForLater() {
	const [view, setView] = useState('grid');
	const { state: savedItems, dispatch: dispatchToSaved } = useSavedItemsContext();
	const { dispatch: dispatchToCart } = useCartContext();
	const totalItems = savedItems.length;
	const title = `Saved for later ${totalItems > 0 ? `(${totalItems} items)` : ''}`;

	const removeSavedItem = (productId) => {
		dispatchToSaved(removeFromSaved(productId));
	};

	const moveToCart = (productId) => {
		const index = savedItems.findIndex((a) => a.productId === productId);
		if (index > -1) {
			const savedItem = savedItems[index];
			removeSavedItem(productId);
			dispatchToCart(addToCart(savedItem));
		}
	};

	function renderSavedListItems() {
		if (totalItems > 0) {
			return savedItems.map((savedItem, _id) => {
				return (
					<SavedItem
						style={view === 'grid' ? { maxWidth: '234px' } : {}}
						direction={view === 'grid' ? 'vertical' : 'horizontal'}
						key={_id}
						item={savedItem}
						moveToCart={moveToCart}
						removeItem={removeSavedItem}
					/>
				);
			});
		}
		return <div className="text-center">No items in your saved list</div>;
	}

	const renderTooltip = (props, children) => (
		<Tooltip {...props} className="rounded-0">
			{children}
		</Tooltip>
	);

	const renderActions = () => {
		if (totalItems > 0) {
			return (
				<ToggleButtonGroup
					type="radio"
					value={view}
					name="view"
					onChange={setView}
					className="gap-2"
				>
					<ToggleButton id="grid" className="rounded" variant="light" value="grid">
						<OverlayTrigger
							placement="top"
							overlay={(props) => renderTooltip(props, 'Card')}
						>
							<FontAwesomeIcon icon={faGrip} />
						</OverlayTrigger>
					</ToggleButton>
					<ToggleButton id="list" className="rounded" variant="light" value="list">
						<OverlayTrigger
							placement="top"
							overlay={(props) => renderTooltip(props, 'List')}
						>
							<FontAwesomeIcon icon={faList} />
						</OverlayTrigger>
					</ToggleButton>
				</ToggleButtonGroup>
			);
		}
	};

	return (
		<Card>
			<Card.Header title={title} actions={renderActions()} />
			<Card.Body>
				<div className="row m-0 flex-wrap gap-3">{renderSavedListItems()}</div>
			</Card.Body>
		</Card>
	);
}
