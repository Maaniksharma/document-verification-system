import multer from "multer";
import { v4 } from "uuid";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/templates");
  },
  filename: function (req, file, cb) {
    const uniquePath = v4() + "-" + file.originalname;
    cb(null, uniquePath);
  },
});

const upload = multer({ storage: storage });

export default upload;
