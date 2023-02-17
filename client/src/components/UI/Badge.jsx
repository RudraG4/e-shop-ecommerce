export default function Badge({ badgeContent, className = '', style = {}, children }) {
	return (
		<div
			className={`${className} position-relative lh-1`}
			style={{ ...style, fontSize: '14px' }}
		>
			{children}
			<span
				className="position-absolute translate-middle badge rounded-pill bg-warning text-dark"
				style={{ left: '90%', top: '2px' }}
			>
				{badgeContent}
			</span>
		</div>
	);
}
