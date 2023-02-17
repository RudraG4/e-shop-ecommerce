import { Link } from "react-router-dom";
import { Logo, List } from "components";
import { Col, Container, Row } from "react-bootstrap";
import styled from "styled-components";
import { useState } from "react";

const StyledRow = styled(Row)`
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const FooterTitle = styled.div`
  font-size: 16px;
  font-weight: 500;
  min-height: 2rem;
  margin-bottom: 0.65rem;
`;

const FooterContent = styled.div`
  font-size: 12px;
  font-weight: 400;
`;

const StyledListItem = styled.li`
  margin-bottom: 5px;
  white-space: nowrap;

  &:hover {
    color: #ffc107;
  }
`;

const BackToTop = styled.div`
  width: 100%;
  line-height: 2;
  text-align: center;
  color: #fff;
  background-color: rgba(108, 117, 125, 1);
  cursor: pointer;
`;

const _initData = [
  {
    label: "Get to know us",
    links: [
      { label: "About Us", to: "#" },
      { label: "Careers", to: "#" },
      { label: "Services", to: "#" }
    ]
  },
  {
    label: "Connect with us",
    links: [
      { label: "Facebook", to: "#" },
      { label: "Twitter", to: "#" },
      { label: "Instagram", to: "#" }
    ]
  },
  {
    label: "Useful links",
    links: [
      { label: "FAQs", to: "#" },
      { label: "Site Map", to: "#" },
      { label: "Terms & Conditions", to: "#" },
      { label: "Disclaimer", to: "#" },
      { label: "Privacy Policy", to: "#" }
    ]
  },
  {
    label: "Mail Us",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut."
  },
  {
    label: "Registered Office Address",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Curabitur vitae nunc sed velit."
  }
];

export default function Footer() {
  const [data = []] = useState(_initData);

  return (
    <footer>
      <BackToTop onClick={() => window.scrollTo(0, 0)}>Back To Top</BackToTop>
      <Container fluid className="text-bg-dark p-3">
        <Container className="p-0 text-white">
          <StyledRow>
            {data.map((item, index) => {
              return (
                <Col key={index} className="p-3">
                  <FooterTitle>{item.label}</FooterTitle>
                  <FooterContent>
                    <List>
                      {item.links &&
                        item.links.map((link, lindex) => {
                          return (
                            <StyledListItem key={lindex}>
                              <Link
                                to={link.to}
                                className="text-underline-hover"
                              >
                                {link.label}
                              </Link>
                            </StyledListItem>
                          );
                        })}
                      {item.description && (
                        <p className="overflow-wrap">{item.description}</p>
                      )}
                    </List>
                  </FooterContent>
                </Col>
              );
            })}
          </StyledRow>
          <div className="text-center py-3 border-top border-secondary">
            <Logo size="sm" color="white" />
            <p className="m-0 fs-7">
              Copyright © 2022 E-Shop™. All rights reserved.
            </p>
          </div>
        </Container>
      </Container>
    </footer>
  );
}
