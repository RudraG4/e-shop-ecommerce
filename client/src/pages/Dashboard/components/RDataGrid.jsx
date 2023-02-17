import DataGrid, { SelectColumn } from 'react-data-grid';
import { MdVerifiedUser, MdDelete, MdCircle } from 'react-icons/md';
import { GrUserAdmin } from 'react-icons/gr';
import { Avatar, Loader } from 'components';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Stack, Form } from 'react-bootstrap';
import styled from 'styled-components';
import { useFetch, useDebounce } from 'hooks';
import ReactPaginate from 'react-paginate';

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

const GridWrapper = styled.div`
	padding: 1rem 0;

	.rdg {
		block-size: 450px;
	}

	.rdg .rdg-cell > .rdg-checkbox-label {
		align-items: center;
		cursor: pointer;
		display: flex;
		inset: 0;
		justify-content: center;
		margin-inline-end: 1px;
		position: absolute;
	}
`;

export default function RDataGrid(props) {
	const { serviceUrl = '', columns = [], itemsPerPage = 10, selectable } = props;
	const _columns = useMemo(() => {
		if (selectable) {
			if (columns.findIndex((c) => c.key === SelectColumn.key) <= -1) {
				columns.unshift(SelectColumn);
			}
		}
		return columns;
	}, [columns]);
	const [rows, setRows] = useState([]);
	const [sort, setSort] = useState([{ columnKey: '_id', direction: 'DESC' }]);
	const [selectedRows, setSelectedRows] = useState(() => new Set([]));
	const [pageCount, setPageCount] = useState(0);
	const [total, setTotal] = useState(0);
	const [params, setParams] = useState({
		skip: 0,
		limit: itemsPerPage,
		sort: sort.length ? sort[0].columnKey : undefined,
		direction: sort.length ? sort[0].direction : undefined
	});

	const rowKeyGetter = useCallback((row) => row._id, []);
	const dParams = useDebounce(params, 500);
	const { data, isLoading } = useFetch(serviceUrl, { params: dParams }, [dParams]);

	useEffect(() => {
		setRows(data?.results || []);
		if (data) {
			setTotal(data?.total || 0);
			setPageCount(Math.ceil(data?.total / itemsPerPage) || 1);
		}
	}, [data]);

	const onValueChange = (input) => (e) => {
		setParams((old) => {
			return { ...old, skip: 0, limit: itemsPerPage, [input]: e.target.value };
		});
	};

	const handlePageClick = (event) => {
		setParams((old) => {
			return { ...old, skip: (event.selected * itemsPerPage) % total };
		});
	};

	const onSortChange = (sort) => {
		setSort(sort);
		setParams((old) => {
			return {
				...old,
				sort: sort.length ? sort[0].columnKey : undefined,
				direction: sort.length ? sort[0].direction : undefined
			};
		});
	};

	return (
		<GridWrapper>
			<div>
				<Stack direction="horizontal" className="justify-content-end">
					<Form className="hstack justify-content-end">
						<Form.Group className="mb-3 me-3">
							<Form.Control
								type="text"
								placeholder="Name"
								name="name"
								size="sm"
								onChange={onValueChange('name')}
							/>
						</Form.Group>
						<Form.Group className="mb-3 me-3">
							<Form.Control
								type="text"
								placeholder="Email"
								name="email"
								size="sm"
								onChange={onValueChange('email')}
							/>
						</Form.Group>
					</Form>
				</Stack>
			</div>
			<DataGrid
				columns={_columns}
				rows={rows}
				rowHeight={40}
				rowKeyGetter={rowKeyGetter}
				sortColumns={sort}
				onSortColumnsChange={onSortChange}
				selectedRows={selectedRows}
				onSelectedRowsChange={setSelectedRows}
				renderers={{
					noRowsFallback: isLoading ? (
						<Loader
							show={isLoading}
							position="relative"
							style={{ textAlign: 'center', gridColumn: '1/-1' }}
						/>
					) : (
						<Centered style={{ textAlign: 'center', gridColumn: '1/-1' }}>
							No data
						</Centered>
					)
				}}
			/>
			<Stack direction="horizontal" className="my-3 gap-2 justify-content-end flex-wrap">
				<div>{`Total ${total}`}</div>
				<ReactPaginate
					breakLabel="..."
					previousLabel="<"
					nextLabel=">"
					containerClassName="pagination m-0 justify-content-end"
					activeClassName="active"
					activeLinkClassName="border-secondary text-bg-secondary"
					previousClassName="page-item"
					previousLinkClassName="page-link rounded-0 shadow-none"
					nextClassName="page-item"
					nextLinkClassName="page-link rounded-0 shadow-none"
					breakClassName="page-item"
					breakLinkClassName="page-link shadow-none"
					pageClassName="page-item"
					pageLinkClassName="page-link shadow-none"
					onPageChange={handlePageClick}
					pageRangeDisplayed={3}
					marginPagesDisplayed={1}
					pageCount={pageCount}
					renderOnZeroPageCount={null}
				/>
			</Stack>
		</GridWrapper>
	);
}
