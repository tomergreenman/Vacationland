import "./PageNotFound.css";
import sadBabySource from "../../../Assets/Images/sad-baby.jpeg"
import cryingBabySource from "../../../Assets/Images/crying-baby.jpg"

import { NavLink } from "react-router-dom";

function PageNotFound(): JSX.Element {
    return (
        <div className="PageNotFound">
            <h2>The page you are looking for doesn't exist</h2>
            <img src={cryingBabySource} />
            <div>
                <NavLink to="/home">Back to home</NavLink>
            </div>

        </div>
    );
}

export default PageNotFound;
