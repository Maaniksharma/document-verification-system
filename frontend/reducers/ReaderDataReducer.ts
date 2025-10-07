import { type DocRequestPageType } from '../src/hooks/useDocRequestsTable';
import type { DocumentPageType } from '../src/hooks/useDocumentsTableColumns';

export const enum ActionTypes {
    INIT = "INIT",
    CREATE_DOC_REQ = "CREATE_DOC_REQ",
    CREATE_DOC = "CREATE_DOC",
    SET_DOCUMENTS = "SET_DOCUMENTS",
    ADD_DOCUMENTS = "ADD_DOCUMENTS",
    ASSIGN_OFFICER = "ASSIGN_OFFICER"
}

export interface ActionType {
    type: ActionTypes,
    payload: any,
}

interface ReaderState {
    docRequestPage: DocRequestPageType[],
    currentDocumentsToShow: DocumentPageType[]
}

export const initialState: ReaderState = {
    docRequestPage: [],
    currentDocumentsToShow: []
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
            return { ...state, currentDocumentsToShow: [...action.payload] }
        }

        case (ActionTypes.ADD_DOCUMENTS): {
            return { ...state, currentDocumentsToShow: [{ id: action.payload.id, name: action.payload.name, status: "draft", creationDate: Date.now() }, ...state.currentDocumentsToShow] }
        }

        case ActionTypes.ASSIGN_OFFICER: {
            const { email, id } = action.payload;
            const newCurrentDocumentsToShow = state.currentDocumentsToShow.map((doc) => {
                if (doc.id === id) {
                    return { ...doc, status: "signature-pending", assignedOfficer: email };
                }
                return doc;
            });
            console.log(newCurrentDocumentsToShow);

            return { ...state, currentDocumentsToShow: [...newCurrentDocumentsToShow] };
        }


        default:
            return state
    }
}