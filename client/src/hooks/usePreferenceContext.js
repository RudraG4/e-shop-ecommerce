import { useContext } from "react";
import PreferenceContext from "context/PreferenceContext";

export default function usePreferenceContext() {
  return useContext(PreferenceContext);
}
