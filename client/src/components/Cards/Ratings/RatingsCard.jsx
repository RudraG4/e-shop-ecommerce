import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

export default function RatingsCard(props) {
  const {
    totalStars = 5,
    rating = 0,
    totalRating = 0,
    stats = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  } = props;

  const _rating = rating.toFixed(1);

  return (
    <div className="rating-card border" style={{ maxWidth: "396px" }}>
      <div className="p-3 d-flex justify-content-between flex-wrap gap-2">
        <div className="rating-overview d-flex flex-column">
          <p className="fw-bold pb-2 m-0 lh-1">Overall rating</p>
          <div className="d-inline-flex align-items-center gap-2 pb-2 m-0 lh-1 text-warning">
            <span className="fs-5 fw-bold">{_rating}</span>
            <FontAwesomeIcon icon={faStar} />
          </div>
          <p className="fs-6 pb-2 m-0 lh-1">{`Based on ${totalRating} Ratings`}</p>
        </div>
        <div className="rating-statistic d-flex flex-column">
          {[...Array(totalStars)].map((_, i) => {
            const curStar = totalStars - i;
            const score = stats[curStar] || 0;
            let width = Number(((score / totalRating) * 100).toFixed(2));
            width = width >= 100 ? 100 : width;
            return (
              <div className="d-flex align-items-center gap-1" key={i}>
                <div>{`${curStar} star`}</div>
                <div
                  className="bg-secondary overflow-hidden"
                  style={{ width: "100px", marginTop: "2px" }}
                >
                  <div
                    className="bg-warning"
                    style={{ height: "5px", width: `${width}%` }}
                  ></div>
                </div>
                <p className="text-start m-0">{score}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
