import { createStore } from "redux";

export class PaginationState {
    public page = 1;
    public postPerPage = 10;
    public last = this.page * this.postPerPage;
    public first = this.last - this.postPerPage;
}

export enum PaginationActionType {
    ChangePage = "ChangePage",
    ResetPagination = "ResetPagination"
}

export interface PaginationAction {
    type: PaginationActionType;
    payload?: number;
}

export function paginationReducer(currentState = new PaginationState(), action: PaginationAction): PaginationState {

    const newState = { ...currentState }

    switch (action.type) {
        case PaginationActionType.ChangePage:
            newState.page = action.payload; // payload is page number
            newState.last = action.payload * newState.postPerPage;
            newState.first = newState.last - newState.postPerPage;
            break;

        case PaginationActionType.ResetPagination:
            newState.page = 1;
            newState.last = newState.page * newState.postPerPage;
            newState.first = newState.last - newState.postPerPage;
            break;
    }
    
    return newState;

}

export const paginationStore = createStore(paginationReducer);
