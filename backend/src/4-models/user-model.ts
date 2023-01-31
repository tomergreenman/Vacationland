import Joi from "joi";
// import RoleModel from "./role-model";

class UserModel {

    public userId: number;
    public roleId: number;
    public firstName: string;
    public lastName: string;
    public username: string;
    public password: string;

    public constructor(user: UserModel) {
        this.userId = user.userId;
        this.roleId = user.roleId;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.username = user.username;
        this.password = user.password;
    }

    public static validationSchema = Joi.object({
        userId: Joi.number().optional().integer().positive(),
        roleId: Joi.number().optional().integer(),
        firstName: Joi.string().required().min(2).max(20),
        lastName: Joi.string().required().min(2).max(20),
        username: Joi.string().required().min(4).max(20),
        password: Joi.string().required().min(4).max(20).pattern(/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/) //at least one letter and one number
    });

    public validate(): string {
        const result = UserModel.validationSchema.validate(this);
        return result.error?.message;
    }
}

export default UserModel;
