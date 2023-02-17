import { Link } from 'react-router-dom';

export default function Logo({ size, color, to }) {
	let className = 'fw-bold text-decoration-none';
	if (size === 'lg') {
		className += ' fs-1';
	} else if (size === 'md') {
		className += ' fs-2';
	} else {
		className += ' fs-3';
	}

	className += ` text-${color || 'dark'}`;

	return (
		<Link className={className} to={to || '/'}>
			E-Shop
		</Link>
	);
}
