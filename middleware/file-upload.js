import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import AWS from 'aws-sdk';
import multerS3 from 'multer-s3';

const MIME_TYPE_MAP = { // JS object map mime types to file extensions. mime types tell us which type of file we're dealing with
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',

}

// set up AWS S3
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

// set up Multer to upload files to S3
const fileUpload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.S3_BUCKET_NAME,
        acl: 'public-read', // Ensures the upload files are publicly accessible
        key: (req, file, cb) => {
            const ext = MIME_TYPE_MAP[file.mimetype];
            cb(null, uuidv4() + '.' + ext) // unique file name (key)
        }
    }),
    limits: { fileSize: 500000}, // file size limit is 500kb
    fileFilter: (req, file, cb) => { 
        const isValid = !!MIME_TYPE_MAP[file.mimetype]; // Check if the file's MIME type is valid, with the help of the mime type map
        let error = isValid ? null : new Error('Invalid mime type!');
        cb(error, isValid);
    }
});

export { fileUpload };


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