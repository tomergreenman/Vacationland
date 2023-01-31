import { PaginationActionType, PaginationState, paginationStore } from "../Redux/PaginationState";


class PaginationService {

    public updatePagination(page: number): PaginationState {
        paginationStore.dispatch({ type: PaginationActionType.ChangePage, payload: page });
        return paginationStore.getState();
    }

    public resetPagination(): void {
        paginationStore.dispatch({ type: PaginationActionType.ResetPagination });
    }

}

const paginationService = new (PaginationService);

export default paginationService;