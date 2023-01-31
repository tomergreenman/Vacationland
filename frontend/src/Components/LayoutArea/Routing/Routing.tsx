import { Navigate, Route, Routes } from "react-router-dom";
import Login from "../../AuthArea/Login/Login";
import Register from "../../AuthArea/Register/Register";
import Insert from "../../VacationsArea/Insert/Insert";
import List from "../../VacationsArea/List/List";
import Home from "../../HomeArea/Home/Home";
import PageNotFound from "../PageNotFound/PageNotFound";
import "./Routing.css";
import Edit from "../../VacationsArea/Edit/Edit";
import Statistics from "../../VacationsArea/Statistics/Statistics";

function Routing(): JSX.Element {
    return (
        <div className="Routing">
			<Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/list" element={<List />} />
                <Route path="/insert" element={<Insert />} />
                <Route path="/statistics" element={<Statistics />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/edit/:vacationId" element={<Edit />} />
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="*" element={<PageNotFound />} />
            </Routes>
        </div>
    );
}

export default Routing;
