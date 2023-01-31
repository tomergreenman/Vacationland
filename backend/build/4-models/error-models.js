"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.followerDosNotExistErrorModel = exports.UnauthorizedErrorModel = exports.ValidationErrorModel = exports.ResourceNotFoundErrorModel = exports.RouteNotFoundErrorModel = exports.ErrorModel = void 0;
class ErrorModel {
    constructor(message, status) {
        this.message = message;
        this.status = status;
    }
}
exports.ErrorModel = ErrorModel;
class RouteNotFoundErrorModel extends ErrorModel {
    constructor(route) {
        super(`Route ${route} does not exist`, 404);
    }
}
exports.RouteNotFoundErrorModel = RouteNotFoundErrorModel;
// Activity will give information to what was trying to be done when failed (get/update/delete vacation)
class ResourceNotFoundErrorModel extends ErrorModel {
    constructor(id, activity) {
        super(`${activity} failed because id ${id} does not exist`, 404);
    }
}
exports.ResourceNotFoundErrorModel = ResourceNotFoundErrorModel;
class ValidationErrorModel extends ErrorModel {
    constructor(message) {
        super(message, 400);
    }
}
exports.ValidationErrorModel = ValidationErrorModel;
class UnauthorizedErrorModel extends ErrorModel {
    constructor(message) {
        super(message, 401);
    }
}
exports.UnauthorizedErrorModel = UnauthorizedErrorModel;
class followerDosNotExistErrorModel extends ErrorModel {
    constructor(userId, vacationId) {
        super(`user id ${userId} or vacation id ${vacationId} may not exist or\
        user id ${userId} is not following vacation id ${vacationId}`, 404);
    }
}
exports.followerDosNotExistErrorModel = followerDosNotExistErrorModel;
