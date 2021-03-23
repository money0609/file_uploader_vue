const mongoose = require('mongoose')

const uploadFileSchema = mongoose.Schema({
    fileName: String,
    creator: String,
    selectedFile: String,
    createdDate: {
        type: Date,
        default: new Date()
    }
})

const UploadFile = mongoose.model('UploadFile', uploadFileSchema)

export default UploadFile
