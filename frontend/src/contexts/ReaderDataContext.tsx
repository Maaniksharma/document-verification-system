import { createContext, useReducer } from "react";
import ReaderReducer, {
  type ActionType,
  initialState,
} from "../../reducers/ReaderDataReducer";

interface AdminContextType {
  state: any;
  dispatch: React.Dispatch<ActionType>;
}

export const ReaderDataContext = createContext({} as AdminContextType);

export default function ReaderProvider({
  children,
}: {
  children: React.ReactElement;
}) {
  const [state, dispatch] = useReducer(ReaderReducer, initialState);
  return (
    <ReaderDataContext.Provider value={{ state, dispatch }}>
      {children}
    </ReaderDataContext.Provider>
  );
}
