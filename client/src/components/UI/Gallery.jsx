import styled from 'styled-components';
import { createContext, useContext, useState } from 'react';

const GalleryCurrentImageWrapper = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	height: 400px;
	cursor: pointer;
`;

const GalleryCurrentImage = styled.img`
	max-width: 100%;
	display: block;
	max-height: 400px;
	margin: 0 auto;
	overflow: hidden;
	transition: all 1s ease;
`;

const GalleryThumbImageWrapper = styled.div`
	border-radius: 0;
	border: 2px solid #dee2e6;
	overflow: hidden !important;

	&:hover {
		border: 2px solid #5082b5;
	}
`;

const GalleryThumbImage = styled.img`
	height: ${(props) =>
		`${props.size === 'md' ? '80px' : props.size === 'sm' ? '50px' : '100px'} !important`};
	width: ${(props) =>
		`${props.size === 'md' ? '80px' : props.size === 'sm' ? '50px' : '100px'} !important`};
	object-fit: contain !important;
	object-position: center !important;
	margin: auto;
`;

const GalleryContext = createContext();

const Gallery = (props) => {
	const { images = [], children } = props;
	const { currentImage, onChange } = props;

	const initialState = currentImage || (images.length ? images[0] : undefined);

	const [current, setCurrent] = useState(initialState);

	const onThumbClick = (image) => {
		setCurrent(image);
		onChange && onChange(image);
	};

	return (
		<GalleryContext.Provider
			value={{
				current,
				setCurrent,
				images,
				onThumbClick
			}}
		>
			<div className="gallery">{children}</div>
		</GalleryContext.Provider>
	);
};

const Current = (props) => {
	const { title, onClick, onMouseOver = () => {} } = props;
	const { current } = useContext(GalleryContext);

	return (
		<div className="gallery-current">
			<GalleryCurrentImageWrapper>
				<GalleryCurrentImage
					src={current}
					srcSet={current}
					alt={title}
					title={title}
					loading="lazy"
					onClick={() => onClick && onClick(current)}
					onMouseOver={onMouseOver}
				/>
			</GalleryCurrentImageWrapper>
		</div>
	);
};

const Thumb = (props) => {
	const { src, title, onClick, size = 'md' } = props;
	const { current, onThumbClick } = useContext(GalleryContext);

	const isActive = src === current;
	const border = isActive ? 'border-warning border-3' : '';

	const _onClick = () => {
		onThumbClick && onThumbClick(src);
		onClick && onClick(src);
	};
	return (
		<GalleryThumbImageWrapper className={border}>
			<GalleryThumbImage
				src={src}
				alt={title}
				title={title}
				size={size}
				onClick={() => _onClick(src)}
			/>
		</GalleryThumbImageWrapper>
	);
};

Gallery.Current = Current;
Gallery.Thumb = Thumb;
export default Gallery;
