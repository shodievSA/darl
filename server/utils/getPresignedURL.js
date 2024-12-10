require("dotenv").config()
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

async function getPresignedURL(logoPath) {

    try {

        const s3Client = new S3Client({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
            }
        });

        const command = new GetObjectCommand({
            Bucket: "darl-generator-logos",
            Key: logoPath
        });

        const presignedURL = await getSignedUrl(
            s3Client, 
            command, 
            {
                expiresIn: 60 * 30
            }
        );

        return presignedURL;

    } catch (err) {

        console.log(err);

    }

}

module.exports = getPresignedURL;