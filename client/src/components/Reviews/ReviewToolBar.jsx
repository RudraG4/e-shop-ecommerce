import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { SortBy } from "components";
import { Row, Col, InputGroup, Form } from "react-bootstrap";
import { useState } from "react";

export default function ReviewToolBar(props) {
  const { setSearchParam = () => {} } = props;
  const _options = [
    { label: "Newest First", value: "newest" },
    { label: "Highest Rated", value: "highest" }
  ];
  const [options] = useState(_options);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState(_options[0].value);

  const onSearchValueChange = (event) => {
    const { value } = event.target;
    setSearch(value);
    if (!value) {
      setSearchParam({ search: value, sort });
    }
  };

  const onSearchKeyDown = (event) => {
    if (event.key === "Enter") {
      setSearchParam({ search, sort });
    }
  };

  const onSortChange = (value) => {
    setSort(value);
    setSearchParam({ search, sort: value });
  };

  return (
    <div className="review-toolbar pb-4">
      <p className="fs-5 fw-semibold m-0 mb-2">Customer Reviews:</p>
      <Row className="align-items-center justify-content-between gap-2">
        <Col lg={4} className="w-auto">
          <InputGroup>
            <InputGroup.Text>
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </InputGroup.Text>
            <Form.Control
              type="search"
              className="shadow-none"
              placeholder="Search reviews"
              aria-label="Search"
              value={search}
              onChange={onSearchValueChange}
              onKeyDown={onSearchKeyDown}
            />
          </InputGroup>
        </Col>
        <Col lg={4} className="w-auto">
          <SortBy options={options} sort={sort} onChange={onSortChange} />
        </Col>
      </Row>
    </div>
  );
}
