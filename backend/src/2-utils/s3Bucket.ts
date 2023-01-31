import AWS from "aws-sdk";

// In Production mode, all vacations images will be handled in an s3 bucket (amazon file cloud)
// These are the function to handle the s3 bucket


const bucketName = "" // Left blank in order to keep my bucket information secret

const s3 = new AWS.S3(
    {
        region: "", // Left blank in order to keep my bucket information secret
        accessKeyId: "", // Left blank in order to keep my bucket information secret
        secretAccessKey: "", // Left blank in order to keep my bucket information secret
    }
)

async function uploadImage(file: any, imageName: string) {

    const fileStream = Buffer.from(file.data);

    const uploadParams = {
        Bucket: bucketName,
        Body: fileStream,
        Key: imageName
    }

    return s3.upload(uploadParams).promise();

}

async function getImageUrl(imageName: string): Promise<string> {

    const imageUrl = await s3.getSignedUrlPromise('getObject', {
        Key: imageName,
        Bucket: bucketName,
        Expires: 300,
    })

    return imageUrl;

}

async function deleteImage(imageName: string): Promise<{}> {

    const deleteParams = {
        Key: imageName,
        Bucket: bucketName
    }

    return s3.deleteObject(deleteParams).promise();

}

export default {
    uploadImage,
    getImageUrl,
    deleteImage
}
