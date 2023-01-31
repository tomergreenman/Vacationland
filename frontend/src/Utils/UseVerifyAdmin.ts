import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../Services/AuthService";
import notifyService from "../Services/NotifyService";
import useVerifyLoggedIn from "./UseVerifyLoggedIn";


function useVerifyAdmin() {

    const navigate = useNavigate();
   
    useEffect(() => {
        if(!authService.isLoggedIn()){
            notifyService.error("You are not not Logged in!");
            navigate("/login");
            return;
        }

        if (!authService.isAdmin()) {      
            notifyService.error("You are not Admin!");
            navigate("/home");
        }

    }, []);
}

export default useVerifyAdmin;