import { forwardRef } from "react";
import Countdown, { zeroPad } from "react-countdown";

const CountdownTimer = forwardRef((props, ref) => {
  function setCountdownRef(countdown) {
    if (countdown && ref) {
      ref.current = countdown.getApi();
    }
  }

  function renderCounter({ hours, minutes, seconds, completed }) {
    return (
      <span className={`${props.className || ""}`}>
        {`${zeroPad(minutes)}:${zeroPad(seconds)}`}
      </span>
    );
  }

  return (
    <Countdown
      className={props.className}
      ref={setCountdownRef}
      date={props.startTime}
      renderer={renderCounter}
    />
  );
});

CountdownTimer.displayName = "CountdownTimer";
export default CountdownTimer;
