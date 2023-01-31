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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const error_models_1 = require("../4-models/error-models");
const jwtSecretKey = "LordOfTheRings";
function getNewToken(user) {
    // Delete password before returning to frontend!
    delete user.password;
    const container = { user };
    const options = { expiresIn: "24h" }; // Remove options //////////////
    const token = jsonwebtoken_1.default.sign(container, jwtSecretKey, options); // Remove options ////////////////
    return token;
}
function verifyToken(request) {
    return new Promise((resolve, reject) => {
        try {
            const header = request.header("authorization");
            if (!header) {
                resolve(false);
                return;
            }
            // Extract token from header 
            const token = header.substring(7);
            if (!token) {
                resolve(false);
                return;
            }
            jsonwebtoken_1.default.verify(token, jwtSecretKey, err => {
                if (err) {
                    resolve(false);
                    return;
                }
                resolve(true);
            });
        }
        catch (err) {
            reject(err);
        }
    });
}
function verifyAdmin(request) {
    return __awaiter(this, void 0, void 0, function* () {
        // First check if user logged in:
        const isLoggedIn = yield verifyToken(request);
        // If not logged in:
        if (!isLoggedIn)
            throw new error_models_1.UnauthorizedErrorModel("You are not logged in");
        // Extract token: 
        const header = request.header("authorization");
        const token = header.substring(7);
        // Extract container from token:
        const decodedToken = jsonwebtoken_1.default.decode(token);
        // Extract user: 
        const user = decodedToken.user;
        // Return true if user is admin, otherwise return false:
        return user.roleId === 2;
    });
}
const salt = "JohPaulGeorgeRingo";
function hash(plainText) {
    if (!plainText)
        return null;
    // Hash and add salt: 
    const hashedText = crypto_1.default.createHmac("sha512", salt).update(plainText).digest("hex");
    return hashedText;
}
exports.default = {
    getNewToken,
    verifyToken,
    verifyAdmin,
    hash,
    jwtSecretKey
};
