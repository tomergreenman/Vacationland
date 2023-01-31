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
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const logger_1 = __importDefault(require("../2-utils/logger"));
const block_non_logged_in_1 = __importDefault(require("../3-middleware/block-non-logged-in"));
const verify_admin_1 = __importDefault(require("../3-middleware/verify-admin"));
const vacations_model_1 = __importDefault(require("../4-models/vacations-model"));
const vacations_logic_1 = __importDefault(require("../5-logic/vacations-logic"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const followers_model_1 = __importDefault(require("../4-models/followers.model"));
const app_config_1 = __importDefault(require("../2-utils/app-config"));
const s3Bucket_1 = __importDefault(require("../2-utils/s3Bucket"));
const router = express_1.default.Router();
router.get("/vacations", (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vacations = yield vacations_logic_1.default.getAllVacations();
        response.json(vacations);
    }
    catch (err) {
        next(err);
    }
}));
router.get("/vacations/:vacationId([0-9]+)", [block_non_logged_in_1.default], (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = +request.params.vacationId;
        const vacation = yield vacations_logic_1.default.getOneVacation(id);
        response.json(vacation);
    }
    catch (err) {
        next(err);
    }
}));
router.get("/vacations/for-user/:userId([0-9]+)", (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = +request.params.userId;
        const vacations = yield vacations_logic_1.default.getVacationsForUser(userId);
        response.json(vacations);
    }
    catch (err) {
        next(err);
    }
}));
router.post("/vacations", [verify_admin_1.default], (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        request.body.image = (_a = request.files) === null || _a === void 0 ? void 0 : _a.image;
        const vacation = new vacations_model_1.default(request.body);
        const addedVacation = yield vacations_logic_1.default.addOneVacation(vacation);
        response.status(201).json(addedVacation);
    }
    catch (err) {
        next(err);
    }
}));
router.put("/vacations/:vacationId([0-9]+)", [verify_admin_1.default], (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const vacationId = +request.params.vacationId;
        request.body.vacationId = vacationId;
        request.body.image = (_b = request.files) === null || _b === void 0 ? void 0 : _b.image;
        const vacation = new vacations_model_1.default(request.body);
        const editedVacation = yield vacations_logic_1.default.editVacation(vacation);
        response.status(201).json(editedVacation);
        logger_1.default.activityLogger.log("info", `Admin successfully edited vacation ${editedVacation.vacationId}`);
    }
    catch (err) {
        next(err);
    }
}));
router.delete("/vacations/:vacationId([0-9]+)", [verify_admin_1.default], (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vacationId = +request.params.vacationId;
        yield vacations_logic_1.default.deleteVacation(vacationId);
        response.sendStatus(204);
        logger_1.default.activityLogger.log("info", `Admin successfully deleted vacation ${vacationId}`);
    }
    catch (err) {
        next(err);
    }
}));
//Add follow
router.post("/followers/:vacationId([0-9]+)", [block_non_logged_in_1.default], (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get user id from the token he sends (in this way we eliminate the option for hackers to easily add follows to different users via postman)
        const token = request.header("authorization").substring(7);
        const decodedToken = jsonwebtoken_1.default.decode(token);
        const user = decodedToken.user;
        const userId = user.userId;
        const vacationId = +request.params.vacationId;
        const follower = new followers_model_1.default({ userId, vacationId });
        yield vacations_logic_1.default.addFollowToFollowers(follower);
        response.status(201).json(follower);
        logger_1.default.activityLogger.log("info", `userId ${userId} started following vacationId ${vacationId}`);
    }
    catch (err) {
        next(err);
    }
}));
//Delete follow
router.delete("/followers/:vacationId([0-9]+)", [block_non_logged_in_1.default], (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get user id from the token he sends (in this way we eliminate the option for hackers to easily delete follows to different users via postman)
        const token = request.header("authorization").substring(7);
        const decodedToken = jsonwebtoken_1.default.decode(token);
        const user = decodedToken.user;
        const userId = user.userId;
        const vacationId = +request.params.vacationId;
        const follower = new followers_model_1.default({ userId, vacationId });
        yield vacations_logic_1.default.DeleteFollowToFollowers(follower);
        response.sendStatus(204);
        logger_1.default.activityLogger.log("info", `userId ${userId} stopt following vacationId ${vacationId}`);
    }
    catch (err) {
        next(err);
    }
}));
//Get vacation image
router.get("/vacations-images/:imageName", (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const imageName = request.params.imageName;
        if (app_config_1.default.isDevelopment) {
            const absolutePath = path_1.default.join(__dirname, "..", "1-assets", "images", imageName);
            response.sendFile(absolutePath);
        }
        else {
            const imageUrl = yield s3Bucket_1.default.getImageUrl(imageName);
            response.send(imageUrl);
        }
    }
    catch (err) {
        next(err);
    }
}));
exports.default = router;
