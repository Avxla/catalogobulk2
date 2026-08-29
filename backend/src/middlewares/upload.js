import multer from "multer";
import path from "path";
import fs from "fs";

const uploadPath = path.resolve("src/uploads");

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, {
        recursive: true
    });
}

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, uploadPath);
    },

    filename: (req, file, cb) => {

        const extension =
            path.extname(file.originalname).toLowerCase();

        const nombre =
            `${Date.now()}-${Math.round(Math.random() * 1E9)}${extension}`;

        cb(null, nombre);
    }
});

const fileFilter = (req, file, cb) => {

    const extension =
        path.extname(file.originalname).toLowerCase();

    const extensionesPermitidas = [
        ".csv",
        ".json"
    ];

    if (!extensionesPermitidas.includes(extension)) {

        return cb(
            new Error(
                "Solo se permiten archivos CSV o JSON"
            )
        );
    }

    cb(null, true);
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024
    }
});

export default upload;