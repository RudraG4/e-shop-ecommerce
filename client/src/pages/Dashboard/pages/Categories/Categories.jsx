import { MdEdit } from 'react-icons/md';
import { Stack } from 'react-bootstrap';
import styled from 'styled-components';
import RDataGrid from 'pages/Dashboard/components/RDataGrid';

const Centered = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-around;
	text-align: center;
	height: 100%;
	width: 100%;
`;

const Button = styled.button`
	outline: 0;
	padding: 0;
	margin: 0;
	border: none;
	border-radius: 50%;
	background: none;
	height: 20px;
	width: 20px;
	line-height: 1;
`;

const getColumns = () => {
	return [
		{
			key: '_id',
			name: 'Category ID',
			width: 200,
			sortable: true,
			resizable: true
		},
		{
			key: 'label',
			name: 'Category Name',
			sortable: true,
			formatter: ({ row }) => {
				return <div className="ms-2 text-truncate text-primary">{row.label}</div>;
			}
		},
		{
			key: 'image',
			name: 'Image',
			width: 200,
			sortable: true,
			formatter: ({ row }) => {
				return (
					<Centered>
						<img src={row.image} alt={row.label} height="30" />
					</Centered>
				);
			}
		},
		{
			key: 'operation',
			name: 'Operation',
			width: 100,
			sortable: false,
			formatter: ({ row }) => {
				return (
					<Stack direction="horizontal" className="h-100">
						<Button title="Edit">
							<MdEdit size="16" color="#505050" />
						</Button>
					</Stack>
				);
			}
		}
	];
};

export default function Categories() {
	return (
		<div className="position-relative p-3 h-100">
			<div className="border-bottom">
				<h3>Categories</h3>
			</div>
			<RDataGrid serviceUrl="/categories" columns={getColumns()} />
		</div>
	);
}
