import RoleModel from "./RoleModel";


class UserModel {
    public userId: number;
    public roleId: RoleModel;
    public firstName: string;
    public lastName: string;
    public username: string;
    public password: string;



    public static firstNmeValidation = {
        required: { value: true, message: "Enter first name" },
        minLength: { value: 2, message: "First name must contain at least 2 characters" },
        maxLength: { value: 20, message: "First name can contain maximum 20 characters" }


    }

    public static lastNameValidation = {
        required: { value: true, message: "Enter last name" },
        minLength: { value: 2, message: "Last name must contain at least 2 characters" },
        maxLength: { value: 20, message: "Last name can contain maximum 20 characters" }
    }

    public static usernameValidation = {
        required: { value: true, message: "Enter username" },
        minLength: { value: 6, message: "Username must contain at least 6 characters" },
        maxLength: { value: 20, message: "Username can contain maximum 20 characters" }
    }

    public static passwordValidation = {
        required: { value: true, message: "Enter password" },
        minLength: { value: 6, message: "Password must contain at least 6 characters" },
        maxLength: { value: 20, message: "Password can contain maximum 20 characters" },
        pattern: { value: /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/, message: "Password must contain at least one letter and one number" }
        // pattern: {value: /^1$/, message:"Bad Pattern"}

    }
}

export default UserModel;