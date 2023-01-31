"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const userErrorLogger = (0, winston_1.createLogger)({
    transports: [
        new winston_1.transports.File({
            filename: "error-user.log",
            level: "error",
            format: winston_1.format.combine(winston_1.format.timestamp({ format: "YYYY-DD-MM HH:mm:ss" }), winston_1.format.json())
        })
    ]
});
const serverErrorLogger = (0, winston_1.createLogger)({
    transports: [
        new winston_1.transports.File({
            filename: "error-server.log",
            level: "error",
            format: winston_1.format.combine(winston_1.format.timestamp({ format: "YYYY-DD-MM HH:mm:ss" }), winston_1.format.json())
        })
    ]
});
const activityLogger = (0, winston_1.createLogger)({
    transports: [
        new winston_1.transports.File({
            filename: "activity.log",
            level: "info",
            format: winston_1.format.combine(winston_1.format.timestamp({ format: "YYYY-DD-MM HH:mm:ss" }), winston_1.format.json())
        })
    ]
});
exports.default = {
    userErrorLogger,
    serverErrorLogger,
    activityLogger
};
