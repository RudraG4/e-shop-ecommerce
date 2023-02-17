import { useRef, useState } from "react";
import { Loader, Button } from "components";
import { Form, InputGroup } from "react-bootstrap";

export default function PromoCodeForm({ onClick }) {
  const formRef = useRef(null);
  const inputRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState();
  const [error, setError] = useState();

  const handleChange = (event) => {
    const { value } = event.target;
    setCode(value);
    setError();
    formRef.current.classList.remove("was-validated");
    inputRef.current.classList.remove("has-validation");
  };

  const handleClick = (event) => {
    event.preventDefault();
    if (code) {
      setIsLoading(true);
      setTimeout(() => {
        if (code === "12345") {
          formRef.current.classList.add("was-validated");
          const discountVal = Math.floor(Math.random() * 50);
          onClick(event, { code, discount: discountVal });
        } else {
          setError("Invalid promocode");
          inputRef.current.classList.add("has-validation");
        }
        setIsLoading(false);
      }, 1500);
    } else {
      setError("Enter a valid promocode");
      inputRef.current.classList.add("has-validation");
    }
  };

  const renderForm = () => {
    return (
      <Form className="needs-validation" ref={formRef} noValidate>
        <InputGroup ref={inputRef}>
          <Form.Control
            type="text"
            className={`${error ? "is-invalid" : ""}`}
            name="promocode"
            id="promocode"
            placeholder="Promocode"
            required
            onChange={handleChange}
          />
          <Button variant="dark" type="submit" onClick={handleClick}>
            Apply
          </Button>
          {error && (
            <Form.Control.Feedback type="invalid">
              {error}
            </Form.Control.Feedback>
          )}
        </InputGroup>
      </Form>
    );
  };

  return (
    <div className="promocode-form position-relative">
      {renderForm()}
      {isLoading && <Loader position="absolute" />}
    </div>
  );
}

PromoCodeForm.defaultProps = {
  onChange: () => {}
};
