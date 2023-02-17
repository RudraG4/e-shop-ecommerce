export default function EshopBanner({ className }) {
  return (
    <div className={`text-center m-0 p-4 ${className || ""}`}>
      <h4 className="fw-bold mb-5">Shop Safely with E-Shop</h4>
      <ul className="d-flex flex-wrap justify-content-evenly gap-3">
        <li>
          <div className="d-flex align-items-center">
            <div className="mx-auto">
              <img
                src="https://cdn-icons-png.flaticon.com/512/2331/2331592.png"
                alt="Store at your palm"
                srcSet="https://cdn-icons-png.flaticon.com/512/2331/2331592.png"
                className="rounded"
                style={{ width: "50px" }}
              />
            </div>
            <div className="fw-bold fs-5 ms-4">Store at your palm</div>
          </div>
        </li>
        <li>
          <div className="d-flex align-items-center">
            <div className="mx-auto">
              <img
                src="https://cdn-icons-png.flaticon.com/512/2331/2331800.png"
                alt="Express Delivery"
                srcSet="https://cdn-icons-png.flaticon.com/512/2331/2331800.png"
                className="rounded"
                style={{ width: "50px" }}
              />
            </div>
            <div className="fw-bold fs-5 ms-4">Express Delivery</div>
          </div>
        </li>
        <li>
          <div className="d-flex align-items-center">
            <div className="mx-auto">
              <img
                src="	https://cdn-icons-png.flaticon.com/128/869/869636.png"
                alt="Nearby Stores"
                srcSet="	https://cdn-icons-png.flaticon.com/128/869/869636.png"
                className="rounded"
                style={{ width: "50px" }}
              />
            </div>
            <div className="fw-bold fs-5 ms-4">Connect to Store</div>
          </div>
        </li>
      </ul>
    </div>
  );
}
