class FollowersModel {
    public userId: number;
    public vacationId: number;

    public constructor (follower: FollowersModel){
        this.userId = follower.userId;
        this.vacationId = follower.vacationId;
    }
}

export default FollowersModel;