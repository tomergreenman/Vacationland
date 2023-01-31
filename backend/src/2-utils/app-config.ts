//Development config
class DevelopmentConfig {
    public isDevelopment = true;
    public isProduction = false;
    public host = "localhost";
    public user = "root";
    public password = "";
    public database = "vacationland";
    public port = 3001;
    public frontEndUrl = "http://localhost:3001";
}

// Production config:
class ProductionConfig {
    public isDevelopment = false;
    public isProduction = true;
    public host = ""; // Left blank in order to keep my heroku information secret
    public user = ""; // Left blank in order to keep my heroku information secret
    public password = ""; // Left blank in order to keep my heroku information secret
    public database = ""; // Left blank in order to keep my heroku information secret
    public port = process.env.PORT;
    public frontEndUrl = "https://tomer-vacationland.herokuapp.com/";
}

const appConfig = (process.env.NODE_ENV === "production") ? new ProductionConfig() : new DevelopmentConfig();

export default appConfig;
