import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import {
	useState,
	createRef,
	useEffect,
	createContext,
	useContext,
	useRef,
	cloneElement
} from 'react';
import { List } from 'components';
import { Button } from 'react-bootstrap';
import { useWindowSize, useFetch, usePreferenceContext } from 'hooks';
import './Slider.scss';

const SliderContext = createContext();

const Control = function Control(props) {
	const { type, onClick } = props;
	const context = useContext(SliderContext);
	const { currentSlide, itemRefs, sliderRef, infiniteScroll } = context;
	const [isShow, setIsShow] = useState(true);
	const windowSize = useWindowSize();

	useEffect(() => {
		if (infiniteScroll) return;

		if (sliderRef.current) {
			if (type === 'prev') {
				return setIsShow(currentSlide > 0);
			}
			const itemsWidth = itemRefs
				.slice(currentSlide, itemRefs.length)
				.reduce((_acc, _ref) => {
					return _ref.current ? _acc + _ref.current.clientWidth : _acc;
				}, 0);
			setIsShow(itemsWidth > sliderRef.current.clientWidth);
		}
	}, [currentSlide, itemRefs, windowSize.width]);

	return (
		<Button className={`slider-button-${type}${isShow ? ' is-show' : ''}`} onClick={onClick}>
			<FontAwesomeIcon icon={type === 'prev' ? faAngleLeft : faAngleRight} />
		</Button>
	);
};

function Slider(props) {
	const { dataList = [], url, serviceParams = { skip: 0, limit: 10 } } = props;
	const { infiniteScroll, autoScroll, scrollDuration = 5000 } = props;
	const { showTrackers, className = '', dataKey } = props;
	const { loadingCount = 6, LoadingComponent } = props;
	const { card } = props;
	const [currentSlide, setCurrentSlide] = useState(0);
	const [items = [], setItems] = useState(dataList);
	const [itemRefs, setItemRefs] = useState([]);
	const sliderRef = useRef();
	const trackerRef = useRef();
	const { preference } = usePreferenceContext();
	const { data, isLoading, error } = useFetch(url, { params: serviceParams }, [preference]);

	function scroll(action) {
		setCurrentSlide((currentIndex) => {
			if (itemRefs.length) {
				const _slideIndex = currentIndex + (action === 'next' ? 1 : -1);
				let slideIndex;
				if (infiniteScroll && _slideIndex > itemRefs.length - 1) {
					slideIndex = 0;
				} else if (infiniteScroll && _slideIndex < 0) {
					slideIndex = itemRefs.length - 1;
				} else {
					slideIndex = Math.max(0, Math.min(_slideIndex, itemRefs.length - 1));
				}
				if (slideIndex > itemRefs.length) {
					return;
				}
				const item = itemRefs[slideIndex].current;
				item &&
					sliderRef &&
					sliderRef.current &&
					sliderRef.current.scrollTo({
						left: item.offsetLeft,
						behaviour: 'smooth'
					});
				return slideIndex;
			}
			return currentIndex;
		});
	}

	function scrollToIndex(slideIndex) {
		setCurrentSlide((currentIndex) => {
			if (itemRefs.length) {
				const item = itemRefs[slideIndex].current;
				item &&
					sliderRef &&
					sliderRef.current &&
					sliderRef.current.scrollTo({
						left: item.offsetLeft,
						behaviour: 'smooth'
					});
				return slideIndex;
			}
			return currentIndex;
		});
	}

	useEffect(() => {
		setItemRefs((_oldItemRef) => {
			if (items.length) {
				return [...Array(items.length)].map((_, i) => _oldItemRef[i] || createRef());
			}
			return _oldItemRef;
		});
	}, [items]);

	useEffect(() => {
		let timerRef;
		if (autoScroll && itemRefs.length) {
			timerRef = setInterval(() => {
				scroll('next');
			}, scrollDuration);
		}
		return () => clearInterval(timerRef);
	}, [autoScroll, scrollDuration, itemRefs]);

	useEffect(() => {
		if (!data) return;

		if (Object.prototype.toString.call(data) === '[object Array]') {
			setItems(data);
		} else if (Object.prototype.toString.call(data) === '[object Object]') {
			setItems(data[dataKey || 'results']);
		}
	}, [data]);

	const renderSlides = () => {
		return (
			<List className="slider-list" ref={sliderRef}>
				{items.map((data, index) => {
					return (
						<List.ListItem ref={itemRefs[index]} key={index}>
							{typeof card === 'function' ? card(data) : cloneElement(card, { data })}
						</List.ListItem>
					);
				})}
			</List>
		);
	};

	const renderTrackers = () => {
		if (isLoading) return;

		if (showTrackers) {
			return (
				<List className="slider-trackers" ref={trackerRef}>
					{items.map((data, index) => {
						const isActive = currentSlide === index;
						return (
							<List.ListItem className={isActive ? 'is-active' : ''} key={index}>
								<button onClick={() => scrollToIndex(index)}>{index}</button>
							</List.ListItem>
						);
					})}
				</List>
			);
		}
	};

	const renderSkeletons = () => {
		if (isLoading && LoadingComponent) {
			return (
				<List className="slider-list">
					{[...Array(loadingCount)].map((_, index) => {
						return (
							<List.ListItem key={index}>
								{cloneElement(LoadingComponent)}
							</List.ListItem>
						);
					})}
				</List>
			);
		}
	};

	const renderSlider = () => {
		if (isLoading) return;
		return (
			<>
				<Control type="prev" onClick={() => scroll('prev')} />
				<div className="slider-container">{renderSlides()}</div>
				<Control type="next" onClick={() => scroll('next')} />
			</>
		);
	};

	const renderError = () => {
		if (error) {
			return <div className="text-center">Error loading the content. Try again later</div>;
		}
	};

	if (!card) return;

	return (
		<SliderContext.Provider
			value={{ infiniteScroll, currentSlide, items, sliderRef, itemRefs }}
		>
			<div className={`slider ${className}`}>
				<div className="slider-main-container">
					{renderSkeletons()}
					{renderSlider()}
					{renderError()}
				</div>
				{renderTrackers()}
			</div>
		</SliderContext.Provider>
	);
}

export default Slider;
