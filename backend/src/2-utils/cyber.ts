import UserModel from "../4-models/user-model";
import jwt from "jsonwebtoken";
import { Request } from "express";
import crypto from "crypto";
import { UnauthorizedErrorModel } from "../4-models/error-models";

const jwtSecretKey = "LordOfTheRings";

function getNewToken(user: UserModel): string {

    // Delete password before returning to frontend!
    delete user.password;

    const container = { user };
    const options = { expiresIn: "24h" }; // Remove options //////////////
    const token = jwt.sign(container, jwtSecretKey, options); // Remove options ////////////////
    return token;

}

function verifyToken(request: Request): Promise<boolean> {

    return new Promise<boolean>((resolve, reject) => {
        try {
            const header = request.header("authorization");
            if (!header) {
                resolve(false);
                return;
            }

            // Extract token from header 
            const token = header.substring(7);
            if (!token) {
                resolve(false);
                return;
            }

            jwt.verify(token, jwtSecretKey, err => {
                if (err) {
                    resolve(false);
                    return;
                }

                resolve(true);
            });
        }

        catch (err: any) {
            reject(err);
        }
    });

}

async function verifyAdmin(request: Request): Promise<boolean> {

    // First check if user logged in:
    const isLoggedIn = await verifyToken(request);

    // If not logged in:
    if (!isLoggedIn) throw new UnauthorizedErrorModel("You are not logged in");

    // Extract token: 
    const header = request.header("authorization");
    const token = header.substring(7);

    // Extract container from token:
    const decodedToken: any = jwt.decode(token);

    // Extract user: 
    const user: UserModel = decodedToken.user;

    // Return true if user is admin, otherwise return false:
    return user.roleId === 2;
}



const salt = "JohPaulGeorgeRingo";

function hash(plainText: string): string {

    if (!plainText) return null;

    // Hash and add salt: 
    const hashedText = crypto.createHmac("sha512", salt).update(plainText).digest("hex");

    return hashedText;

}

export default {
    getNewToken,
    verifyToken,
    verifyAdmin,
    hash,
    jwtSecretKey
};
