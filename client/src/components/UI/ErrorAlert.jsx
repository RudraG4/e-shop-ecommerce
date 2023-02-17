import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";

export default function ErrorAlert({ children }) {
  return (
    <div className="border border-danger rounded bg-white" role="alert">
      <div className="p-3">
        <div className="hstack lh-sm">
          <FontAwesomeIcon
            icon={faCircleExclamation}
            className="text-danger align-self-start mt-1 me-3 fs-4"
          />
          <div className="alert-content">
            <div className="text-danger fs-5">There was a problem</div>
            <div>
              <small>{children}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
