import { type CourtPageType } from '../src/hooks/useCourtTableColumns';
export const enum ActionTypes {
    INIT = "INIT",
    CHANGE_COURT = "CHANGE_COURT",
    CREATE_COURT = "CREATE_COURT",
    CREATE_MEMBER = "CREATE_MEMBER"
}

export interface ActionType {
    type: ActionTypes,
    payload: any,
}

interface AdminState {
    courtPage: CourtPageType[];
    currentPage: number;
    stats: {
        totalCourts: number;
        totalReaders: number;
        totalOfficers: number;
        totalSignatures: number;
    };
    currentCourtToShow: {}; // or CourtPage if you always populate it fully
}

export const initialState: AdminState = {
    courtPage: [],
    currentPage: 1,
    stats: {
        totalCourts: 0,
        totalReaders: 0,
        totalOfficers: 0,
        totalSignatures: 0
    },
    currentCourtToShow: {},
}


export default function AdminDataReducer(state: typeof initialState, action: ActionType) {
    switch (action.type) {
        case (ActionTypes.INIT):
            return { ...state, ...action.payload }
        case (ActionTypes.CHANGE_COURT):
            return initialState
        case (ActionTypes.CREATE_COURT):
            {
                const newCourt = action.payload;
                return { ...state, courtPage: [{ id: newCourt.id, name: newCourt.name, description: newCourt.description, totalReaders: 0, totalOfficers: 0, documentsSigned: 0 }, ...state.courtPage] }
            }
        case (ActionTypes.CREATE_MEMBER): {
            const { courtId, role } = action.payload;

            const newCourtPage = state.courtPage.map(courtData => {
                if (courtId == courtData.id) {
                    if (role == "reader")
                        return {
                            ...courtData, totalReaders: courtData.totalReaders + 1
                        }
                    if (role == "officer") {
                        return { ...courtData, totalOfficers: courtData.totalOfficers + 1 }
                    }
                }
                else {
                    return courtData
                }
            })
            return { ...state, courtPage: newCourtPage }
        }

        default:
            return state
    }
}