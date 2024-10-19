import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";

const MIME_TYPE_MAP = { // JS object map mime types to file extensions. mime types tell us which type of file we're dealing with
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',

}

// Set up S3 client
const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

// Configure Multer for file handling
const fileUpload = multer({
    limits: { fileSize: 500000 }, // Limit to 500 kb
    fileFilter: (req, file, cb) => { 
        const isValid = !!MIME_TYPE_MAP[file.mimetype]; // Check if the file's MIME type is valid, with the help of the mime type map
        let error = isValid ? null : new Error('Invalid mime type!');
        cb(error, isValid);
    }
});

// Custom S3 upload function
const uploadToS3 = async (file) => {
    const fileName = `${uuidv4()}.${MIME_TYPE_MAP[file.mimetype]}`;
    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: fileName,
        Body: file.buffer, // uses the buffer from Multer
        ContentType: file.mimetype
    };
    const upload = new Upload({
        client: s3,
        params: params
    });

    await upload.done(); // wait for the upload to complete
    return `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
};

const deleteFromS3 = async (fileKey) => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileKey, // File key (filename) to delete
  };

  try {
    await s3.send(new DeleteObjectCommand(params));
    console.log(`File ${fileKey} deleted from S3.`);
  } catch (error) {
    console.error(`Failed to delete file from S3: ${error.message}`);
  }
};

export { fileUpload, uploadToS3, deleteFromS3 };


export { fileUpload, uploadToS3, deleteFromS3 };


// const fileUpload = multer({
//     limit: 500000,
//     storage: multer.diskStorage({ // configure where the image is stored
//         destination: (req, file, cb) => {
//             cb(null, 'uploads/images');
//         },
//         fileName: (req, file, cb) => { // how the file name is named
//             const ext = MIME_TYPE_MAP[file.mimetype];
//             cb(null, uuidv4() + '.' + ext);
//         }
//     }),
//     fileFilter: (req, file, cb) => { // which files to accept, with the help of the mime type map
//         const isValid = !!MIME_TYPE_MAP[file.mimetype];
//         let error = isValid ? null : new Error('Invalid mime type!');
//         cb(error, isValid);
//     }
// });