import styled from "styled-components";
import { Placeholder } from "react-bootstrap";

const Category = styled.div`
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
  background: white;
`;

const CategoryImageWrapper = styled(Placeholder)`
  max-width: 200px;
  overflow: hidden;
`;

const CategoryImage = styled.div`
  background: #c7cbce;
  height: 160px;
  width: 200px;
`;

const CategoryTitleContainer = styled(Placeholder)`
  padding: 0.5rem !important;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CategoryTitle = styled(Placeholder)`
  background: #c7cbce;
  text-align: center;
`;

export default function ProductCardSkeleton(props) {
  return (
    <Category>
      <CategoryImageWrapper animation="glow">
        <CategoryImage className="placeholder" />
      </CategoryImageWrapper>
      <CategoryTitleContainer animation="glow">
        <CategoryTitle xs={8} size="lg" />
      </CategoryTitleContainer>
    </Category>
  );
}
