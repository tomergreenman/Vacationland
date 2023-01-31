"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const cors_1 = __importDefault(require("cors"));
const app_config_1 = __importDefault(require("./2-utils/app-config"));
const catch_all_1 = __importDefault(require("./3-middleware/catch-all"));
const route_not_found_1 = __importDefault(require("./3-middleware/route-not-found"));
const sanitize_1 = __importDefault(require("./3-middleware/sanitize"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const helmet_1 = __importDefault(require("helmet"));
const vacations_controller_1 = __importDefault(require("./6-controllers/vacations-controller"));
const auth_controller_1 = __importDefault(require("./6-controllers/auth-controller"));
const path_1 = __importDefault(require("path"));
const server = (0, express_1.default)();
server.use((0, cors_1.default)());
const rateLimiter = (0, express_rate_limit_1.default)({
    max: 10,
    windowMs: 1000,
    message: "You can't make more than 10 requests in one second!" // When performing more request - return this message
});
// Limit number of requests for all routes apart from images(/vacations-images/)
server.use("/api/vacations/", rateLimiter);
server.use("/api/auth/", rateLimiter);
server.use("/api/followers/", rateLimiter);
//Helmet causing problems in frontend for displaying vacations images
//We need different settings for development and production
if (app_config_1.default.isDevelopment) {
    server.use((0, helmet_1.default)({
        crossOriginResourcePolicy: false,
    }));
}
else {
    server.use((0, helmet_1.default)({ crossOriginEmbedderPolicy: false, originAgentCluster: true }));
    server.use(helmet_1.default.contentSecurityPolicy({
        useDefaults: true,
        directives: {
            "img-src": ["'self'", "https: data: blob:"],
        },
    }));
}
server.use(express_1.default.json());
if (app_config_1.default.isProduction)
    server.use(express_1.default.static(path_1.default.join(__dirname, "./_front-end")));
server.use((0, express_fileupload_1.default)());
server.use(sanitize_1.default);
server.use("/api", vacations_controller_1.default);
server.use("/api", auth_controller_1.default);
if (app_config_1.default.isProduction)
    server.use("*", (request, response) => {
        response.sendFile(path_1.default.join(__dirname, "./_front-end/index.html"));
    });
server.use("*", route_not_found_1.default);
server.use(catch_all_1.default);
server.listen(app_config_1.default.port, () => console.log(`Listening on http://localhost:${app_config_1.default.port}`));
