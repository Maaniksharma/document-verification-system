import { useContext } from "react";
import { AdminDataContext } from "../contexts/AdminDataContext";

export default function useAdmin() {
  const context = useContext(AdminDataContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
