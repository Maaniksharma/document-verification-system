import React from "react";
import useUser from "../../hooks/useUser";
import LoginPage from "../../pages/LoginPage";

const IsAuthorized = ({ children }: { children: React.ReactNode }) => {
  const userData = useUser();

  const { IsAuthenticated } = userData.state;
  if (!IsAuthenticated) return <LoginPage />;

  return children;
};

export default IsAuthorized;
