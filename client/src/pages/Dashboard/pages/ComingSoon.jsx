import styled from 'styled-components';

const Center = styled.div`
	display: flex;
	flex: 1 1 auto;
	flex-direction: column;
	align-self: stretch;
	justify-content: center !important;
	align-items: center !important;
	height: 100%;
`;
export default function CommingSoon() {
	return (
		<Center>
			<div className="fw-bold fs-1">Coming Soon</div>
		</Center>
	);
}
