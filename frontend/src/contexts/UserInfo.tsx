import { createContext, useReducer } from "react";
import userInfoReducer, {
  initialState,
  type ActionType,
  type UserInfoType,
} from "../../reducers/UserInfoReducer";

interface UserContextType {
  state: UserInfoType;
  dispatch: React.Dispatch<ActionType>;
}

export const UserInfoContext = createContext({} as UserContextType);

export default function UserProvider({
  children,
}: {
  children: React.ReactElement;
}) {
  const [state, dispatch] = useReducer(userInfoReducer, initialState);
  return (
    <UserInfoContext.Provider value={{ state, dispatch }}>
      {children}
    </UserInfoContext.Provider>
  );
}
