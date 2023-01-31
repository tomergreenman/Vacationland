import { Typography } from "@mui/material";
import useVerifyLoggedIn from "../../../Utils/UseVerifyLoggedIn";
import horsesSource from "../../../Assets/Images/horses.jpg"
import bledSource from "../../../Assets/Images/bled.jpg"
import canoeSource from "../../../Assets/Images/canoe.jpg"
import icelandLights from "../../../Assets/Images/iceland-lights.jpg"
import womenSource from "../../../Assets/Images/woman.jpg"
import flowerField from "../../../Assets/Images/flower-field.jpg"
import desertSource from "../../../Assets/Images/desert.jpg"
import dolomitesSource from "../../../Assets/Images/dolomites.jpg"
import "./Home.css";

function Home(): JSX.Element {
    useVerifyLoggedIn();

    return (
        <div className="Home">
            <Typography variant="h5" >Welcome to the place where all your dream vacations wishes can finally com true!</Typography>
            <Typography variant="body1">In Vacationland we guarantee the best prices on the market without compromising on your adventures. <br></br>
            We have vacations that suit all ages and all preferences.
            </Typography>

            <div className="ImagesContainer">
                <img src={horsesSource} />
                <img src={bledSource} />
                <img src={canoeSource} />
                <img src={icelandLights} />
                <img src={womenSource} />
                <img src={flowerField} />
                <img src={desertSource} />
                <img src={dolomitesSource} />
              
            </div>

        </div>
    );
}

export default Home;
