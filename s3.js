require('dotenv').config();
const aws = require('aws-sdk');
const crypto = require('crypto');

const {S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand} = require('@aws-sdk/client-s3');
const {getSignedUrl} = require('@aws-sdk/s3-request-presigner');
// const {PrismaClient} = require('@prisma/client');

const region = "us-east-2";
const bucketName = process.env.AWS_S3_BUCKET_NAME;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;



const s3 = new aws.S3({
    region,
    accessKeyId,
    secretAccessKey,
    signatureVersion: 'v4'
});


// const fetchDataFromS3 = async () => {
//     try {
//         const data = await s3.listObjectsV2({ Bucket: bucketName }).promise();

//         const imagesData = await Promise.all(
//             data.Contents.map(async (item) => {
//                 const imageKey = item.Key;
//                 const getObjectParams = {
//                     Bucket: bucketName,
//                     Key: imageKey,
//                 };

//                 const signedUrl = await generateUploadURL({}); // Assuming generateUploadURL is used to create signed URLs

//                 const metadata = await s3.headObject(getObjectParams).promise();
//                 const title = metadata.Metadata['x-amz-meta-title'] || 'Image Title';
//                 const description = metadata.Metadata['x-amz-meta-description'] || 'Image Description';

//                 return {
//                     url: signedUrl, // Or use imageUrl based on your requirements
//                     title,
//                     description,
//                 };
//             })
//         );

//         return imagesData;
//     } catch (error) {
//         throw new Error('Failed to fetch data from S3:', error.message);
//     }
// };

// async function generateUploadURL({title, description}) {
//     const rawBytes = crypto.randomBytes(16);
//     const imageName = rawBytes.toString('hex');

//     const params = ({
//         Bucket: bucketName,
//         Key: imageName,
//         Expires: 300,
//         Metadata: {
//             Title: title || '',
//             Description: description || '',
//         },
//     })

//     const uploadURL = await s3.getSignedUrlPromise('putObject', params)
//     return uploadURL
// }

// const uploadToS3 = (file) => {
//     return new Promise((resolve, reject) => {
//         const params = {
//             Bucket: bucketName,
//             Key: `uploads/${file.originalname}`,
//             Body: file.buffer,
//             ACL: 'public-read',
//             ContentType: file.mimetype
//         };

//         s3.upload(params, (err, data) => {
//             if (err) {
//                 reject(err);
//             }
//             else{
//                 resolve({url: data.Location});
//             }
//         });
//     });
// };


// module.exports = {generateUploadURL, fetchDataFromS3}; // Exporting the function directly

module.exports = {s3};
