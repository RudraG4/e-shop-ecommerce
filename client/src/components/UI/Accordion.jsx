import styled from 'styled-components';
import React, { createContext, useContext, useState } from 'react';

const SAccordion = styled.div`
	display: flex;
	flex: 1 1 auto;
	flex-direction: column;
	align-self: stretch;
`;

const SAccordionItem = styled.div`
	background: white;
	color: black;
	border-bottom: 1px solid #dee2e6;
	padding: 0.75rem 0px;
`;

const SAccordionHeader = styled.div`
	display: flex;
	justify-content: flex-start;
	align-items: center;
	cursor: pointer;
`;

const AccordionContext = createContext();
const AccordionItemContext = createContext();

const Accordion = ({ defaultItemKey, activeKey, children }) => {
	const [activeItemKey, setActiveItemKey] = useState(defaultItemKey);
	const onSelect = (itemKey) => {
		setActiveItemKey(itemKey);
	};

	return (
		<SAccordion>
			<AccordionContext.Provider value={{ activeItemKey, onSelect }}>
				{children}
			</AccordionContext.Provider>
		</SAccordion>
	);
};

const AccordionItem = (props) => {
	const { itemKey, children } = props;

	return (
		<SAccordionItem>
			<AccordionItemContext.Provider value={{ itemKey }}>
				{React.Children.map(children, (child) => {
					if (!child) return;

					const newProps = { ...child.props };
					if (newProps.itemKey === undefined) {
						newProps.itemKey = itemKey;
					}
					return React.cloneElement(child, newProps);
				})}
			</AccordionItemContext.Provider>
		</SAccordionItem>
	);
};

const AccordionHeader = ({ itemKey, title, onClick }) => {
	const context = useContext(AccordionContext);
	const { onSelect } = context;
	const handleOnClick = !onClick ? onSelect : onClick;
	return (
		<SAccordionHeader onClick={() => handleOnClick(itemKey)}>
			<div className="btn btn-light rounded-circle border px-3 py-2 fw-bold">{itemKey}</div>
			<div className="ms-2 fw-bold fs-5 flex-grow-1">{title}</div>
		</SAccordionHeader>
	);
};

const AccordionBody = (props) => {
	const { itemKey, children } = props;
	const context = useContext(AccordionContext);
	const { activeItemKey } = context;
	return (
		<div className="bg-text-white">
			{activeItemKey === itemKey && <div className="p-3 ps-5">{children}</div>}
		</div>
	);
};

Accordion.Item = AccordionItem;
Accordion.Header = AccordionHeader;
Accordion.Body = AccordionBody;

export default Accordion;
