require('dotenv').config();
const aws = require('aws-sdk');
const crypto = require('crypto');

const region = "us-east-2";
const bucketName = "fashionscape-user-upload";
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new aws.S3({
    region,
    accessKeyId,
    secretAccessKey,
    signatureVersion: 'v4'
});

async function generateUploadURL({title, description}) {
    const rawBytes = crypto.randomBytes(16);
    const imageName = rawBytes.toString('hex');

    const params = ({
        Bucket: bucketName,
        Key: imageName,
        Expires: 60,
        Metadata: {
            Title: title || '',
            Description: description || '',
        },
    })

    const uploadURL = await s3.getSignedUrlPromise('putObject', params)
    return uploadURL
}

module.exports = generateUploadURL; // Exporting the function directly
