const s3Client = require("./s3-client");
const { PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

async function uploadObject(logoDetails, logo) {

    try {

        const key = logoDetails["value"];
        const base_64URL = logo;

        const uploadParams = {
            Bucket: "darl-generator-logos",
            Key: key,
            Body: Buffer.from(base_64URL, 'base64'),
            ContentType: "image/png"
        }
        
        await s3Client.send(new PutObjectCommand(uploadParams));

    } catch (error) {

        console.log(error);
        throw new Error("An error occured while uploading an object into S3 bucket.");

    }

}

async function getPresignedURL(key) {

    try {

        const command = new GetObjectCommand({
            Bucket: "darl-generator-logos",
            Key: key,
            ResponseContentDisposition: `attachment; filename="${key}"`
        });

        const presignedURL = await getSignedUrl(
            s3Client, 
            command, 
            { expiresIn: 60 * 30 }
        );

        return presignedURL;

    } catch (err) {

        console.log(err);
        throw new Error("An error occured while retrieving pre-signed URL.");

    }

}

const s3BucketServices = {
    uploadObject,
    getPresignedURL
}

module.exports = s3BucketServices;