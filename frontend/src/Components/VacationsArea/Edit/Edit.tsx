import { Box, Button, Grid, LinearProgress, TextField, Typography } from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import VacationModel from "../../../Models/VacationModel";
import notifyService from "../../../Services/NotifyService";
import vacationService from "../../../Services/VacationsService";
import appConfig from "../../../Utils/Config";
import useVerifyAdmin from "../../../Utils/UseVerifyAdmin";
import LibraryAddOutlinedIcon from '@mui/icons-material/LibraryAddOutlined';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import "./Edit.css";
import { authStore } from "../../../Redux/AuthState";
import RoleModel from "../../../Models/RoleModel";




function Edit(): JSX.Element {

    useVerifyAdmin();

    const { register, handleSubmit, formState, setValue } = useForm<VacationModel>();
    const params = useParams();
    const [previousImage, setPreviousImage] = useState<any>();
    const [previewImage, setPreviewImage] = useState<any>();
    const [dateLimit, setDateLimit] = useState<string>("");

    const [imageToSend, setImageToSend] = useState<FileList>(); // registering image from useForm dos not work on ios systems(safari, iphone etc' )
    const [loaderClass, setLoaderClass] = useState<string>("Hidden"); // loader line to display when vacation is sent

    const navigate = useNavigate();
    const [pastVacation, setPastVacation] = useState<boolean>(false); // check if vacation has already taken place
    const [disableForm, setDisableForm] = useState<boolean>(false);

    useEffect(() => {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const monthLimit = ("0" + month.toString()).slice(-2);
        let day = now.getDate();
        const day2 = ("0" + day.toString()).slice(-2);
        const date = `${year}-${monthLimit}-${day2}`;
        setDateLimit(date);
    }, [])


    useEffect(() => {

        const user = authStore.getState().user
        // Block the useEffect incase not admin
        if (user?.roleId === RoleModel.Admin) {

            const vacationId = +params.vacationId;
            vacationService.getOneVacation(vacationId)
                .then(vacation => {
                    setValue("vacationId", vacation.vacationId);
                    setValue("destination", vacation.destination);
                    setValue("description", vacation.description);
                    setValue("startDate", vacation.startDate);
                    setValue("endDate", vacation.endDate);
                    setValue("price", vacation.price);
                    setValue("followersCount", vacation.followersCount)

                    if (process.env.NODE_ENV === "production") {
                        vacationService.getVacationImageUrl(vacation.imageName)
                            .then(imageUrl => {
                                setPreviousImage(imageUrl);
                                setPreviewImage(imageUrl);
                            })
                            .catch(err => notifyService.error(err));
                    }
                    else {
                        setPreviousImage(appConfig.vacationImageUrl + vacation.imageName);
                        setPreviewImage(appConfig.vacationImageUrl + vacation.imageName);
                    }

                    // check that the vacations hasn't taken place and if so block editing options
                    // and activate past vacation section.
                    if (new Date(vacation.startDate).getTime() < new Date().getTime()) {
                        setPastVacation(true);
                        setDisableForm(true);
                    }
                })
                .catch(err => {
                    notifyService.error(err);
                    navigate("/list");
                });
        }

    }, []);


    function photoPreview(args: ChangeEvent<HTMLInputElement>) {

        const file = args.target.files[0];

        if (file) setPreviewImage(URL.createObjectURL(file));
        else setPreviewImage(previousImage);

        setImageToSend(args.target.files); // will set the image to send to a files list containing one image or nothing;

    }

    async function edit(vacation: VacationModel) {

        try {

            if (vacation.startDate > vacation.endDate) {
                notifyService.error("End date must be later than start date")
                return;
            }

            if (imageToSend) vacation.image = imageToSend;

            setLoaderClass("Visible");

            await vacationService.editVacation(vacation);

            setLoaderClass("Hidden");

            notifyService.success("Vacation successfully edited");
            navigate("/list");

        }
        catch (err: any) {
            notifyService.error(err);
            setLoaderClass("Hidden");

        }

    }

    // allow editing vacation if checkbox is ticked
    function pastVacationHandler(args: ChangeEvent<HTMLInputElement>) {
        const checked = args.target.checked;
        if (checked === true) setDisableForm(false);
        else setDisableForm(true);

    }

    return (
        <div className="Edit">

            {/* past vacation section */}
            {pastVacation && <>
                <Typography className="PastVacation" variant="h6">This vacations has already taken place so only the picture can be edited.<br></br>
                    if you wish to reuse and edit this vacation to a future date please tick this box.</Typography>
                <ArrowDownwardIcon className="PastVacation" />
                <input className="PastVacationCheckBox" type={"checkbox"} onChange={pastVacationHandler}></input>
            </>}

            <form onSubmit={handleSubmit(edit)}>

                <input type="hidden" {...register("vacationId")} />
                <input type="hidden" {...register("followersCount")} />  {/* in order to keep prevues number of followers count */}

                <Box className="FormContainer" sx={{ flexGrow: 1 }}>
                    <Grid container spacing={1} >

                        <Grid item xs={12}>
                            <Typography component="h1" variant="h5" textAlign="center">Edit Vacation</Typography>
                        </Grid>

                        <Grid item xs={6}>
                            <TextField className="FormField"
                                type="text"
                                label="Destination"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                {...register("destination", VacationModel.destinationValidation)}
                                error={Boolean(formState.errors.destination)}
                                helperText={formState.errors.destination?.message}
                                margin="dense"
                                disabled={disableForm}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField className="FormField"
                                type="number"
                                label="price"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                {...register("price", VacationModel.priceValidation)}
                                error={Boolean(formState.errors.price)}
                                helperText={formState.errors.price?.message}
                                margin="dense"
                                disabled={disableForm}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField className="FormField"
                                type="date"
                                label="Departure"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                {...register("startDate", VacationModel.startDateValidation)}
                                error={Boolean(formState.errors.startDate)}
                                helperText={formState.errors.startDate?.message}
                                margin="dense"
                                inputProps={{ min: dateLimit }}
                                disabled={disableForm}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField className="FormField"
                                type="date"
                                label="Return"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                {...register("endDate", VacationModel.endDateValidation)}
                                error={Boolean(formState.errors.endDate)}
                                helperText={formState.errors.endDate?.message}
                                margin="dense"
                                inputProps={{ min: dateLimit }}
                                disabled={disableForm}

                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField className="FormField"
                                type={"text"}
                                label="Description"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                multiline={true}
                                rows={3}
                                margin="dense"
                                {...register("description", VacationModel.descriptionValidation)}
                                error={Boolean(formState.errors.description)}
                                helperText={formState.errors.description?.message}
                                disabled={disableForm}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField className="FormField"
                                type="file"
                                label="Image"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                {...register("image")}
                                margin="dense"
                                inputProps={{ accept: "image/*" }}
                                onChange={photoPreview}
                            />
                        </Grid>

                        <Grid item xs={12} className="ImageContainer">
                            {previewImage && <img src={previewImage} />}
                        </Grid>
                    </Grid>
                </Box>

                <Grid item xs={12} md={12} className="ButtonContainer">
                    <Button type="submit" variant="contained" color="success" startIcon={<LibraryAddOutlinedIcon />}>
                        Edit Vacation
                    </Button>
                </Grid>

                <Grid item xs={12} >
                    <LinearProgress className={loaderClass} />
                </Grid>

            </form>

        </div>
    );
}

export default Edit;
