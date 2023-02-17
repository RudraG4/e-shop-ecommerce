export default function NavBar({ className = '', children }) {
	return (
		<nav className={`navbar navbar-expand-lg w-100 px-3 py-0 m-auto gap-2 ${className}`}>
			{children}
		</nav>
	);
}
