import { MdVerifiedUser, MdDelete, MdCircle, MdEdit } from 'react-icons/md';
import { GrUserAdmin } from 'react-icons/gr';
import { Avatar } from 'components';
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
			name: 'Product ID',
			width: 120,
			sortable: true,
			resizable: true
		},
		{
			key: 'title',
			name: 'Product Name',
			sortable: true,
			formatter: ({ row }) => {
				return <div className="ms-2 text-truncate text-primary">{row.title}</div>;
			}
		},
		{
			key: 'thumbnail',
			name: 'Image',
			width: 100,
			sortable: true,
			formatter: ({ row }) => {
				return (
					<Centered>
						<img src={row.thumbnail} alt={row.title} height="30" />
					</Centered>
				);
			}
		},
		{
			key: 'category',
			name: 'Category',
			width: 120,
			sortable: false,
			formatter: ({ row }) => {
				return row.category || '-';
			}
		},
		{
			key: 'availability',
			name: 'Availability',
			width: 100,
			sortable: false,
			formatter: ({ row }) => {
				return (
					<div style={{ color: row.availability === 'In Stock' ? '#00ba34' : '#e92c2c' }}>
						{row.availability}
					</div>
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

export default function Products() {
	return (
		<div className="position-relative p-3 h-100">
			<div className="border-bottom">
				<h3>Products</h3>
			</div>
			<RDataGrid serviceUrl="/products" columns={getColumns()} />
		</div>
	);
}
