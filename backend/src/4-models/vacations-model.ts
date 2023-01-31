import { UploadedFile } from "express-fileupload";
import Joi from "joi";


class VacationModel {
    public vacationId: number;
    public description: string;
    public destination: string;
    public imageName: string;
    public image: UploadedFile;
    public startDate: string;
    public endDate: string;
    public price: number;

    public constructor(vacation: VacationModel) {
        this.vacationId = vacation.vacationId;
        this.description = vacation.description;
        this.destination = vacation.destination;
        this.imageName = vacation.imageName;
        this.image = vacation.image;
        this.startDate = vacation.startDate;
        this.endDate = vacation.endDate;
        this.price = vacation.price;
    }

    static addValidationSchema = Joi.object({
        vacationId: Joi.number().optional().integer().positive(),
        description: Joi.string().required().min(3).max(1000),
        destination: Joi.string().required().min(2).max(30),
        imageName: Joi.string().optional(),
        image: Joi.object().required(),
        startDate: Joi.string().required().length(10).message("Date format must be yyyy-mm-dd"), // The date format contains 10 characters
        endDate: Joi.string().required().length(10).message("Date format must be yyyy-mm-dd"),
        price: Joi.number().required().integer().min(0),
    });


    // Edit validation different because when editing, image is optional 
    static editValidationSchema = Joi.object({
        vacationId: Joi.number().optional().integer().positive(),
        description: Joi.string().required().min(3).max(1000),
        destination: Joi.string().required().min(2).max(30),
        imageName: Joi.string().optional(),
        image: Joi.object().optional(),
        startDate: Joi.string().required().length(10).message("Date format must be yyyy-mm-dd"),
        endDate: Joi.string().required().length(10).message("Date format must be yyyy-mm-dd"),
        price: Joi.number().required().integer().min(0)

    });

    public addValidate(): string {
        const result = VacationModel.addValidationSchema.validate(this);
        return result.error?.message;
    }
    public editValidate(): string {
        const result = VacationModel.editValidationSchema.validate(this);
        return result.error?.message;
    }

}

export default VacationModel;