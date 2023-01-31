import { ChangeEvent, useEffect, useState } from "react";
import UserModel from "../../../Models/UserModel";
import VacationModel from "../../../Models/VacationModel";
import vacationService from "../../../Services/VacationsService";
import appConfig from "../../../Utils/Config";
import "./VacationCard.css";
import { NavLink } from "react-router-dom";
import notifyService from "../../../Services/NotifyService";
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import RoleModel from "../../../Models/RoleModel";
import { Tooltip } from "@mui/material";
import IsFollowingModel from "../../../Models/IsFollowingModel";


interface VacationCardProps {
    vacation: VacationModel;
    user: UserModel;

}

function VacationCard(props: VacationCardProps): JSX.Element {

    const [readMore, setReadMore] = useState<string>(" ... read more");
    const [readMoreState, setReadMoreState] = useState<boolean>(true);

    const [productionImageURl, setProductionImageUrl] = useState<string>()

    useEffect(() => {

        if (process.env.NODE_ENV === "production") {

            vacationService.getVacationImageUrl(props.vacation.imageName)
                .then(imageUrl => setProductionImageUrl(imageUrl))
                .catch(err => notifyService.error(err))
        }

    }, [])

    async function followHandler(args: ChangeEvent<HTMLInputElement>, vacationId: number) {
        try {
            const checked = args.target.checked;

            if (checked === true) {
                await vacationService.addFollowToFollowers(vacationId);
                return;
            }

            await vacationService.unFollowToFollowers(vacationId);

        }
        catch (err: any) {
            notifyService.error(err);

        }
    }

    async function deleteVacation(vacationId: number) {
        try {
            const ok = window.confirm(`Are you sure you want to delete this vacation?`);
            if (!ok) return;
            await vacationService.deleteVacation(vacationId);

        }
        catch (err: any) {
            notifyService.error(err);
        }

    }

    function readMoreHandler() {
        if (readMoreState) {
            setReadMoreState(false);
            setReadMore(" read less");
        }
        else {
            setReadMoreState(true);
            setReadMore(" ... read more");
        }

    }

    return (

        <div className="VacationCard">

            <div className="CardHeader">

                <h2>{props.vacation.destination}</h2>
                {props.user?.roleId === RoleModel.Admin &&  //admin
                    <div className="EditAndErase">
                        <Tooltip title="Edit" placement="left-start">
                            <NavLink to={"/edit/" + props.vacation.vacationId}><EditIcon /></NavLink>
                        </Tooltip>
                        <br></br>
                        <Tooltip title="Delete" placement="left-start">
                            <button onClick={() => deleteVacation(props.vacation.vacationId)}><DeleteForeverIcon /></button>
                        </Tooltip>
                    </div>
                }
                {props.user?.roleId === RoleModel.User &&  //user
                    <>
                        <label className="FollowersLabel">
                            {props.vacation.isFollowing === IsFollowingModel.NotFollowing ? <ThumbUpOutlinedIcon fontSize="medium" className="FollowIcon" /> : <ThumbUpIcon color="primary" className="FollowIcon" />}

                            <input onChange={args => followHandler(args, props.vacation.vacationId)}
                                type={"checkbox"} checked={props.vacation.isFollowing === IsFollowingModel.Following} />
                        </label>
                        <span className="FollowersCount">Following: {props.vacation.followersCount}</span>

                    </>
                }
                <hr></hr>
            </div>
            <div className="CardBody">
                <p className="Description">
                    {props.vacation.description.length > 120 ?
                        <>
                            {readMoreState &&
                                <>
                                    {props.vacation.description.substring(0, 120)}
                                    <span onClick={readMoreHandler} className="ReadMore">{readMore}</span>
                                </>}

                            {!readMoreState &&
                                <>
                                    {props.vacation.description}
                                    <span onClick={readMoreHandler} className="ReadMore">{readMore}</span>
                                </>}

                        </>
                        : props.vacation.description}</p>
                <span>Leaves: {new Date(props.vacation.startDate).toLocaleDateString()}</span>
                <span>Returns: {new Date(props.vacation.endDate).toLocaleDateString()}</span>
                <span>Price: ${props.vacation.price}.00</span>
            </div>
            <div className="CardImage">
                {props.vacation.imageName && <img src={process.env.NODE_ENV === "production" ? productionImageURl : appConfig.vacationImageUrl + props.vacation.imageName} />}
            </div> 

        </div>

    );
}

export default VacationCard;
