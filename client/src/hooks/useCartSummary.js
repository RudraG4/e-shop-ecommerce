import SummaryContext from "context/SummaryContext";
import { useContext } from "react";

export default function useCartSummary() {
  return useContext(SummaryContext);
}
