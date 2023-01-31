import IsFollowingModel from "./IsFollowingModel";


class VacationModel {
    public vacationId: number;
    public description: string;
    public destination: string;
    public imageName: string;
    public startDate: string;
    public endDate: string;
    public price: number;
    public isFollowing: IsFollowingModel;
    public followersCount: number;
    public image: FileList;


    public static descriptionValidation = {
        required: { value: true, message: "Enter description" },
        minLength: { value: 3, message: "Description must contain at least 3 characters" },
        maxLength: { value: 1000, message: "Description can contain maximum 1000 characters" }
    }

    public static destinationValidation = {
        required: { value: true, message: "Enter destination" },
        minLength: { value: 2, message: "Destination must contain at least 2 characters" },
        maxLength: { value: 20, message: "Destination can contain maximum 20 characters" }
    }

    public static startDateValidation = {
        required: { value: true, message: "Enter start date" },
    }

    public static endDateValidation = {
        required: { value: true, message: "Enter end date" },

    }

    public static priceValidation = {
        required: { value: true, message: "Enter price" },
        min: { value: 0, message: "Price must be 0 or positive" },
    }

    public static imageValidation = {
        required: { value: true, message: "Add image" },
    }



}

export default VacationModel;