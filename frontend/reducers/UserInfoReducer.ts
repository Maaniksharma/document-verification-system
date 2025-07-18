export const enum ActionTypes {
    LOGIN = "LOGIN",
    LOGOUT = "LOGOUT"
}

export interface ActionType {
    type: ActionTypes,
    payload: any,
}
export interface UserInfoType {
    email: string,
    IsAuthenticated: boolean,
    role: "" | "reader" | "officer" | "admin",
    id?: string
}
export const initialState: UserInfoType = {
    email: "",
    IsAuthenticated: true,
    role: ""
}


export default function userInfoReducer(state: typeof initialState, action: ActionType) {
    switch (action.type) {
        case (ActionTypes.LOGIN):
            return { ...state, IsAuthenticated: true, ...action.payload }
        case (ActionTypes.LOGOUT):
            return initialState
        default:
            return state
    }
}