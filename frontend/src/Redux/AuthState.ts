import jwtDecode from "jwt-decode";
import { createStore } from "redux";
import UserModel from "../Models/UserModel";
import paginationService from "../Services/PaginationService";
import vacationService from "../Services/VacationsService";

export class AuthState {
    public token: string = null;
    public user: UserModel = null;

    public constructor() {
        this.token = sessionStorage.getItem("token");
        if (this.token) {
            const jwtPayload = jwtDecode(this.token);
            this.user = (jwtPayload as any).user;

        }
    }
}
export enum AuthActionType {
    Register = "Register",
    Login = "Login",
    Logout = "Logout",
}

export interface AuthAction {
    type: AuthActionType;
    payload?: string;
}

export function authReducer(currentState = new AuthState(), action: AuthAction): AuthState {

    const newState = { ...currentState };

    switch (action.type) {
        case AuthActionType.Register:
        case AuthActionType.Login:
            newState.token = action.payload;
            const jwtPayload = jwtDecode(newState.token);
            const user = (jwtPayload as any).user;
            newState.user = user;
            sessionStorage.setItem("token", newState.token);
            paginationService.resetPagination();
            break;

        case AuthActionType.Logout:
            newState.token = null;
            newState.user = null;
            sessionStorage.removeItem("token");
            vacationService.clearVacationsState();
            paginationService.resetPagination();
            break;
    }

    return newState;
}

export const authStore = createStore(authReducer);
