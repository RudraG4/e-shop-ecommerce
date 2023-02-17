import { useState } from "react";
import { Form } from "react-bootstrap";

export default function PriceFilter(props) {
  const { onChange = () => {}, value = "" } = props;
  const [options] = useState([
    { label: "Under 5,000", value: "lt-5000" },
    { label: "5,000 - 10,000", value: "gte-5000-lte-10000" },
    { label: "10,000 - 15,000", value: "gte-10000-lte-15000" },
    { label: "Over 15,000", value: "gt-15000" }
  ]);

  return (
    <div className="price-filter">
      <p className="fw-semibold me-2 pt-2 pb-2 m-0">Price</p>
      <div className="options">
        {options.map((price, i) => {
          return (
            <Form.Check className="w-100" id={`price_${i}`} key={`price_${i}`}>
              <Form.Check.Input
                type="checkbox"
                className={`${
                  price.value === value ? "bg-warning border-warning" : ""
                }`}
                checked={price.value === value}
                onChange={onChange}
                name="price"
                value={price.value}
              />
              <Form.Check.Label>{price.label}</Form.Check.Label>
            </Form.Check>
          );
        })}
      </div>
    </div>
  );
}
