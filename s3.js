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

async function fetchDataFromS3() {
    try{
        const params = {
            Bucket: bucketName,
        };

        const data = await s3.listObjectsV2(params).promise();

        console.log(data); 

        const imagesData = await Promise.all(
            data.Contents.map(async (item) => {
                
                const imageKey = item.Key;
                const imageUrl = `https://${params.Bucket}.s3.amazonaws.com/${imageKey}`;

                console.log(imageUrl);
        
                // Fetch metadata for the current image
                const headParams = {
                    Bucket: params.Bucket,
                    Key: imageKey,
                };
        
                const metadata = await s3.headObject(headParams).promise();
        
                // Extract specific metadata fields (title, description)
                const title = metadata.Metadata['x-amz-meta-title'] || 'Image Title';
                const description = metadata.Metadata['x-amz-meta-description'] || 'Image Description';

                console.log(title);
                console.log(description);

                return {
                    url: imageUrl,
                    title,
                    description,
                };
            })
        );
      
        return imagesData;
    } 
    catch (error) {
        throw new Error('Failed to fetch data from S3:', error.message);
    }
};


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

module.exports = {generateUploadURL, fetchDataFromS3}; // Exporting the function directly
