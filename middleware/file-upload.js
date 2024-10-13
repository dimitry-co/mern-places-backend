import multer from "multer";
import { v4 as uuidv4 } from "uuid";

const MIME_TYPE_MAP = { // JS object map mime types to file extensions. mime types tell us which type of file we're dealing with
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',

}

const fileUpload = multer({
    limit: 500000,
    storage: multer.diskStorage({ // configure where the image is stored
        destination: (req, file, cb) => {
            cb(null, 'uploads/images');
        },
        fileName: (req, file, cb) => { // how the file name is named
            const ext = MIME_TYPE_MAP[file.mimetype];
            cb(null, uuidv4() + '.' + ext);
        }
    }),
    fileFilter: (req, file, cb) => { // which files to accept, with the help of the mime type map
        const isValid = !!MIME_TYPE_MAP[file.mimetype];
        let error = isValid ? null : new Error('Invalid mime type!');
        cb(error, isValid);
    }
});

export { fileUpload };
