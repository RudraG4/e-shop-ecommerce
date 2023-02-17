import styled from "styled-components";
import { Placeholder } from "react-bootstrap";

const Banner = styled.div`
  background: white;
  width: 100vw;
  height: 365px;
  padding: 1rem;
  display: flex;
  flex-direction: row;
`;

const BannerImageWrapper = styled(Placeholder)`
  flex: 1 1 auto;
`;

const BannerImage = styled.div`
  background: #c7cbce;
  height: 100%;
  width: 100%;
`;

const BannerDescContainer = styled(Placeholder)`
  flex: 1 1 auto;
  padding: 0.5rem !important;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-end;
  gap: 1rem;
`;

const StyledPlaceholder = styled(Placeholder)`
  background: #c7cbce;
`;

export default function BannerCardSkeleton(props) {
  return (
    <Banner>
      <BannerImageWrapper animation="glow">
        <BannerImage className="placeholder" />
      </BannerImageWrapper>
      <BannerDescContainer animation="glow">
        <StyledPlaceholder xs={3} size="lg" />
        <StyledPlaceholder xs={10} size="lg" />
        <StyledPlaceholder xs={8} size="lg" />
        <StyledPlaceholder xs={4} size="lg" />
        <StyledPlaceholder.Button xs={5} size="lg" variant="warning" />
      </BannerDescContainer>
    </Banner>
  );
}
