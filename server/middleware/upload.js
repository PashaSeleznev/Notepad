const multer = require("multer");
const path = require("path");

// Указываем папку, куда будут сохраняться загруженные файлы
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "uploads/")
  },
  filename: (req, file, callback) => {
    callback(null, new Date().toLocaleDateString() + '-' + file.originalname)
  }
});


const types = ['image/png', 'image/jpg', 'image/jpeg']

const fileFilter = (req, file, callback) => {
    if (types.includes(file.mimetype)) {
        callback(null, true)
    } else {
        callback(null, false)
    }
}

module.exports = multer({ storage, fileFilter })