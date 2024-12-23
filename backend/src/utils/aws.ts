import AWS from "aws-sdk";



const s3 = new AWS.S3({  
  accessKeyId: process.env.AWS_ACCESSKEY_ID,
  secretAccessKey: process.env.AWS_SECRETACCESS_KEY,
  region: process.env.AWS_REGION,
}); 

export default s3; 