class RoleModel {
    public roleId: number;
    public roleName: string;

    public constructor(role: RoleModel) {
        this.roleId = role.roleId;
        this.roleName = role.roleName;
    }
}

export default RoleModel;
