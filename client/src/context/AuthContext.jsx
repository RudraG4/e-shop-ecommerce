import { createContext, useReducer, useEffect, useRef, useState } from 'react';
import { Loader } from 'components';
import AuthService from 'services/AuthService';
import UserService from 'services/UserService';
import AuthReducer, { ACTIONS } from './Reducers/AuthReducer';

const AuthContext = createContext();

export default AuthContext;

export const initialState = { isAuthenticated: false, currentUser: null };

export const Provider = ({ children }) => {
	const [isLoading, setIsLoading] = useState(true);
	const [auth, dispatch] = useReducer(AuthReducer, initialState);
	const didInitialise = useRef(false);

	async function signIn(body) {
		const data = await AuthService.signIn(body);
		if (data?.success) {
			dispatch({
				type: ACTIONS.CURRENTUSER,
				currentUser: data?.user,
				preference: data?.user?.preference
			});
		}
		return data;
	}

	async function signOut() {
		await AuthService.signOut();
		dispatch({ type: ACTIONS.SIGNOUT });
	}

	useEffect(() => {
		if (didInitialise.current) {
			return;
		}
		didInitialise.current = true;
		(async () => {
			try {
				setIsLoading(true);
				const data = await UserService.getUser();
				dispatch({
					type: ACTIONS.CURRENTUSER,
					currentUser: data?.user,
					preference: data?.user?.preference
				});
			} catch (error) {
				console.log(error);
			} finally {
				setIsLoading(false);
			}
		})();
	}, []);

	return (
		<AuthContext.Provider value={{ auth, signIn, signOut }}>
			<Loader show={isLoading} />
			{!isLoading && children}
		</AuthContext.Provider>
	);
};
