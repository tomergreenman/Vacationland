import axios from "axios";
import jwtDecode from "jwt-decode";
import CredentialsModel from "../Models/CredentialsModel";
import RoleModel from "../Models/RoleModel";
import UserModel from "../Models/UserModel";
import { AuthActionType, authStore } from "../Redux/AuthState";
import appConfig from "../Utils/Config";
import vacationService from "./VacationsService";

class AuthService {

    public async register(user: UserModel): Promise<void> {
        const response = await axios.post<string>(appConfig.registerUrl, user);   
        const token = response.data;

        //get user id and get vacations when logging in
        const jwtPayload = jwtDecode(token);
        const newUser: UserModel = (jwtPayload as any).user;
        await vacationService.getVacationsForUser(newUser.userId)
        authStore.dispatch({ type: AuthActionType.Register, payload: token });
    }

    public async login(credentials: CredentialsModel): Promise<void> {
        const response = await axios.post<string>(appConfig.loginUrl, credentials);
        const token = response.data;

        //get user id and get vacations when logging in
        const jwtPayload = jwtDecode(token);
        const user: UserModel = (jwtPayload as any).user;
        await vacationService.getVacationsForUser(user.userId)

        authStore.dispatch({ type: AuthActionType.Login, payload: token });
    }

    public logout(): void {
        authStore.dispatch({ type: AuthActionType.Logout });
    }

    public isLoggedIn(): boolean {
        return authStore.getState().token !== null;
    }

    public isAdmin(): boolean {
        if (this.isLoggedIn()) return authStore.getState().user.roleId === RoleModel.Admin;
        else return false;
    }

}

const authService = new AuthService();

export default authService;