import { Box, Button, Grid, LinearProgress, TextField, Typography } from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import VacationModel from "../../../Models/VacationModel";
import notifyService from "../../../Services/NotifyService";
import useVerifyAdmin from "../../../Utils/UseVerifyAdmin";
import "./Insert.css";
import LibraryAddOutlinedIcon from '@mui/icons-material/LibraryAddOutlined';
import vacationService from "../../../Services/VacationsService";


function Insert(): JSX.Element {

    useVerifyAdmin();

    const { register, handleSubmit, formState, reset } = useForm<VacationModel>();
    const [dateLimit, setDateLimit] = useState<string>("");
    const [previewImage, setPreviewImage] = useState<any>();
    const [imageToSend, setImageToSend] = useState<any>(); // registering image from useForm does not work on ios systems(safari, iphone etc' )
    const [loaderClass, setLoaderClass] = useState<string>("Hidden"); // loader line to display when vacation is sent

    // states to handle file upload errors in from 
    // (needed because when formState of useForm recognizes no file was loaded before submit and displays error
    // it dos not recognize when file is finally uploaded and dose not remove error)
    const [imageError, setImageError] = useState<boolean>(true);
    const [submitted, setSubmitted] = useState<boolean>(false);

    useEffect(() => {

        const now = new Date();
        const year = now.getFullYear();
        let month = (now.getMonth() + 1).toString();
        month = month.padStart(2, "0");
        let day = now.getDate().toString();
        day = day.padStart(2, "0");
        const dateLimit = `${year}-${month}-${day}`;
        setDateLimit(dateLimit);

    }, []);

    async function photoPreview(args: ChangeEvent<HTMLInputElement>) {
        const file = args.target.files[0];

        if (args.target.value === "") setImageError(true); // if no file name(no file uploaded) set image error to true
        else setImageError(false);

        // if file, create url and display the image
        if (file) {
            setPreviewImage(URL.createObjectURL(file));
        }
        // in no file, delete previous chosen file display
        else setPreviewImage(null);

        setImageToSend(args.target.files); // will set the image to send to a files list containing one image or nothing;
    }

    async function send(vacation: VacationModel) {

        try {
            if (vacation.startDate > vacation.endDate) {
                notifyService.error("Return date must be later than departure date");
                return;
            }

            vacation.image = imageToSend;

            setLoaderClass("Visible");

            await vacationService.addVacation(vacation);

            setLoaderClass("Hidden");
            notifyService.success("Vacation successfully added");

            // clear and reset form
            reset();
            setPreviewImage(null);
            setImageError(true);
            setSubmitted(false);

        }
        catch (err: any) {
            notifyService.error(err);
            setLoaderClass("Hidden");
        }
    }

    return (
        <div className="Insert">

            <form onSubmit={handleSubmit(send)}>

                <Box className="FormContainer" sx={{ flexGrow: 1 }}>
                    <Grid container spacing={1} >

                        <Grid item xs={12}>
                            <Typography component="h1" variant="h5" textAlign="center">Add New Vacation</Typography>
                        </Grid>

                        <Grid item xs={6}>
                            <TextField className="FormField"
                                type="text"
                                label="Destination"
                                {...register("destination", VacationModel.destinationValidation)}
                                error={Boolean(formState.errors.destination)}
                                helperText={formState.errors.destination?.message}
                                margin="dense"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField className="FormField"
                                type="number"
                                label="price"
                                {...register("price", VacationModel.priceValidation)}
                                error={Boolean(formState.errors.price)}
                                helperText={formState.errors.price?.message}
                                margin="dense"
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
                                error={Boolean(formState.errors.startDate)}
                                helperText={formState.errors.startDate?.message}
                                margin="dense"
                                inputProps={{ min: dateLimit }}

                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField className="FormField"
                                type={"text"}
                                label="Description"
                                multiline={true}
                                rows={3}
                                margin="dense"
                                {...register("description", VacationModel.descriptionValidation)}
                                error={Boolean(formState.errors.description)}
                                helperText={formState.errors.description?.message}
                            />
                        </Grid>


                        <Grid item xs={12}>
                            <TextField className="FormField"
                                type="file"
                                label="Image"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                {...register("image", VacationModel.imageValidation)}
                                error={Boolean(imageError === true && submitted === true)}
                                helperText={(imageError === true && submitted === true) && "Add image"}
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

                <Grid item xs={12} className="ButtonContainer" >
                    <Button type="submit" onClick={() => { setSubmitted(true) }} variant="contained" color="success" startIcon={<LibraryAddOutlinedIcon />}>
                        Add Vacation
                    </Button>
                </Grid>

                <Grid item xs={12} >
                    <LinearProgress className={loaderClass} />
                </Grid>

            </form>

        </div >
    );
}

export default Insert;
