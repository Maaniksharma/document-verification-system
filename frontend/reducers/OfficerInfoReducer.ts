
import type { AssignedDocRequestPageType } from '../src/hooks/useAssignedRequestsColumns';

export const enum ActionTypes {
    INIT = "INIT",
    SET_ASSIGNED_DOCREQUESTS = "SET_ASSIGNED_DOCREQUESTS",
    SET_CURRENT_DOC_REQUEST = "SET_CURRENT_DOC_REQUESTS",
    SET_DOCUMENTS = "SET_DOCUMENTS",
}

export interface ActionType {
    type: ActionTypes,
    payload: any,
}

interface OfficerState {
    assignedDocRequestPage: AssignedDocRequestPageType[],
}

export const initialState: OfficerState = {
    assignedDocRequestPage: [],
}


export default function OfficerReducer(state: typeof initialState, action: ActionType) {
    switch (action.type) {
        case (ActionTypes.INIT):
            return { ...state, ...action.payload }
        case (ActionTypes.SET_ASSIGNED_DOCREQUESTS):
            {
                const assignedDocRequests = action.payload;
                return { ...state, assignedDocRequestPage: [...assignedDocRequests] }
            }
        case (ActionTypes.SET_DOCUMENTS):
            {
                const documents = action.payload;
                console.log(documents);
                return { ...state, currentDocumentsToShow: [...documents] }
            }

        default:
            return state
    }
}