
class CredentialsModel {
    public username: string;
    public password: string;


    public static usernameValidation = {
        required: { value: true, message: "Enter username" },
        minLength: { value: 6, message: "Username must contain at least 6 characters" },
        maxLength: { value: 20, message: "Username can contain maximum 20 characters" }
    }

    public static passwordValidation = {
        required: { value: true, message: "Enter password" },
        minLength: { value: 6, message: "Password must contain at least 6 characters" },
        maxLength: { value: 20, message: "Password can contain maximum 20 characters" }
    }
}

export default CredentialsModel;
