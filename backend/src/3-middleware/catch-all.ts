import { NextFunction, Request, Response } from "express";
import appConfig from "../2-utils/app-config";
// import logger from "../2-utils/logger";
import logger from "../2-utils/logger";

function catchAll(err: any, request: Request, response: Response, next: NextFunction) {

    console.log(err);

    const status = err.status || 500;

    if (status === 500) {
        let msg = "SERVER ERROR status: 500: ";
        if (err.stack) msg += err.stack;
        else msg += err.message;
        logger.serverErrorLogger.log("error", msg);
    }
    else logger.userErrorLogger.log("error", err);

    const message = appConfig.isDevelopment || status !== 500 ? err.message : "Some error occurred, please try again";
    response.status(status).send(message);
}

export default catchAll;

