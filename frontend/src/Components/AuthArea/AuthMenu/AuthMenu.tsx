import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserModel from "../../../Models/UserModel";
import { authStore } from "../../../Redux/AuthState";
import authService from "../../../Services/AuthService";
import notifyService from "../../../Services/NotifyService";
import "./AuthMenu.css";
import { Typography } from "@mui/material";
import Button from '@mui/material/Button';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';

function AuthMenu(): JSX.Element {

    const [user, setUser] = useState<UserModel>();
    const navigate = useNavigate();

    useEffect(() => {
        const user = authStore.getState().user;
        setUser(user);
        const unsubscribe = authStore.subscribe(() => {
            const user = authStore.getState().user;
            setUser(user);
        });
        return unsubscribe
    }, []);

    function logout(){
        authService.logout();
        notifyService.success("Goodbye");
        navigate("/login");
    }

    return (
        <div className="AuthMenu">

            {user&& <>
                <Typography className="HelloMsg" textAlign="center" display="inline" >{`HELLO ${user.firstName.toUpperCase()} ${user.lastName.toUpperCase()}`}</Typography>
                <Button className="MuiButton" onClick={logout} variant="outlined" color="inherit"><LogoutOutlinedIcon className="LogoutIcon"/> Logout</Button>
            </>}

        </div>
    );
}

export default AuthMenu;
