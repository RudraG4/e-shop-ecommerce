import { Form } from "react-bootstrap";

export default function AvailabilityFilter(props) {
  const { onChange = () => {}, value = false } = props;

  return (
    <div className="availability-filter">
      <p className="fw-semibold me-2 pt-2 pb-2 m-0">Availability</p>
      <div className="options">
        <Form.Check className="w-100" id="includeOOSFlag">
          <Form.Check.Input
            type="checkbox"
            className={`${value ? "bg-warning border-warning" : ""}`}
            checked={value}
            onChange={onChange}
            name="includeOOSFlag"
            value={true}
          />
          <Form.Check.Label>Include Out of Stock</Form.Check.Label>
        </Form.Check>
      </div>
    </div>
  );
}
