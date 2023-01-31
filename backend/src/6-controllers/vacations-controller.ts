import express, { Request, Response, NextFunction } from "express";
import path from "path";
import logger from "../2-utils/logger";
import blockNonLoggedIn from "../3-middleware/block-non-logged-in";
import verifyAdmin from "../3-middleware/verify-admin";
import VacationModel from "../4-models/vacations-model";
import vacationsLogic from "../5-logic/vacations-logic";
import jwt from "jsonwebtoken";
import UserModel from "../4-models/user-model";
import FollowersModel from "../4-models/followers.model";
import appConfig from "../2-utils/app-config";
import s3Bucket from "../2-utils/s3Bucket";

const router = express.Router();

router.get("/vacations", async (request: Request, response: Response, next: NextFunction) => {
    try {

        const vacations = await vacationsLogic.getAllVacations();
        response.json(vacations);
    }
    catch (err: any) {
        next(err);
    }
});

router.get("/vacations/:vacationId([0-9]+)", [blockNonLoggedIn], async (request: Request, response: Response, next: NextFunction) => {
    try {

        const id = +request.params.vacationId;
        const vacation = await vacationsLogic.getOneVacation(id);
        response.json(vacation);
    }

    catch (err: any) {
        next(err);
    }
});

router.get("/vacations/for-user/:userId([0-9]+)", async (request: Request, response: Response, next: NextFunction) => {
    try {

        const userId = +request.params.userId;
        const vacations = await vacationsLogic.getVacationsForUser(userId);
        response.json(vacations);
    }

    catch (err: any) {
        next(err);
    }
});

router.post("/vacations", [verifyAdmin], async (request: Request, response: Response, next: NextFunction) => {
    try {

        request.body.image = request.files?.image;
        const vacation = new VacationModel(request.body);
        const addedVacation = await vacationsLogic.addOneVacation(vacation);
        response.status(201).json(addedVacation);

    }

    catch (err: any) {
        next(err);
    }
});

router.put("/vacations/:vacationId([0-9]+)", [verifyAdmin], async (request: Request, response: Response, next: NextFunction) => {
    try {

        const vacationId = +request.params.vacationId;
        request.body.vacationId = vacationId;
        request.body.image = request.files?.image;
        const vacation = new VacationModel(request.body);
        const editedVacation = await vacationsLogic.editVacation(vacation);
        response.status(201).json(editedVacation);
        logger.activityLogger.log("info", `Admin successfully edited vacation ${editedVacation.vacationId}`)

    }

    catch (err: any) {
        next(err);
    }
});

router.delete("/vacations/:vacationId([0-9]+)", [verifyAdmin], async (request: Request, response: Response, next: NextFunction) => {
    try {

        const vacationId = +request.params.vacationId;
        await vacationsLogic.deleteVacation(vacationId);
        response.sendStatus(204);
        logger.activityLogger.log("info", `Admin successfully deleted vacation ${vacationId}`)

    }

    catch (err: any) {
        next(err);
    }
});

//Add follow
router.post("/followers/:vacationId([0-9]+)", [blockNonLoggedIn], async (request: Request, response: Response, next: NextFunction) => {
    try {

        // Get user id from the token he sends (in this way we eliminate the option for hackers to easily add follows to different users via postman)
        const token = request.header("authorization").substring(7)
        const decodedToken: any = jwt.decode(token);
        const user: UserModel = decodedToken.user;
        const userId = user.userId;

        const vacationId = +request.params.vacationId;
        const follower = new FollowersModel({ userId, vacationId })
        await vacationsLogic.addFollowToFollowers(follower);
        response.status(201).json(follower);
        logger.activityLogger.log("info", `userId ${userId} started following vacationId ${vacationId}`)

    }

    catch (err: any) {
        next(err);
    }
});

//Delete follow
router.delete("/followers/:vacationId([0-9]+)", [blockNonLoggedIn], async (request: Request, response: Response, next: NextFunction) => {
    try {

        // Get user id from the token he sends (in this way we eliminate the option for hackers to easily delete follows to different users via postman)
        const token = request.header("authorization").substring(7)
        const decodedToken: any = jwt.decode(token);
        const user: UserModel = decodedToken.user;
        const userId = user.userId;

        const vacationId = +request.params.vacationId;
        const follower = new FollowersModel({ userId, vacationId })
        await vacationsLogic.DeleteFollowToFollowers(follower);
        response.sendStatus(204);
        logger.activityLogger.log("info", `userId ${userId} stopt following vacationId ${vacationId}`)

    }

    catch (err: any) {
        next(err);
    }
});

//Get vacation image
router.get("/vacations-images/:imageName", async (request: Request, response: Response, next: NextFunction) => {
    try {

        const imageName = request.params.imageName;

        if (appConfig.isDevelopment) {
            const absolutePath = path.join(__dirname, "..", "1-assets", "images", imageName);
            response.sendFile(absolutePath);
        }

        else {
            const imageUrl = await s3Bucket.getImageUrl(imageName);
            response.send(imageUrl);
        }

    }
    catch (err: any) {
        next(err);
    }
});

export default router;
