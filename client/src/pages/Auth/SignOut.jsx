import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from 'hooks';
import { Loader } from 'components';

export default function SignOut() {
	const { auth, signOut } = useAuthContext();
	const [isPending, setIsPending] = useState(true);
	const { isAuthenticated } = auth;

	useEffect(() => {
		async function _signout() {
			if (isAuthenticated) {
				setIsPending(true);
				try {
					await signOut();
				} catch (e) {}
			}
			setIsPending(false);
		}
		_signout();
	}, []);

	return <>{isPending ? <Loader show={isPending} /> : <Navigate to="/auth/signin" />}</>;
}
