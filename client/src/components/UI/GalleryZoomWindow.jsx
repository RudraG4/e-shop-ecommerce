import { Row, Col, Modal } from 'react-bootstrap';
import { Gallery } from 'components';

export default function GalleryZoomWindow(props) {
	const { show, onHide = () => {}, images = [], currentImage, title } = props;

	return (
		<Modal show={show} onHide={onHide} size="xl" centered className="rounded-1">
			<Modal.Header className="border py-2" closeButton>
				<Modal.Title className="fs-5">Images</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Gallery images={images} currentImage={currentImage}>
					<Row>
						<Col xs={12} lg={8}>
							<Gallery.Current />
						</Col>
						<Col xs={12} lg={4}>
							<div className="py-3">
								<div className="fs-5 pe-3">{title}</div>
								<div className="py-3 hstack flex-wrap gap-3">
									{images &&
										images.map((image, index) => (
											<Gallery.Thumb key={index} src={image} size="sm" />
										))}
								</div>
							</div>
						</Col>
					</Row>
				</Gallery>
			</Modal.Body>
		</Modal>
	);
}
