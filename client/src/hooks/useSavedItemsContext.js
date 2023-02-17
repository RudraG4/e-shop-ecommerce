import { useContext } from "react";
import SavedItemsContext from "context/SavedItemsContext";

export default function useSavedItemsContext() {
  return useContext(SavedItemsContext);
}
