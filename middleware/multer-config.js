const multer = require('multer');
const sharp = require('sharp');

const MIME_TYPES = {
    'image/jpg' : 'webp',
    'image/jpeg' : 'webp',
    'image/png' : 'webp'
}
console.log(MIME_TYPES);
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        //
        callback(null, name + Date.now() + '.' + extension);
    }
});

//Upload va permettre de filtré/limité le type de fichiers acceptés sur le site.
const upload = multer({
    storage,
    fileFilter: (req, file, callback) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            callback(null, true);
        } else {
            callback(new Error('Le site ne supporte pas ce type de fichier.'));
        }
    }
}).single('image');

//compressImage va permettre de compresser les images au format webp avec une qualité de 70%.
module.exports = {
    upload,
    compressImage: (req, res, next) => {
        if (!req.file) {
            return next();
        }

        const outputPath = 'images/compressed/' + req.file.filename;
        sharp(req.file.path)
            .webp({ quality: 70 })
            .toFile(outputPath, (err) => {
                if (err) {
                    console.error(err);
                }
                next();
            });
    }
};