import { useEffect } from "react";

export default function useScript(props) {
  useEffect(() => {
    if (props && (props.src || props.code)) {
      const script = document.createElement("script");
      if (props.src) {
        script.src = props.src;
        if (props.async) {
          script.async = true;
        }
      } else if (props.code) {
        script.appendChild(document.createTextNode(props.code));
      }
      if (props.id) {
        script.id = props.id;
      }
      if (props.type) {
        script.type = props.type;
      }
      document.head.appendChild(script);
      return () => document.head.removeChild(script);
    }
  }, [props]);
}