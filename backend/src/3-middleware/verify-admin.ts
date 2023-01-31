import { NextFunction, Request, Response } from "express";
import cyber from "../2-utils/cyber";
import { UnauthorizedErrorModel } from "../4-models/error-models";

async function verifyAdmin(request: Request, response: Response, next: NextFunction) {

    try {
        const isAdmin = await cyber.verifyAdmin(request);
        if (!isAdmin) throw new UnauthorizedErrorModel("You are not admin");
        next();
    }
    catch (err: any) {
        next(err);
    }

}

export default verifyAdmin;
