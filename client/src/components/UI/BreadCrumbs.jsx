import { Breadcrumb } from 'react-bootstrap';

export default function BreadCrumbs(props) {
	const { product } = props;

	if (!product) return;
	return (
		<Breadcrumb>
			<Breadcrumb.Item href="/" className="text-capitalize">
				Home
			</Breadcrumb.Item>
			{product.category && (
				<Breadcrumb.Item
					href={`/products?category=${product.category}`}
					className="text-capitalize"
				>
					{product.category}
				</Breadcrumb.Item>
			)}
			{product.title && (
				<Breadcrumb.Item active className="text-capitalize">
					{product.title}
				</Breadcrumb.Item>
			)}
		</Breadcrumb>
	);
}
