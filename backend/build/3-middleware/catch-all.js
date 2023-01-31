"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_config_1 = __importDefault(require("../2-utils/app-config"));
// import logger from "../2-utils/logger";
const logger_1 = __importDefault(require("../2-utils/logger"));
function catchAll(err, request, response, next) {
    console.log(err);
    const status = err.status || 500;
    if (status === 500) {
        let msg = "SERVER ERROR status: 500: ";
        if (err.stack)
            msg += err.stack;
        else
            msg += err.message;
        logger_1.default.serverErrorLogger.log("error", msg);
    }
    else
        logger_1.default.userErrorLogger.log("error", err);
    const message = app_config_1.default.isDevelopment || status !== 500 ? err.message : "Some error occurred, please try again";
    response.status(status).send(message);
}
exports.default = catchAll;
