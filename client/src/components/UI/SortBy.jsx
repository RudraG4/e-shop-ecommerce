import { useState } from "react";
import { Dropdown } from "react-bootstrap";

export default function SortBy(props) {
  const _options = [
    { label: "Newest Arrival", value: "newest" },
    { label: "Low - High", value: "price_asc" },
    { label: "High - Low", value: "price_desc" },
    { label: "Highest Rated", value: "high_rated" }
  ];
  const {
    sort,
    options = _options,
    onChange,
    labelDirection = "row",
    className
  } = props;
  const [optionMap] = useState(getOptionMap(options));
  let _className = "";

  function getOptionMap() {
    return options.reduce((accum, curr, index) => {
      accum[curr["value"]] = curr["label"];
      return accum;
    }, {});
  }

  const onSelect = (eventKey, event) => {
    event.preventDefault();
    onChange(eventKey);
  };

  if (labelDirection === "column") {
    _className += " flex-column justify-content-center";
  } else {
    _className += " flex-row align-items-center";
  }

  return (
    <div className={`sort-by ${className || ""}`}>
      <div className={`d-flex gap-2${_className}`}>
        <div className="fw-semibold">Sort By</div>
        <Dropdown onSelect={onSelect}>
          <Dropdown.Toggle variant="light" className="border">
            {optionMap[sort]}
          </Dropdown.Toggle>
          <Dropdown.Menu style={{ "--bs-dropdown-link-active-bg": "#ffc107" }}>
            {options.map((_, i) => {
              return (
                <Dropdown.Item
                  key={i}
                  eventKey={_.value}
                  aria-label={_.label}
                  active={_.value === sort}
                >
                  {_.label}
                </Dropdown.Item>
              );
            })}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
}

SortBy.defaultProps = {
  onChange: () => {}
};
