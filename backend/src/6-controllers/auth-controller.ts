import express, { Request, Response, NextFunction } from "express";
import UserModel from "../4-models/user-model";
import CredentialsModel from "../4-models/credentials-model";
import authLogic from "../5-logic/auth-logic";
import logger from "../2-utils/logger";



const router = express.Router();

router.post("/auth/register", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const user = new UserModel(request.body);
        const token = await authLogic.register(user);
        response.status(201).json(token);
        logger.activityLogger.log("info", `${user.firstName} ${user.lastName} successfully registered to userId ${user.userId}`);

    }
    catch (err: any) {
        next(err);
    }
});


router.post("/auth/login", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const credentials = new CredentialsModel(request.body);
        const token = await authLogic.login(credentials);
        response.json(token);
        logger.activityLogger.log("info", `${credentials.username} successfully logged in`);

    }
    catch (err: any) {
        next(err);
    }
});

export default router;
