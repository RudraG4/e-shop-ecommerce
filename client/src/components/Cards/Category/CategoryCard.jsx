import { useNavigate } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';

export default function CategoryCard(props) {
	const { data } = props;
	const navigate = useNavigate();

	if (!data) return;

	return (
		<div
			className="text-center border rounded overflow-hidden"
			style={{ maxWidth: '200px' }}
			title={data.label}
			onClick={() => navigate(`/products?category=${data.name}`)}
		>
			<LazyLoadImage
				src={data.image}
				width={200}
				height={160}
				effect="blur"
				alt={data.label}
			/>
			<div className="text-center text-truncate fw-bold text-capitalize fs-6 p-2">
				{data.label}
			</div>
		</div>
	);
}
