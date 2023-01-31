import { createStore } from "redux";
import IsFollowingModel from "../Models/IsFollowingModel";
import VacationModel from "../Models/VacationModel";

export class VacationsState {
    public vacations: VacationModel[] = [];
    public showOnlyFollowed: boolean = false;
}

export enum VacationActionType {
    FetchVacations = "FetchVacations",
    AddVacation = "AddVacation",
    EditVacation = "EditVacation",
    DeleteVacation = "DeleteVacation",
    FollowVacations = "FollowVacations",
    UnfollowVacations = "UnfollowVacations",
    ClearVacations = "ClearVacations",
    ChangeShowOnlyFollowed = "ChangeShowOnlyFollowed"
}

export interface VacationAction {
    type: VacationActionType;
    payload?: any;
}

export function vacationReducer(currentState = new VacationsState(), action: VacationAction): VacationsState {
    const newState = { ...currentState }

    switch (action.type) {
        case VacationActionType.FetchVacations:
            newState.vacations = action.payload;
            break;

        case VacationActionType.AddVacation:
            newState.vacations.push(action.payload);
            newState.vacations.sort((vacation1, vacation2) => new Date(vacation2.startDate).getTime() - new Date(vacation1.startDate).getTime());
            break;

        case VacationActionType.EditVacation:
            const indexToUpdate = newState.vacations.findIndex(vacation => vacation.vacationId === action.payload.vacationId);
            if (indexToUpdate >= 0) {
                newState.vacations[indexToUpdate] = action.payload;
                newState.vacations.sort((vacation1, vacation2) => new Date(vacation2.startDate).getTime() - new Date(vacation1.startDate).getTime());
            }
            break;

        case VacationActionType.DeleteVacation:
            const indexToDelete = newState.vacations.findIndex(vacation => vacation.vacationId === action.payload);
            if (indexToDelete >= 0) newState.vacations.splice(indexToDelete, 1);
            break;

        case VacationActionType.FollowVacations:
            const indexToFollow = newState.vacations.findIndex(vacation => vacation.vacationId === action.payload);
            if (indexToFollow >= 0) {
                newState.vacations[indexToFollow].isFollowing = IsFollowingModel.Following;
                newState.vacations[indexToFollow].followersCount += 1;
            }
            break;

        case VacationActionType.UnfollowVacations:
            const indexToUnfollow = newState.vacations.findIndex(vacation => vacation.vacationId === action.payload);
            if (indexToUnfollow >= 0) {
                newState.vacations[indexToUnfollow].isFollowing = IsFollowingModel.NotFollowing;
                newState.vacations[indexToUnfollow].followersCount -= 1;
            }
            break;

        case VacationActionType.ClearVacations:
            newState.vacations = [];
            newState.showOnlyFollowed = false;
            break;

        case VacationActionType.ChangeShowOnlyFollowed:
            newState.showOnlyFollowed = action.payload;
            break;
    }

    return newState;
}

export const vacationsStore = createStore(vacationReducer);