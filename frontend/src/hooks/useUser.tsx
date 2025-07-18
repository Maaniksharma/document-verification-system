import { useContext } from "react";
import { UserInfoContext } from "../contexts/UserInfo";

export default function useUser() {
  const context = useContext(UserInfoContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
