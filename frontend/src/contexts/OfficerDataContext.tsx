import { createContext, useReducer } from "react";
import OfficerReducer, {
  initialState,
} from "../../reducers/OfficerInfoReducer";
import type { ActionType } from "../../reducers/OfficerInfoReducer";

interface OfficerContextType {
  state: any;
  dispatch: React.Dispatch<ActionType>;
}

export const OfficerDataContext = createContext({} as OfficerContextType);

export default function OfficerProvider({
  children,
}: {
  children: React.ReactElement;
}) {
  const [state, dispatch] = useReducer(OfficerReducer, initialState);
  return (
    <OfficerDataContext.Provider value={{ state, dispatch }}>
      {children}
    </OfficerDataContext.Provider>
  );
}
