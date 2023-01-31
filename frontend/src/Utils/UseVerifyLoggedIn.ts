import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../Services/AuthService";
import notifyService from "../Services/NotifyService";


function useVerifyLoggedIn() {

    const navigate = useNavigate();

    useEffect(() => {
        if(!authService.isLoggedIn()) {
            notifyService.error("You are not logged in!");
            navigate("/login");
    
        }

    }, []);

}

export default useVerifyLoggedIn;