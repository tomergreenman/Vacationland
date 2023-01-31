import "./Statistics.css";
import CanvasJSReact from "../../../Assets/scripts/canvasjs.react";
import vacationService from "../../../Services/VacationsService";
import VacationModel from "../../../Models/VacationModel";
import { useEffect, useState } from "react";
import notifyService from "../../../Services/NotifyService";
import { authStore } from "../../../Redux/AuthState";
import sadDogSource from "../../../Assets/Images/sad-dog.jpg"
import useVerifyAdmin from "../../../Utils/UseVerifyAdmin";
import RoleModel from "../../../Models/RoleModel";

function Statistics(): JSX.Element {

    useVerifyAdmin();

    const CanvasJSChart = CanvasJSReact.CanvasJSChart;

    const [vacations, setVacations] = useState<VacationModel[]>([]);


    useEffect(() => {

        const user = authStore.getState().user

        // Block the useEffect incase not admin
        if (user?.roleId === RoleModel.Admin) {
            //Get the most updated vacations followers status
            vacationService.getLatestVacationsFollowingDataForAdmin(authStore.getState().user.userId)
                .then(vacations => {
                    //Sort Vacations by followers
                    vacations.sort((vacation1, vacation2) => vacation2.followersCount - vacation1.followersCount);
                    setVacations(vacations);
                })
                .catch(err => { notifyService.error(err) });
        }

    }, []);


    const followedVacations = vacations?.filter(vacation => vacation.followersCount > 0);
    const vacationsDataPoints: {}[] = [];
    for (const vacation of followedVacations) {
        vacationsDataPoints.push({ label: vacation.destination, y: vacation.followersCount, showInLegend: true });
    }


    const options = {
        title: {
            text: "Vacations Statistics",
        },
        subtitles: [
            {
                text: "Followers per vacation",
                fontSize: 20
            }
        ],
        axisX: {
            title: "Destination",
        },
        axisY: {
            title: "Followers",
            includeZero: true

        },
        backgroundColor: "transparent",
        data: [
            {
                type: "column",
                dataPoints: vacationsDataPoints
            }
        ]
    }

    return (
        <div className="Statistics">

            {
                vacations.length > 0 && followedVacations.length > 0 &&
                <CanvasJSChart options={options} />
            }

            {
                vacations.length > 0 && followedVacations.length === 0 &&
                <>
                    <h2>There are no vacations followed at the moment</h2>
                    <img src={sadDogSource} />
                </>
            }

        </div>
    );
}

export default Statistics;
