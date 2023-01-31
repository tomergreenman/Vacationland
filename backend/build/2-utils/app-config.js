"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//Development config
class DevelopmentConfig {
    constructor() {
        this.isDevelopment = true;
        this.isProduction = false;
        this.host = "localhost";
        this.user = "root";
        this.password = "";
        this.database = "vacationland";
        this.port = 3001;
        this.frontEndUrl = "http://localhost:3001";
    }
}
// Production config:
class ProductionConfig {
    constructor() {
        this.isDevelopment = false;
        this.isProduction = true;
        this.host = ""; // Left blank in order to keep my heroku information secret
        this.user = ""; // Left blank in order to keep my heroku information secret
        this.password = ""; // Left blank in order to keep my heroku information secret
        this.database = ""; // Left blank in order to keep my heroku information secret
        this.port = process.env.PORT;
        this.frontEndUrl = "https://tomer-vacationland.herokuapp.com/";
    }
}
const appConfig = (process.env.NODE_ENV === "production") ? new ProductionConfig() : new DevelopmentConfig();
exports.default = appConfig;
