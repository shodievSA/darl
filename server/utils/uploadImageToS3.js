require("dotenv").config();
const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

async function uploadImageToS3(logoDetails, logos) {

    try {

        const s3Client = new S3Client({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
            }
        });

        const uploadPromises = logoDetails.map(async (logoDetail, index) => {

            const key = logoDetail["value"];
            const base_64URL = logos[index];

            const uploadParams = {
                Bucket: "darl-generator-logos",
                Key: key,
                Body: Buffer.from(base_64URL, 'base64'),
                ContentType: "image/png"
            }
            
            await s3Client.send(new PutObjectCommand(uploadParams));

            const command = new GetObjectCommand({
                Bucket: "darl-generator-logos",
                Key: key,
                ResponseContentDisposition: `attachment; filename="${key}"`
            });
            
            const presignedURL = await getSignedUrl(
                s3Client, 
                command, 
                {
                    expiresIn: 60 * 30
                }
            );

            return presignedURL;

        });

        const presignedURLs = await Promise.all(uploadPromises);

        return presignedURLs;

    } catch (error) {

        console.log(error);

    }

}

module.exports = uploadImageToS3;