require("dotenv").config();
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

async function uploadImageToS3(logoPath, logo) {

    try {

        const s3Client = new S3Client({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
            }
        });

        const uploadParams = {
            Bucket: "darl-generator-logos",
            Key: logoPath,
            Body: Buffer.from(logo, 'base64'),
            ContentType: "image/png"
        }

        const command = new PutObjectCommand(uploadParams);
        const response = await s3Client.send(command);

        console.log('Image uploaded successfully', response);

    } catch (error) {

        console.log(error);

    }

}

module.exports = uploadImageToS3;