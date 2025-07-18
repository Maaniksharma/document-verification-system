import { createContext, useReducer } from "react";
import adminDataReducer, {
  type ActionType,
  initialState,
} from "../../reducers/AdminDataReducer";

interface AdminContextType {
  state: any;
  dispatch: React.Dispatch<ActionType>;
}

export const AdminDataContext = createContext({} as AdminContextType);

export default function AdminProvider({
  children,
}: {
  children: React.ReactElement;
}) {
  const [state, dispatch] = useReducer(adminDataReducer, initialState);
  return (
    <AdminDataContext.Provider value={{ state, dispatch }}>
      {children}
    </AdminDataContext.Provider>
  );
}
