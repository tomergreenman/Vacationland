import { Avatar, Box, Button, Grid, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import CredentialsModel from "../../../Models/CredentialsModel";
import authService from "../../../Services/AuthService";
import notifyService from "../../../Services/NotifyService";
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import "./Login.css";
import { NavLink } from "react-router-dom";
import { authStore } from "../../../Redux/AuthState";

function Login(): JSX.Element {
    const { register, handleSubmit, formState } = useForm<CredentialsModel>();
    const navigate = useNavigate();

    async function login(credentials: CredentialsModel) {
        try {
            await authService.login(credentials);
            notifyService.success("Welcome back")
            navigate("/home")
        }
        catch (err: any) {
            notifyService.error(err);

        }
    }

    return (
        <div className="Login">

            {!authStore.getState().user &&

                <form onSubmit={handleSubmit(login)}>

                    <Box className="FormContainer" sx={{ flexGrow: 1 }}>
                        <Grid container spacing={1} >

                            <Grid item xs={12}>
                                <Typography component="h1" variant="h5" textAlign="center">Sign In</Typography>
                            </Grid>

                            <Grid item xs={12} className="AvatarContainer">
                                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                                    <LockOutlinedIcon />
                                </Avatar>
                            </Grid>

                            <Grid item xs={12}>
                                <TextField className="FormField"
                                    type="text"
                                    label="Username"
                                    {...register("username", CredentialsModel.usernameValidation)}
                                    error={Boolean(formState.errors.username)}
                                    helperText={formState.errors.username?.message}
                                    margin="dense"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField className="FormField"
                                    type="password"
                                    label="Password"
                                    {...register("password", CredentialsModel.passwordValidation)}
                                    error={Boolean(formState.errors.password)}
                                    helperText={formState.errors.password?.message}
                                    margin="dense"
                                />
                            </Grid>

                            <Grid item xs={12} md={12} className="ButtonContainer" >
                                <Button type="submit" variant="contained" color="primary" startIcon={<LoginOutlinedIcon />}>
                                    Login
                                </Button>
                            </Grid>

                            <Grid item xs={12}>
                                <NavLink to={"/register"} >
                                    {"Don't have an account? Sign Up"}
                                </NavLink>
                            </Grid>

                        </Grid>

                    </Box>

                </form>
            }

            {authStore.getState().user &&

            <div>

                <Typography variant="h6" >Yow are already logged in<br></br>
                If you wish you can logout and then login from a different account</Typography>

            </div>
            
            }

        </div>
    );
}

export default Login;
