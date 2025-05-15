import multer from 'multer';
import path from 'path';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname);
  if (ext === '.csv' || ext === '.xlsx' || ext === '.xls') {
    cb(null, true);
  } else {
    cb(new Error('Only .csv, .xlsx, .xls files are allowed'), false);
  }
};

const upload = multer({ storage, fileFilter });

export default upload;
