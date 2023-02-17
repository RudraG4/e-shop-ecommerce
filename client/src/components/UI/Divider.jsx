export default function Divider({ className = "", direction, message }) {
  let _className = className || "";

  if (direction === "vertical") {
    _className = _className + " border-start ms-1 m-auto me-1";
    if (message) {
    }
    return (
      <div className={_className} style={{ width: "2px", height: "50%" }}>
        {message}
      </div>
    );
  }

  if (message) {
    return (
      <div
        className={`position-relative hstack text-secondary mt-3 mb-3 ${className}`}
      >
        <div className="flex-grow-1 border-bottom"></div>
        <small
          className="ps-2 pe-2 text-center lh-1"
          style={{ maxWidth: "75%" }}
        >
          {message}
        </small>
        <div className="flex-grow-1 border-bottom"></div>
      </div>
    );
  }

  return <div className={`w-100 border-bottom mt-3 mb-3 ${className}`}></div>;
}
