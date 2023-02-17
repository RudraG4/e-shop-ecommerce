import { forwardRef } from "react";

const Error = forwardRef(({ message }, ref) => {
  if (message) {
    return (
      <div ref={ref} className="invalid-feedback">
        {message}
      </div>
    );
  }
});

Error.displayName = "Error";

export default Error;
