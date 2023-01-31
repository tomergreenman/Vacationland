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
const cyber_1 = __importDefault(require("../2-utils/cyber"));
const dal_1 = __importDefault(require("../2-utils/dal"));
const error_models_1 = require("../4-models/error-models");
function register(user) {
    return __awaiter(this, void 0, void 0, function* () {
        const errorMessage = user.validate();
        if (errorMessage)
            throw new error_models_1.ValidationErrorModel(errorMessage);
        if (yield isUsernameTaken(user.username))
            throw new error_models_1.ValidationErrorModel(`Username ${user.username} already taken`);
        user.password = cyber_1.default.hash(user.password);
        user.roleId = 1; //Make role as user (not admin)
        const sql = `INSERT INTO users VALUES(DEFAULT, ?, ?, ?, ?, ?)`;
        const info = yield dal_1.default.execute(sql, [user.roleId, user.firstName, user.lastName, user.username, user.password]);
        user.userId = info.insertId;
        const token = cyber_1.default.getNewToken(user);
        return token;
    });
}
function login(credentials) {
    return __awaiter(this, void 0, void 0, function* () {
        const errorMessage = credentials.validate();
        if (errorMessage)
            throw new error_models_1.ValidationErrorModel(errorMessage);
        credentials.password = cyber_1.default.hash(credentials.password);
        const sql = `SELECT * FROM users WHERE username = ? AND password = ?`;
        const users = yield dal_1.default.execute(sql, [credentials.username, credentials.password]);
        if (users.length === 0)
            throw new error_models_1.UnauthorizedErrorModel("Incorrect username or password");
        const user = users[0];
        const token = cyber_1.default.getNewToken(user);
        return token;
    });
}
function isUsernameTaken(username) {
    return __awaiter(this, void 0, void 0, function* () {
        const sql = `SELECT * FROM users WHERE username = ?`;
        const users = yield dal_1.default.execute(sql, [username]);
        return users.length > 0; // Will return true if username is taken
    });
}
exports.default = {
    register,
    login
};
