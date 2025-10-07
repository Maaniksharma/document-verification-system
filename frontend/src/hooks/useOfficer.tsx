import { useContext } from "react";
import { OfficerDataContext } from "../contexts/OfficerDataContext";

export default function useOfficer() {
  const context = useContext(OfficerDataContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
