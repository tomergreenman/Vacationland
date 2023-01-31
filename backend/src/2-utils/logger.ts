import { createLogger, format, transports } from "winston";

const userErrorLogger = createLogger({
    transports: [
        new transports.File({
            filename: "error-user.log",
            level: "error",
            format: format.combine(format.timestamp({ format: "YYYY-DD-MM HH:mm:ss" }), format.json())
        })
    ]
});

const serverErrorLogger = createLogger({
    transports: [
        new transports.File({
            filename: "error-server.log",
            level: "error",
            format: format.combine(format.timestamp({ format: "YYYY-DD-MM HH:mm:ss" }), format.json())
        })
    ]
});

const activityLogger = createLogger({
    transports: [
        new transports.File({
            filename: "activity.log",
            level: "info",
            format: format.combine(format.timestamp({ format: "YYYY-DD-MM HH:mm:ss" }), format.json())

        })
    ]
});

export default {
    userErrorLogger,
    serverErrorLogger,
    activityLogger
}