import { MdVerifiedUser, MdCircle } from 'react-icons/md';
import { FaUserPlus, FaUserMinus } from 'react-icons/fa';
import { Avatar } from 'components';
import { Stack } from 'react-bootstrap';
import styled from 'styled-components';
import RDataGrid from 'pages/Dashboard/components/RDataGrid';
import UserService from 'services/UserService';
import useAuthContext from 'hooks/useAuthContext';

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

const getColumns = ({ currentUser }) => {
	return [
		{
			key: '_id',
			name: 'User ID',
			width: 120,
			sortable: true,
			resizable: true
		},
		{
			key: 'name',
			name: 'Name',
			sortable: true,
			formatter: ({ row }) => {
				return (
					<Stack direction="horizontal" title={row.name}>
						<div className="p-1">
							<Avatar src={row.avatar} alt={row.name} rounded width="30" height="30">
								<div className="fw-bold">
									{row.name
										.split(' ')
										.slice(0, 2)
										.map((d) => d[0].toUpperCase())
										.join('')}
								</div>
							</Avatar>
						</div>
						<div className="ms-2 flex-grow-1 text-truncate text-primary">
							{row.name}
						</div>
					</Stack>
				);
			}
		},
		{
			key: 'email',
			name: 'Email',
			width: 200,
			sortable: false,
			formatter: ({ row }) => {
				return row.email || '-';
			}
		},
		{
			key: 'mobile',
			name: 'Phone number',
			width: 150,
			sortable: false,
			formatter: ({ row }) => {
				return row.mobile || '-';
			}
		},
		{
			key: 'isVerified',
			name: 'Verified',
			width: 50,
			sortable: false,
			formatter: ({ row }) => {
				if (row.isVerified) {
					return (
						<Centered>
							<MdVerifiedUser size="20" color="#4daf51" />
						</Centered>
					);
				}
			}
		},
		{
			key: 'admin',
			name: 'Role',
			width: 100,
			sortable: false,
			formatter: ({ row }) => {
				return row.admin ? 'Admin' : 'User';
			}
		},
		{
			key: 'status',
			name: 'Status',
			width: 100,
			sortable: false,
			formatter: ({ row }) => {
				const { status } = row;
				return (
					<Stack direction="horizontal">
						<MdCircle size="10" color={status === 'Active' ? '#134d04' : '#da1a26'} />
						<span className="ms-1">{row.status}</span>
					</Stack>
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
						{!row.admin && row.isVerified && (
							<Button
								title="Make Admin"
								onClick={async () => {
									const data = await UserService.makeAdmin(row._id);
									console.log(data);
								}}
							>
								<FaUserPlus size="16" color="#505050" />
							</Button>
						)}
						{row.email !== currentUser.email && row.admin && (
							<Button
								title="Revoke Admin"
								onClick={async () => {
									const data = await UserService.revokeAdmin(row._id);
									console.log(data);
								}}
							>
								<FaUserMinus size="16" color="#505050" />
							</Button>
						)}
					</Stack>
				);
			}
		}
	];
};

export default function Users() {
	const { auth } = useAuthContext();

	return (
		<div className="position-relative p-3 h-100">
			<div className="border-bottom">
				<h3>Users</h3>
			</div>
			<RDataGrid serviceUrl="/users" columns={getColumns(auth)} />
		</div>
	);
}
