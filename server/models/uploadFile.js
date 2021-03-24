const mongoose = require('mongoose')

const uploadFileSchema = mongoose.Schema({
    _ObjId: mongoose.Schema.Types.ObjectId,
    filename: String,
    contentType: String,
    length: String,
    md5: String,
    testCol: {
        data: Buffer
    }
})

const UploadFile = mongoose.model('UploadFile', uploadFileSchema)

module.exports = UploadFile
