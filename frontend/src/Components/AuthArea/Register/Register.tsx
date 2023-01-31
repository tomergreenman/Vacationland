import { Avatar, Box, Button, Grid, TextField, Tooltip, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import UserModel from "../../../Models/UserModel";
import authService from "../../../Services/AuthService";
import notifyService from "../../../Services/NotifyService";
import AppRegistrationOutlinedIcon from '@mui/icons-material/AppRegistrationOutlined';

import "./Register.css";
import { authStore } from "../../../Redux/AuthState";

function Register(): JSX.Element {

    const { register, handleSubmit, formState } = useForm<UserModel>();
    const navigate = useNavigate();

    async function registerAndLogin(user: UserModel) {
        try {
            await authService.register(user);
            notifyService.success("You successfully registered 🛫")
            navigate("/home")
        }
        catch (err: any) {
            notifyService.error(err);

        }
    }

    return (
        <div className="Register">

            {!authStore.getState().user &&

                <form onSubmit={handleSubmit(registerAndLogin)}>


                    <Box className="FormContainer" sx={{ flexGrow: 1 }}>
                        <Grid container spacing={1} >

                            <Grid item xs={12}>
                                <Typography component="h1" variant="h5" textAlign="center">Sign Up</Typography>
                            </Grid>

                            <Grid item xs={12} className="AvatarContainer">
                                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                                </Avatar>
                            </Grid>

                            <Grid item xs={12}>
                                <TextField className="FormField"
                                    type="text"
                                    label="First Name"
                                    {...register("firstName", UserModel.firstNmeValidation)}
                                    error={Boolean(formState.errors.firstName)}
                                    helperText={formState.errors.firstName?.message}
                                    margin="dense"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField className="FormField"
                                    type="text"
                                    label="Last Name"
                                    {...register("lastName", UserModel.lastNameValidation)}
                                    error={Boolean(formState.errors.lastName)}
                                    helperText={formState.errors.lastName?.message}
                                    margin="dense"
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField className="FormField"
                                    type="text"
                                    label="Username"
                                    {...register("username", UserModel.usernameValidation)}
                                    error={Boolean(formState.errors.username)}
                                    helperText={formState.errors.username?.message}
                                    margin="dense"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Tooltip title="6-20 characters, at least one letter and one number" placement="top-start">
                                    <TextField className="FormField"
                                        type="password"
                                        label="Password"
                                        {...register("password", UserModel.passwordValidation)}
                                        error={Boolean(formState.errors.password)}
                                        helperText={formState.errors.password?.message}
                                        margin="dense"
                                    />
                                </Tooltip>
                            </Grid>

                            <Grid item xs={12} md={12} className="ButtonContainer" >
                                <Button type="submit" variant="contained" color="primary" startIcon={<AppRegistrationOutlinedIcon />}>
                                    Sign Up
                                </Button>
                            </Grid>

                            <Grid item xs={12}>
                                <NavLink to={"/login"} >
                                    {"Already have an account? Sign In"}
                                </NavLink>
                            </Grid>

                        </Grid>

                    </Box>

                </form>

            }

            {authStore.getState().user &&

                <div>

                    <Typography variant="h6" >Yow are already logged in<br></br>
                        If you wish you can logout and then register a new account</Typography>

                </div>
                
            }

        </div>
    );
}

export default Register;
