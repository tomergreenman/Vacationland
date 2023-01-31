"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = __importDefault(require("aws-sdk"));
// In Production mode, all vacations images will be handled in an s3 bucket (amazon file cloud)
// These are the function to handle the s3 bucket
const bucketName = ""; // Left blank in order to keep my bucket information secret
const s3 = new aws_sdk_1.default.S3({
    region: "",
    accessKeyId: "",
    secretAccessKey: "", // Left blank in order to keep my bucket information secret
});
function uploadImage(file, imageName) {
    return __awaiter(this, void 0, void 0, function* () {
        const fileStream = Buffer.from(file.data);
        const uploadParams = {
            Bucket: bucketName,
            Body: fileStream,
            Key: imageName
        };
        return s3.upload(uploadParams).promise();
    });
}
function getImageUrl(imageName) {
    return __awaiter(this, void 0, void 0, function* () {
        const imageUrl = yield s3.getSignedUrlPromise('getObject', {
            Key: imageName,
            Bucket: bucketName,
            Expires: 300,
        });
        return imageUrl;
    });
}
function deleteImage(imageName) {
    return __awaiter(this, void 0, void 0, function* () {
        const deleteParams = {
            Key: imageName,
            Bucket: bucketName
        };
        return s3.deleteObject(deleteParams).promise();
    });
}
exports.default = {
    uploadImage,
    getImageUrl,
    deleteImage
};
