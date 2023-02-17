import { Ratings } from "components";

export default function ReviewInfo(props) {
  const { data = {} } = props;
  return (
    <div className="review-info">
      <p className="review-user fs-5 fw-semibold mb-1">
        {data.user?.username || "Anonymous"}
      </p>
      <div className="review-rating-info d-flex gap-2 mb-1">
        <Ratings rating={data.userRating} color="#ffc107" />
        <div className="border-start ps-2">{data.reviewDate}</div>
      </div>
      <div className="review-description">{data.body}</div>
    </div>
  );
}
