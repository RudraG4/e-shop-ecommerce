import styled from 'styled-components';
import { Container, Form, InputGroup, Button } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { Card, Loader, OrderCard } from 'components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useFetch, usePreferenceContext } from 'hooks';

const OrderContainer = styled(Container)`
	max-width: 1260px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	gap: 1rem;
	margin-bottom: 30px;
`;

const OrdersWrapper = styled.div`
	display: flex;
	flex-direction: column;
	min-height: 200px;
`;

const SearchBar = function SearchBar(props) {
	const { className = '', onSearch } = props;
	const [keyword, setKeyword] = useState('');

	const onSubmit = (event) => {
		event.preventDefault();
		console.log(keyword);
		onSearch && onSearch(keyword);
	};

	return (
		<Form role="search" className={`${className} w-100`} onSubmit={onSubmit}>
			<InputGroup>
				<Form.Control
					className="shadow-none flex-grow-1"
					type="search"
					placeholder="Search all orders"
					aria-label="Search"
					value={keyword}
					onChange={(e) => setKeyword(e.target.value)}
				/>
				<Button type="submit" variant="warning">
					<FontAwesomeIcon icon={faMagnifyingGlass} />
				</Button>
			</InputGroup>
		</Form>
	);
};

export default function Orders() {
	const [search, setSearch] = useState();
	const { preference } = usePreferenceContext();
	const [url, setUrl] = useState('/orders');
	const { data = {}, isLoading } = useFetch(url, {}, [url, preference]);
	const { results: orders = [] } = data;

	const handleSearch = (_search) => {
		setUrl(`/orders${_search ? `?search=${_search}` : ''}`);
	};

	useEffect(() => {
		document.title = 'Your Orders';
	}, []);

	const renderOrders = () => {
		return orders.map((order) => <OrderCard key={order._id} order={order} />);
	};

	const renderEmpty = () => {
		if (!isLoading && !orders.length) {
			return (
				<div className="w-100 my-auto">
					<div className="text-center">No results found. Please try another search.</div>
				</div>
			);
		}
	};

	return (
		<OrderContainer className="p-3">
			<Card className="position-relative">
				<Loader show={isLoading} position="absolute" />
				<Card.Header title="Your Orders" actions={<SearchBar onSearch={handleSearch} />} />
				<Card.Body>
					<OrdersWrapper>
						{renderOrders()}
						{renderEmpty()}
					</OrdersWrapper>
				</Card.Body>
			</Card>
		</OrderContainer>
	);
}
