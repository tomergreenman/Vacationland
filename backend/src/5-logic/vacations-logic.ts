import dal from "../2-utils/dal"
import { followerDosNotExistErrorModel, ResourceNotFoundErrorModel, ValidationErrorModel } from "../4-models/error-models";
import { v4 as uuid } from "uuid"
import fs from "fs";
import VacationModel from "../4-models/vacations-model"
import { OkPacket } from "mysql";
import FollowersModel from "../4-models/followers.model";
import appConfig from "../2-utils/app-config";
import s3Bucket from "../2-utils/s3Bucket";


async function getAllVacations(): Promise<VacationModel[]> {
    const sql = 'SELECT * FROM vacations ORDER BY startDate DESC'
    const vacations = await dal.execute(sql)
    return vacations;
}

async function getVacationsForUser(userId: number): Promise<VacationModel[]> {

    const sql = `SELECT DISTINCT V.vacationId, V.description, V.destination, V.imageName,
            DATE_FORMAT(V.startDate, '%Y-%m-%d') AS startDate ,DATE_FORMAT(V.endDate, '%Y-%m-%d') AS endDate, V.price, 
            EXISTS(SELECT * FROM followers WHERE vacationId = F.vacationId AND userId = ?) AS isFollowing,
            COUNT(F.userId) AS followersCount
            FROM vacations AS V LEFT JOIN followers AS F
            ON V.vacationId = F.vacationId
            GROUP BY vacationId
            ORDER BY V.startDate DESC`;

    const vacations = await dal.execute(sql, [userId]);
    return vacations;

}

// Activity will give information to what was trying to be done when failed (get/update/delete vacation)
async function getOneVacation(vacationId: number, activity = "Getting one vacation"): Promise<VacationModel> {
    const sql = `SELECT V.vacationId, V.description, V.destination, V.imageName,
            DATE_FORMAT(V.startDate, '%Y-%m-%d') AS startDate ,DATE_FORMAT(V.endDate, '%Y-%m-%d') AS endDate, V.price
            FROM vacations AS V
            WHERE vacationId = ?`
    const vacations = await dal.execute(sql, [vacationId])
    if (vacations.length === 0) throw new ResourceNotFoundErrorModel(vacationId, activity);
    const vacation = vacations[0];
    return vacation;
}

async function addOneVacation(vacation: VacationModel): Promise<VacationModel> {
    const errorMessage = vacation.addValidate();
    if (errorMessage) throw new ValidationErrorModel(errorMessage);

    const extension = vacation.image.name.substring(vacation.image.name.lastIndexOf("."));
    vacation.imageName = uuid() + extension;

    // If in DEVELOPMENT upload image to assets / If in PRODUCTION upload image to s3Bucket
    if (appConfig.isDevelopment) await vacation.image.mv("./src/1-assets/images/" + vacation.imageName);

    else await s3Bucket.uploadImage(vacation.image, vacation.imageName)

    delete vacation.image; // Delete image before uploading to database

    const sql = `INSERT INTO vacations VALUES(DEFAULT, ?, ?, ?, ?, ?, ?)`;
    const info: OkPacket = await dal.execute(sql, [
        vacation.description,
        vacation.destination,
        vacation.imageName,
        vacation.startDate,
        vacation.endDate,
        vacation.price,
    ]);
    vacation.vacationId = info.insertId;
    return vacation;
}

async function editVacation(vacation: VacationModel): Promise<VacationModel> {
    const errorMessage = vacation.editValidate();
    if (errorMessage) throw new ValidationErrorModel(errorMessage);

    const prevVacation = await getOneVacation(vacation.vacationId, "Editing Vacation");

    // Upload new image and delete old one only if an image was sent
    if (vacation.image) {

        const extension = vacation.image.name.substring(vacation.image.name.lastIndexOf("."));
        vacation.imageName = uuid() + extension;

        if (appConfig.isDevelopment) {

            if (fs.existsSync("./src/1-assets/images/" + prevVacation.imageName)) {
                fs.unlinkSync("./src/1-assets/images/" + prevVacation.imageName);
                await vacation.image.mv("./src/1-assets/images/" + vacation.imageName);
            }
        }

        else {
            await s3Bucket.deleteImage(prevVacation.imageName);
            await s3Bucket.uploadImage(vacation.image, vacation.imageName)
        }


        // Delete image before uploading to database
        delete vacation.image;

    }

    // If no image was sent, keep the old image name
    else vacation.imageName = prevVacation.imageName;

    const sql = `UPDATE vacations SET
        description = ?,
        destination = ?,
        imageName = ?,
        startDate =?,
        endDate = ?,
        price = ?
        WHERE vacationId = ?`;

    await dal.execute(sql, [
        vacation.description,
        vacation.destination,
        vacation.imageName,
        vacation.startDate,
        vacation.endDate,
        vacation.price,
        vacation.vacationId]);

    return vacation;

}

async function deleteVacation(vacationId: number): Promise<void> {
    const prevVacation = await getOneVacation(vacationId, "Deleting vacation");

    if (appConfig.isDevelopment) {

        if (fs.existsSync("./src/1-assets/images/" + prevVacation.imageName)) {
            fs.unlinkSync("./src/1-assets/images/" + prevVacation.imageName);
        }
    }

    else await s3Bucket.deleteImage(prevVacation.imageName);

    const sql = `DELETE FROM vacations WHERE vacationId = ?`;

    await dal.execute(sql, [vacationId]);
}

async function addFollowToFollowers(follower: FollowersModel): Promise<FollowersModel> {

    await getOneVacation(follower.vacationId, "User Following"); // Will throw error if vacation doesn't exist 

    const sql = ` INSERT INTO followers VALUES(?, ?)`
    await dal.execute(sql, [
        follower.userId,
        follower.vacationId]);

    return follower;

}
async function DeleteFollowToFollowers(follower: FollowersModel): Promise<void> {

    await getOneVacation(follower.vacationId, "User Unfollowing"); // Will throw error if vacation doesn't exist 


    const sql = ` DELETE FROM followers WHERE userId = ? AND vacationId = ?`

    const info: OkPacket = await dal.execute(sql, [
        follower.userId,
        follower.vacationId
    ]);

    if (info.affectedRows === 0) throw new followerDosNotExistErrorModel(follower.userId, follower.vacationId);

}

export default {
    getAllVacations,
    getOneVacation,
    addOneVacation,
    editVacation,
    deleteVacation,
    addFollowToFollowers,
    DeleteFollowToFollowers,
    getVacationsForUser
}

