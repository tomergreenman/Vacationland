export class ErrorModel {
    public constructor(public message: string, public status: number) { }
}

export class RouteNotFoundErrorModel extends ErrorModel {
    public constructor(route: string) {
        super(`Route ${route} does not exist`, 404);
    }
}

// Activity will give information to what was trying to be done when failed (get/update/delete vacation)
export class ResourceNotFoundErrorModel extends ErrorModel {
    public constructor(id: number, activity: string) {
        super(`${activity} failed because id ${id} does not exist`, 404);
    }
}

export class ValidationErrorModel extends ErrorModel {
    public constructor(message: string) {
        super(message, 400);
    }
}

export class UnauthorizedErrorModel extends ErrorModel {
    public constructor(message: string) {
        super(message, 401);
    }
}

export class followerDosNotExistErrorModel extends ErrorModel {
    public constructor (userId:number, vacationId:number){
        super(`user id ${userId} or vacation id ${vacationId} may not exist or\
        user id ${userId} is not following vacation id ${vacationId}`, 404)
    }
}

