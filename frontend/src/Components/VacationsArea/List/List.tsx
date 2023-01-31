import { ChangeEvent, useEffect, useState } from "react";
import UserModel from "../../../Models/UserModel";
import VacationModel from "../../../Models/VacationModel";
import { authStore } from "../../../Redux/AuthState";
import { vacationsStore } from "../../../Redux/VacationsState";
import notifyService from "../../../Services/NotifyService";
import vacationService from "../../../Services/VacationsService";
import useVerifyLoggedIn from "../../../Utils/UseVerifyLoggedIn";
import VacationCard from "../VacationCard/VacationCard";
import "./List.css";
import Pagination from '@mui/material/Pagination';
import { paginationStore } from "../../../Redux/PaginationState";
import paginationService from "../../../Services/PaginationService";
import { Grid, Typography } from "@mui/material";
import RoleModel from "../../../Models/RoleModel";
import IsFollowingModel from "../../../Models/IsFollowingModel";


function List(): JSX.Element {
    useVerifyLoggedIn();

    const [vacations, setVacations] = useState<VacationModel[]>([]);
    const [pageVacations, setPageVacations] = useState<VacationModel[]>([]);
    const [user, setUser] = useState<UserModel>();
    const [pagination, setPagination] = useState(paginationStore.getState());
    const [vacationsHaveBeenSet, SetVacationsHaveBeenSet] = useState<boolean>(false); // to avoid short annoying displays when user refreshes page

    useEffect(() => {

        const user = authStore.getState().user;
        setUser(user);

        if (user) {
            vacationService.getVacationsForUser(user.userId)
                .then(vacations => {
                    setVacations(vacations);
                    setPageVacations(vacations.slice(pagination.first, pagination.last));
                    SetVacationsHaveBeenSet(true);
                })
                .catch(err => notifyService.error(err));
        }

        const unsubscribe = vacationsStore.subscribe(() => {

            let vacations = [...vacationsStore.getState().vacations];

            if (vacationsStore.getState().showOnlyFollowed === true) {
                vacations = vacations.filter(vacation => vacation.isFollowing === IsFollowingModel.Following);
            }

            setVacations(vacations);
            let pagination = { ...paginationStore.getState() };
            const pageVacations = vacations.slice(pagination.first, pagination.last);

            if (pageVacations.length === 0) {
                const page = pagination.page - 1
                pagination = paginationService.updatePagination(page);
            }

            setPagination(pagination);

        });

        return (() => {

            if (user.roleId === RoleModel.User) {
                if (vacationsStore.getState().showOnlyFollowed === true) {
                    vacationService.changeShowOnlyFollowed(false);
                    paginationService.resetPagination();
                }
            }
            unsubscribe();
        });

    }, []);

    useEffect(() => {
        setPageVacations(vacations.slice(pagination.first, pagination.last));
    }, [pagination]);

    const paginationChangeHandler = (event: ChangeEvent<any>, page: number) => {

        const newPagination = paginationService.updatePagination(page);

        setPagination(newPagination);
        document.documentElement.scrollTop = 0;

    };

    function displayOnlyFollowedVacations() {
        const followedVacations = vacations.filter(vacation => vacation.isFollowing === IsFollowingModel.Following);
        setVacations(followedVacations);
        vacationService.changeShowOnlyFollowed(true);
    }

    function displayAllVacations() {
        setVacations(vacationsStore.getState().vacations)
        vacationService.changeShowOnlyFollowed(false);
    }

    function filterChangeHandler(args: ChangeEvent<HTMLSelectElement>) {
        const value = args.target.value;

        const newPagination = paginationService.updatePagination(1); // reset pagination to page 1
        setPagination(newPagination);

        if (value === "All Vacations") {
            displayAllVacations();
            return;
        }

        displayOnlyFollowedVacations();
    }

    return (
        <div className="List">
            <Typography variant="h4">Our Vacations</Typography>

            {user?.roleId === RoleModel.User && <>
                <select onChange={filterChangeHandler}>
                    <option>All Vacations</option>
                    <option>Followed Vacations</option>
                </select>

                {vacationsStore.getState().showOnlyFollowed && vacations.length === 0 &&
                    <p>You Are Not Following any Vacations</p>}

            </>}

            {vacationsHaveBeenSet && !vacationsStore.getState().showOnlyFollowed && vacations.length === 0 &&
                <p>There are no vacations at the moment</p>}


            {vacationsHaveBeenSet && vacations.length > 0 &&
                <Pagination page={pagination.page} className="Pagination" count={Math.ceil(vacations.length / pagination.postPerPage)} color="primary" size="large" onChange={paginationChangeHandler} />
            }

            <Grid container className="GridContainer">
                <div className="CardsContainer">

                    {pageVacations.map(vacation =>
                        <VacationCard key={vacation.vacationId} vacation={vacation} user={user} />)}
                </ div>
            </Grid>
            {vacationsHaveBeenSet && vacations.length > 10 &&
                <Pagination page={pagination.page} className="Pagination" count={Math.ceil(vacations.length / pagination.postPerPage)} color="primary" size="large" onChange={paginationChangeHandler} />
            }

        </div>
    );
}

export default List;
