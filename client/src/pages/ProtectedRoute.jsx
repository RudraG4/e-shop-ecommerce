import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import AuthContext from 'context/AuthContext';

export default function ProtectedRoute({ component, redirect }) {
	const { auth } = useContext(AuthContext);
	const location = useLocation();

	if (auth.isAuthenticated) {
		return React.isValidElement(component) ? component : null;
	} else {
		return <Navigate to="/auth/signin" state={{ redirect: redirect || location.pathname }} />;
	}
}
