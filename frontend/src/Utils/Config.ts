class Config {


    public static serverUrl: string;

    public static _initialize() {
        if (process.env.NODE_ENV === "production") Config.serverUrl = "https://tomer-vacationland.herokuapp.com/"
        else Config.serverUrl = "http://localhost:3001/"
             
    }

    public vacationsUrl = Config.serverUrl + "api/vacations/";
    public vacationsForUserUrl = Config.serverUrl + "api/vacations/for-user/";
    public vacationImageUrl = Config.serverUrl + "api/vacations-images/";
    public followersUrl = Config.serverUrl + "api/followers/";
    public registerUrl = Config.serverUrl + "api/auth/register/";
    public loginUrl = Config.serverUrl + "api/auth/login/";

}

Config._initialize();

const appConfig = new Config();

export default appConfig;
