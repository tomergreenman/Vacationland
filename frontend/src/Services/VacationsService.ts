import axios from "axios";
import VacationModel from "../Models/VacationModel";
import { VacationActionType, vacationsStore } from "../Redux/VacationsState";
import appConfig from "../Utils/Config";

class VacationService {

    async getVacationsForUser(userId: number): Promise<VacationModel[]> {

        let vacations = vacationsStore.getState().vacations;

        if (vacations.length === 0) {
            const response = await axios.get<VacationModel[]>(appConfig.vacationsForUserUrl + userId);
            vacations = response.data;
            vacationsStore.dispatch({ type: VacationActionType.FetchVacations, payload: vacations });
        }

        return vacations;

    }

    async getLatestVacationsFollowingDataForAdmin(userId: number): Promise<VacationModel[]> {

        const response = await axios.get<VacationModel[]>(appConfig.vacationsForUserUrl + userId);
        const vacations = response.data;
        return vacations;
    }

    async getOneVacation(vacationId: number): Promise<VacationModel> {

        const vacations = vacationsStore.getState().vacations;
        let vacation = vacations.find(vacation => vacation.vacationId === vacationId);
        if (!vacation) {
            const response = await axios.get<VacationModel>(appConfig.vacationsUrl + vacationId);
            vacation = response.data;
        }

        return vacation;

    }

    async addVacation(vacation: VacationModel): Promise<void> {

        const myFormData = new FormData();
        myFormData.append("description", vacation.description);
        myFormData.append("destination", vacation.destination);
        myFormData.append("startDate", vacation.startDate);
        myFormData.append("endDate", vacation.endDate);
        myFormData.append("price", vacation.price.toString());
        myFormData.append("image", vacation.image[0]);

        const response = await axios.post<VacationModel>(appConfig.vacationsUrl, myFormData);
        const addedVacation = response.data;
        addedVacation.followersCount = 0;

        vacationsStore.dispatch({ type: VacationActionType.AddVacation, payload: addedVacation })
    }

    async editVacation(vacation: VacationModel): Promise<void> {

        const myFormData = new FormData();
        myFormData.append("description", vacation.description);
        myFormData.append("destination", vacation.destination);
        myFormData.append("startDate", vacation.startDate);
        myFormData.append("endDate", vacation.endDate);
        myFormData.append("price", vacation.price.toString());
        myFormData.append("image", vacation.image[0]);

        const response = await axios.put<VacationModel>(appConfig.vacationsUrl + vacation.vacationId, myFormData);
        const editedVacation = response.data;

        vacationsStore.dispatch({ type: VacationActionType.EditVacation, payload: editedVacation });
    }

    async deleteVacation(vacationId: number): Promise<void> {
        await axios.delete<void>(appConfig.vacationsUrl + vacationId);
        vacationsStore.dispatch({ type: VacationActionType.DeleteVacation, payload: vacationId });
    }

    //Only for production
    async getVacationImageUrl(imageName: string): Promise<string> {
        const response = await axios.get(appConfig.vacationImageUrl + imageName);
        const imageUrl = response.data;
        return imageUrl;
    }

    async addFollowToFollowers(vacationId: number): Promise<void> {
        await axios.post(appConfig.followersUrl + vacationId);
        vacationsStore.dispatch({ type: VacationActionType.FollowVacations, payload: vacationId });
    }

    async unFollowToFollowers(vacationId: number): Promise<void> {
        await axios.delete<void>(appConfig.followersUrl + vacationId);
        vacationsStore.dispatch({ type: VacationActionType.UnfollowVacations, payload: vacationId });

    }

    clearVacationsState() {
        vacationsStore.dispatch({ type: VacationActionType.ClearVacations });
    }

    changeShowOnlyFollowed(state: boolean) {
        vacationsStore.dispatch({ type: VacationActionType.ChangeShowOnlyFollowed, payload: state });
    }

}

const vacationService = new VacationService();

export default vacationService;