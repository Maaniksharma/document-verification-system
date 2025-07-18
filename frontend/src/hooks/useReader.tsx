import { useContext } from "react";
import { ReaderDataContext } from "../contexts/ReaderDataContext";

export default function useReader() {
  const context = useContext(ReaderDataContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
