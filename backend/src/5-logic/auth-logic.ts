
import { OkPacket } from "mysql";
import cyber from "../2-utils/cyber";
import dal from "../2-utils/dal";
import CredentialsModel from "../4-models/credentials-model";
import { UnauthorizedErrorModel, ValidationErrorModel } from "../4-models/error-models";
import UserModel from "../4-models/user-model";


async function register(user: UserModel): Promise<string> {

    const errorMessage = user.validate();
    if (errorMessage) throw new ValidationErrorModel(errorMessage);
    if (await isUsernameTaken(user.username)) throw new ValidationErrorModel(`Username ${user.username} already taken`);

    user.password = cyber.hash(user.password);
    user.roleId = 1; //Make role as user (not admin)

    const sql = `INSERT INTO users VALUES(DEFAULT, ?, ?, ?, ?, ?)`;
    const info: OkPacket = await dal.execute(sql, [user.roleId, user.firstName, user.lastName, user.username, user.password]);
    user.userId = info.insertId;

    const token = cyber.getNewToken(user);
    return token;

}

async function login(credentials: CredentialsModel): Promise<string> {

    const errorMessage = credentials.validate();
    if (errorMessage) throw new ValidationErrorModel(errorMessage);

    credentials.password = cyber.hash(credentials.password);
    const sql = `SELECT * FROM users WHERE username = ? AND password = ?`;
    const users: UserModel[] = await dal.execute(sql, [credentials.username, credentials.password]); 
    if (users.length === 0) throw new UnauthorizedErrorModel("Incorrect username or password");
    const user = users[0];
    const token = cyber.getNewToken(user);
    return token;

}

async function isUsernameTaken(username: string): Promise<boolean> {
    const sql = `SELECT * FROM users WHERE username = ?`;
    const users: UserModel[] = await dal.execute(sql, [username]);
    return users.length > 0; // Will return true if username is taken
}


export default {
    register,
    login
}