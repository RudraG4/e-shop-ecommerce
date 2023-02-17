import { forwardRef } from "react";
import styled from "styled-components";

const StyledList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  height: 100%;
`;

const List = forwardRef(function List(props, ref) {
  const { className = "", children } = props;
  return (
    <StyledList className={`list ${className}`} ref={ref}>
      {children}
    </StyledList>
  );
});

const ListItem = forwardRef(function ListItem(props, ref) {
  const { className = "", children } = props;
  return (
    <li className={`list-item ${className}`} ref={ref}>
      {children}
    </li>
  );
});

List.ListItem = ListItem;
List.ListItem.displayName = "ListItem";

export default List;
