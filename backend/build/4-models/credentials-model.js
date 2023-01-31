"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class CredentialsModel {
    constructor(credentials) {
        this.username = credentials.username;
        this.password = credentials.password;
    }
    validate() {
        var _a;
        const result = CredentialsModel.validationSchema.validate(this);
        return (_a = result.error) === null || _a === void 0 ? void 0 : _a.message;
    }
}
CredentialsModel.validationSchema = joi_1.default.object({
    username: joi_1.default.string().required().min(6).max(20),
    password: joi_1.default.string().required().min(6).max(20)
});
exports.default = CredentialsModel;
