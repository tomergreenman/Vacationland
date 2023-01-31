"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dal_1 = __importDefault(require("../2-utils/dal"));
const error_models_1 = require("../4-models/error-models");
const uuid_1 = require("uuid");
const fs_1 = __importDefault(require("fs"));
const app_config_1 = __importDefault(require("../2-utils/app-config"));
const s3Bucket_1 = __importDefault(require("../2-utils/s3Bucket"));
function getAllVacations() {
    return __awaiter(this, void 0, void 0, function* () {
        const sql = 'SELECT * FROM vacations ORDER BY startDate DESC';
        const vacations = yield dal_1.default.execute(sql);
        return vacations;
    });
}
function getVacationsForUser(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const sql = `SELECT DISTINCT V.vacationId, V.description, V.destination, V.imageName,
            DATE_FORMAT(V.startDate, '%Y-%m-%d') AS startDate ,DATE_FORMAT(V.endDate, '%Y-%m-%d') AS endDate, V.price, 
            EXISTS(SELECT * FROM followers WHERE vacationId = F.vacationId AND userId = ?) AS isFollowing,
            COUNT(F.userId) AS followersCount
            FROM vacations AS V LEFT JOIN followers AS F
            ON V.vacationId = F.vacationId
            GROUP BY vacationId
            ORDER BY V.startDate DESC`;
        const vacations = yield dal_1.default.execute(sql, [userId]);
        return vacations;
    });
}
// Activity will give information to what was trying to be done when failed (get/update/delete vacation)
function getOneVacation(vacationId, activity = "Getting one vacation") {
    return __awaiter(this, void 0, void 0, function* () {
        const sql = `SELECT V.vacationId, V.description, V.destination, V.imageName,
            DATE_FORMAT(V.startDate, '%Y-%m-%d') AS startDate ,DATE_FORMAT(V.endDate, '%Y-%m-%d') AS endDate, V.price
            FROM vacations AS V
            WHERE vacationId = ?`;
        const vacations = yield dal_1.default.execute(sql, [vacationId]);
        if (vacations.length === 0)
            throw new error_models_1.ResourceNotFoundErrorModel(vacationId, activity);
        const vacation = vacations[0];
        return vacation;
    });
}
function addOneVacation(vacation) {
    return __awaiter(this, void 0, void 0, function* () {
        const errorMessage = vacation.addValidate();
        if (errorMessage)
            throw new error_models_1.ValidationErrorModel(errorMessage);
        const extension = vacation.image.name.substring(vacation.image.name.lastIndexOf("."));
        vacation.imageName = (0, uuid_1.v4)() + extension;
        // If in DEVELOPMENT upload image to assets / If in PRODUCTION upload image to s3Bucket
        if (app_config_1.default.isDevelopment)
            yield vacation.image.mv("./src/1-assets/images/" + vacation.imageName);
        else
            yield s3Bucket_1.default.uploadImage(vacation.image, vacation.imageName);
        delete vacation.image; // Delete image before uploading to database
        const sql = `INSERT INTO vacations VALUES(DEFAULT, ?, ?, ?, ?, ?, ?)`;
        const info = yield dal_1.default.execute(sql, [
            vacation.description,
            vacation.destination,
            vacation.imageName,
            vacation.startDate,
            vacation.endDate,
            vacation.price,
        ]);
        vacation.vacationId = info.insertId;
        return vacation;
    });
}
function editVacation(vacation) {
    return __awaiter(this, void 0, void 0, function* () {
        const errorMessage = vacation.editValidate();
        if (errorMessage)
            throw new error_models_1.ValidationErrorModel(errorMessage);
        const prevVacation = yield getOneVacation(vacation.vacationId, "Editing Vacation");
        // Upload new image and delete old one only if an image was sent
        if (vacation.image) {
            const extension = vacation.image.name.substring(vacation.image.name.lastIndexOf("."));
            vacation.imageName = (0, uuid_1.v4)() + extension;
            if (app_config_1.default.isDevelopment) {
                if (fs_1.default.existsSync("./src/1-assets/images/" + prevVacation.imageName)) {
                    fs_1.default.unlinkSync("./src/1-assets/images/" + prevVacation.imageName);
                    yield vacation.image.mv("./src/1-assets/images/" + vacation.imageName);
                }
            }
            else {
                yield s3Bucket_1.default.deleteImage(prevVacation.imageName);
                yield s3Bucket_1.default.uploadImage(vacation.image, vacation.imageName);
            }
            // Delete image before uploading to database
            delete vacation.image;
        }
        // If no image was sent, keep the old image name
        else
            vacation.imageName = prevVacation.imageName;
        const sql = `UPDATE vacations SET
        description = ?,
        destination = ?,
        imageName = ?,
        startDate =?,
        endDate = ?,
        price = ?
        WHERE vacationId = ?`;
        yield dal_1.default.execute(sql, [
            vacation.description,
            vacation.destination,
            vacation.imageName,
            vacation.startDate,
            vacation.endDate,
            vacation.price,
            vacation.vacationId
        ]);
        return vacation;
    });
}
function deleteVacation(vacationId) {
    return __awaiter(this, void 0, void 0, function* () {
        const prevVacation = yield getOneVacation(vacationId, "Deleting vacation");
        if (app_config_1.default.isDevelopment) {
            if (fs_1.default.existsSync("./src/1-assets/images/" + prevVacation.imageName)) {
                fs_1.default.unlinkSync("./src/1-assets/images/" + prevVacation.imageName);
            }
        }
        else
            yield s3Bucket_1.default.deleteImage(prevVacation.imageName);
        const sql = `DELETE FROM vacations WHERE vacationId = ?`;
        yield dal_1.default.execute(sql, [vacationId]);
    });
}
function addFollowToFollowers(follower) {
    return __awaiter(this, void 0, void 0, function* () {
        yield getOneVacation(follower.vacationId, "User Following"); // Will throw error if vacation doesn't exist 
        const sql = ` INSERT INTO followers VALUES(?, ?)`;
        yield dal_1.default.execute(sql, [
            follower.userId,
            follower.vacationId
        ]);
        return follower;
    });
}
function DeleteFollowToFollowers(follower) {
    return __awaiter(this, void 0, void 0, function* () {
        yield getOneVacation(follower.vacationId, "User Unfollowing"); // Will throw error if vacation doesn't exist 
        const sql = ` DELETE FROM followers WHERE userId = ? AND vacationId = ?`;
        const info = yield dal_1.default.execute(sql, [
            follower.userId,
            follower.vacationId
        ]);
        if (info.affectedRows === 0)
            throw new error_models_1.followerDosNotExistErrorModel(follower.userId, follower.vacationId);
    });
}
exports.default = {
    getAllVacations,
    getOneVacation,
    addOneVacation,
    editVacation,
    deleteVacation,
    addFollowToFollowers,
    DeleteFollowToFollowers,
    getVacationsForUser
};
