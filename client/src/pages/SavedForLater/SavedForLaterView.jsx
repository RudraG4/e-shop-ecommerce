import { SavedForLater } from "components";
import { useEffect } from "react";

export default function SavedForLaterView() {
  useEffect(() => {
    document.title = "E-Shop Saved Items";
  }, []);

  const imgStyle = {
    position: "sticky",
    top: "1rem",
    minWidth: "calc(375px - 2rem)",
    maxHeight: "100vh",
    maxWidth: "calc(375px - 2rem)"
  };

  return (
    <div className="content">
      <div className="row m-0 position-relative">
        <div className="col p-0">
          <SavedForLater />
        </div>
        <div className="col p-0" style={imgStyle}>
          <div className="hstack justify-content-center p-3 h-100">
            <img
              width="100%"
              src="https://cdni.iconscout.com/illustration/premium/thumb/add-to-wishlist-4150969-3437890.png"
              alt="Saved Items Illustration"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
