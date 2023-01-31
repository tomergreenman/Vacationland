import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import Layout from './Components/LayoutArea/Layout/Layout';
import './index.css';
import { authStore } from './Redux/AuthState';
import reportWebVitals from './reportWebVitals';
import interceptorsService from './Services/InterceptorsService';
import notifyService from './Services/NotifyService';
import vacationService from './Services/VacationsService';


interceptorsService.createInterceptors();

// Get vacations in case admin refreshes page
if (authStore.getState().user) {

    //creating async function and calling it strait away
    const getVacations = async () => {
        try {

            await vacationService.getVacationsForUser(authStore.getState().user.userId);
        }

        catch (err: any) {

            notifyService.error(err)
        }
    }

    getVacations();
}

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
    <BrowserRouter>
        <Layout />
    </BrowserRouter>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
