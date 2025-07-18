import { useState } from "react";
import LoginForm from "../components/LoginPage/LoginForm";
import { adminLogin, readerLogin, type Credentials } from "../api/auth";
import useUser from "../hooks/useUser";
import { ActionTypes } from "../../reducers/UserInfoReducer";
import { useNavigate } from "react-router-dom";
import Logo from "../components/ui/Logo";

const LoginPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useUser();
  const navigate = useNavigate();

  async function submitHandler(credentials: Credentials) {
    let data = null,
      redirectUrl = "";
    setIsLoading(true);
    switch (credentials.role) {
      case "admin": {
        data = await adminLogin(credentials);
        redirectUrl = "/overview/court";
        if (!data) {
          setIsLoading(false);
          return;
        }
        dispatch({
          type: ActionTypes.LOGIN,
          payload: credentials,
        });
        break;
      }
      case "reader": {
        data = await readerLogin(credentials);
        if (!data) {
          setIsLoading(false);
          return;
        }
        redirectUrl = `/reader/${data.id}`;
        dispatch({
          type: ActionTypes.LOGIN,
          payload: { id: data.id, ...credentials },
        });
        break;
      }
    }

    navigate(redirectUrl);
    setIsLoading(false);
  }

  return (
    <div className="w-full h-[100vh] bg-gray-300 flex items-center justify-center">
      <div className="absolute top-[0] rounded-b-xl  left-1/2 -translate-x-1/2 p-[20px] bg-white">
        <Logo />
      </div>
      <div className="rounded-lg bg-white p-[36px] py-[60px] w-fit flex flex-col gap-[52px]">
        <div className="w-full flex items-center justify-center text-3xl font-semibold">
          Login
        </div>
        <LoginForm isLoading={isLoading} submitHandler={submitHandler} />
      </div>
    </div>
  );
};

export default LoginPage;
