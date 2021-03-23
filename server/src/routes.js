const AuthenticationController = require('../controllers/AuthenticationController')
const FileController = require('../controllers/FileController')

module.exports = (app, multer) => {
    app.post('/register', AuthenticationController.register)

    app.post('/upload', multer.array('uploadFileName'), FileController.upload)

    app.post('/download', FileController.download)
}
