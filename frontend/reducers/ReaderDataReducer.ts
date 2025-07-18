import { type DocRequestPageType } from '../src/hooks/useDocRequestsTable';
import type { DocumentPageType } from '../src/hooks/useDocumentsTableColumns';

export const enum ActionTypes {
    INIT = "INIT",
    CREATE_DOC_REQ = "CREATE_DOC_REQ",
    CREATE_DOC = "CREATE_DOC",
    SET_DOCUMENTS = "SET_DOCUMENTS",
    ADD_DOCUMENTS = "ADD_DOCUMENTS"
}

export interface ActionType {
    type: ActionTypes,
    payload: any,
}

interface ReaderState {
    docRequestPage: DocRequestPageType[],
    currentDocumentToShow: DocumentPageType[]
}

export const initialState: ReaderState = {
    docRequestPage: [],
    currentDocumentToShow: []
}


export default function ReaderReducer(state: typeof initialState, action: ActionType) {
    switch (action.type) {
        case (ActionTypes.INIT):
            return { ...state, ...action.payload }
        case (ActionTypes.CREATE_DOC_REQ):
            {
                const newDocRequest = action.payload;
                return { ...state, docRequestPage: [{ id: newDocRequest.id, name: newDocRequest.name, description: newDocRequest.description, totalDocuments: 0, totalSignedDocuments: 0, creationDate: Date.now() }, ...state.docRequestPage] }
            }
        case (ActionTypes.CREATE_DOC): {
            return { ...state }
        }

        case (ActionTypes.SET_DOCUMENTS): {
            return { ...state, currentDocumentToShow: [...action.payload] }
        }

        case (ActionTypes.ADD_DOCUMENTS): {
            return { ...state, currentDocumentToShow: [...action.payload, ...state.currentDocumentToShow] }
        }

        default:
            return state
    }
}