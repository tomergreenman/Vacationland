"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class VacationModel {
    constructor(vacation) {
        this.vacationId = vacation.vacationId;
        this.description = vacation.description;
        this.destination = vacation.destination;
        this.imageName = vacation.imageName;
        this.image = vacation.image;
        this.startDate = vacation.startDate;
        this.endDate = vacation.endDate;
        this.price = vacation.price;
    }
    addValidate() {
        var _a;
        const result = VacationModel.addValidationSchema.validate(this);
        return (_a = result.error) === null || _a === void 0 ? void 0 : _a.message;
    }
    editValidate() {
        var _a;
        const result = VacationModel.editValidationSchema.validate(this);
        return (_a = result.error) === null || _a === void 0 ? void 0 : _a.message;
    }
}
VacationModel.addValidationSchema = joi_1.default.object({
    vacationId: joi_1.default.number().optional().integer().positive(),
    description: joi_1.default.string().required().min(3).max(1000),
    destination: joi_1.default.string().required().min(2).max(30),
    imageName: joi_1.default.string().optional(),
    image: joi_1.default.object().required(),
    startDate: joi_1.default.string().required().length(10).message("Date format must be yyyy-mm-dd"),
    endDate: joi_1.default.string().required().length(10).message("Date format must be yyyy-mm-dd"),
    price: joi_1.default.number().required().integer().min(0),
});
// Edit validation different because when editing, image is optional 
VacationModel.editValidationSchema = joi_1.default.object({
    vacationId: joi_1.default.number().optional().integer().positive(),
    description: joi_1.default.string().required().min(3).max(1000),
    destination: joi_1.default.string().required().min(2).max(30),
    imageName: joi_1.default.string().optional(),
    image: joi_1.default.object().optional(),
    startDate: joi_1.default.string().required().length(10).message("Date format must be yyyy-mm-dd"),
    endDate: joi_1.default.string().required().length(10).message("Date format must be yyyy-mm-dd"),
    price: joi_1.default.number().required().integer().min(0)
});
exports.default = VacationModel;
