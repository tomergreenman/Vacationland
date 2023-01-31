"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
// import RoleModel from "./role-model";
class UserModel {
    constructor(user) {
        this.userId = user.userId;
        this.roleId = user.roleId;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.username = user.username;
        this.password = user.password;
    }
    validate() {
        var _a;
        const result = UserModel.validationSchema.validate(this);
        return (_a = result.error) === null || _a === void 0 ? void 0 : _a.message;
    }
}
UserModel.validationSchema = joi_1.default.object({
    userId: joi_1.default.number().optional().integer().positive(),
    roleId: joi_1.default.number().optional().integer(),
    firstName: joi_1.default.string().required().min(2).max(20),
    lastName: joi_1.default.string().required().min(2).max(20),
    username: joi_1.default.string().required().min(4).max(20),
    password: joi_1.default.string().required().min(4).max(20).pattern(/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/) //at least one letter and one number
});
exports.default = UserModel;
