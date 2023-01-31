import express from "express";
import fileUpload from "express-fileupload";
import cors from "cors";
import appConfig from "./2-utils/app-config";
import catchAll from "./3-middleware/catch-all";
import routeNotFound from "./3-middleware/route-not-found";
import sanitize from "./3-middleware/sanitize";
import expressRateLimit from "express-rate-limit";
import helmet from "helmet";
import vacationsController from "./6-controllers/vacations-controller";
import authController from "./6-controllers/auth-controller";
import path from "path";


const server = express();
server.use(cors());

const rateLimiter = expressRateLimit({
    max: 10, // Maximum requests per same client
    windowMs: 1000, // Time window to allow the max requests.
    message: "You can't make more than 10 requests in one second!" // When performing more request - return this message
})

// Limit number of requests for all routes apart from images(/vacations-images/)
server.use("/api/vacations/", rateLimiter);
server.use("/api/auth/", rateLimiter);
server.use("/api/followers/", rateLimiter);


//Helmet causing problems in frontend for displaying vacations images
//We need different settings for development and production
if (appConfig.isDevelopment) {

    server.use(helmet({
        crossOriginResourcePolicy: false,
    }));
}

else {

    server.use(helmet({ crossOriginEmbedderPolicy: false, originAgentCluster: true }));
    server.use(
        helmet.contentSecurityPolicy({
            useDefaults: true,
            directives: {
                "img-src": ["'self'", "https: data: blob:"],
            },
        })
    );

}

server.use(express.json());

if (appConfig.isProduction) server.use(express.static(path.join(__dirname, "./_front-end")));

server.use(fileUpload());
server.use(sanitize);
server.use("/api", vacationsController);
server.use("/api", authController);

if (appConfig.isProduction) server.use("*", (request, response) => {
    response.sendFile(path.join(__dirname, "./_front-end/index.html"));
})

server.use("*", routeNotFound);


server.use(catchAll);

server.listen(appConfig.port, () => console.log(`Listening on http://localhost:${appConfig.port}`));
