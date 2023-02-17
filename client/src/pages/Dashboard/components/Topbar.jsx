import styled from 'styled-components';
import { Avatar, Badge, Logo } from 'components';
import { IoStorefrontOutline, IoNotificationsOutline, IoSettingsOutline } from 'react-icons/io5';
import { NavLink } from 'react-router-dom';
const TopBar = styled.div`
	width: 100%;
	height: 50px;
	background-color: white;
	position: sticky;
	top: 0;
	box-shadow: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
	z-index: 1024;
`;

const TopBarWrapper = styled.div`
	height: 100%;
	padding: 0 20px;
	display: flex;
	align-items: center;
	justify-content: space-between;
`;

const NavContainer = styled.div`
	font-weight: 700;
	font-size: 1.2rem;
	display: flex;
	align-items: center;
	gap: 1rem;
	position: relative;
	cursor: pointer;
`;

export default function Topbar() {
	return (
		<TopBar>
			<TopBarWrapper>
				<div className="top-bar-left">
					<Logo to="/dashboard" />
				</div>
				<div className="top-bar-right">
					<NavContainer>
						<NavLink to="/">
							<IoStorefrontOutline size="20" title="Go to Store" />
						</NavLink>
						<NavLink to="notifications">
							<Badge badgeContent={1}>
								<IoNotificationsOutline size="20" title="Notifications" />
							</Badge>
						</NavLink>
						<NavLink to="settings">
							<IoSettingsOutline size="20" title="Settings" />
						</NavLink>
						<NavLink to="profile">
							<Avatar
								src="https://mui.com/static/images/avatar/1.jpg"
								alt="avatar"
								title="Profile"
							/>
						</NavLink>
					</NavContainer>
				</div>
			</TopBarWrapper>
		</TopBar>
	);
}
