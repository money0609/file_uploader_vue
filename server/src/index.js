const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const mongoose = require('mongoose')
// const path = require('path')
const multer = require('multer')
const GridFsStorage = require('multer-gridfs-storage')
const gridStream = require('gridfs-stream')

const app = express()

app.use(morgan('combined'))
app.use(bodyParser.json()) // if not working, change it back to app.use(bodyParser.json()). based on the doc, bodyparser is deprecated, being told it's built into express

app.use(cors())

// const uploadFileModel = require('../models/uploadFile')

// Connect to MongoDB
const MONGODB_URL = 'mongodb+srv://fullstackweb:Hirejiaqi@cluster0.vyqq8.mongodb.net/fileUploader?retryWrites=true&w=majority'
const PORT = process.env.PORT || 8081

const conn = mongoose.createConnection(
    MONGODB_URL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
)

let gfs

conn.once('open', () => {
    // Init stream
    // console.log(conn.db)
    gfs = gridStream(conn.db, mongoose.mongo)
    gfs.collection('uploads')
})

let updatedMetadata

const updateMetadata = data => {
    console.log('########## Updating Metadata #############')
    updatedMetadata = data
    console.log(updatedMetadata)
    console.log('##########     End Metadata  #############')
}

// Create a storage object with a given configuration
const storage = new GridFsStorage({
    url: MONGODB_URL,
    options: {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            console.log('!!!!! Testing storage: ' + JSON.stringify(file))
            const fileInfo = {
                filename: file.originalname,
                bucketName: 'uploads',
                metadata: updatedMetadata
            }

            resolve(fileInfo)
        })
    }
})

// Set multer storage engine to the newly created object
const upload = multer({ storage })

// using routes.js to route trafics
// require('./routes')(app, upload)
app.post('/register', (req, res) => {
    try {
        if (!req.body.username) {
            throw new Error('Username is required.')
        }

        res.send({
            message: `Hi ${req.body.username}!`
        })
    } catch (error) {
        res.status(500).send({
            error: error.message
        })
    }
})

app.get('/fetchAllFiles', (req, res) => {
    try {
        // console.log(typeof (gfs.mongo.Chunk().data))
        gfs.files.find().toArray((err, files) => {
            if (err) {
                throw new Error(err)
            }
            if (!files || files.length === 0) {
                return []
            }
            // const mybuff = new Buffer(gfs.mongo.Chunk().data.buffer)
            // console.log(gfs.mongo.Chunk)

            return res.json({ files: files })
        })

        // uploadFileModel.find((err, files) => {
        //     if (err) {
        //         console.log('Get All Err: ' + err)
        //         throw new Error(err)
        //     } else {
        //         console.log('Get All: ' + files)
        //         return res.json(files)
        //     }
        // })
    } catch (error) {
        res.status(500).send({
            error: error.message
        })
    }
})

app.post('/preUpload', (req, res) => {
    console.log('##########PRE UPLOAD START#############')
    const data = req.body

    if (!data) {
        throw new Error('Cannot parse image base64 string')
    }
    updateMetadata(data)
    console.log('##########PRE UPLOAD END#############')

    res.json({})
})

app.post(
    '/upload',
    upload.array('file'),
    (req, res) => {
        console.log('########## UPLOAD START#############')
        try {
            // console.log(req.files)
            console.time('Upload Operation')
            if ((req && !req.files) || req.files.length < 1) {
                throw new Error('File is required.')
            }

            // console.log(req.files)
                // message: `Hi ${req.body.username}!`
            console.timeEnd('Upload Operation')
            console.log('########## UPLOAD END #############')
            res.json({ files: req.files })
        } catch (error) {
            res.status(500).send({
                error: error.message
            })
        }
    }
)

// 32:00 https://www.youtube.com/watch?v=3f5Q9wDePzY
app.post('/download', (req, res) => {
    /*
    gfs.findOne({ _id: req.params.ID, root: 'resume' }, function (err, file) {
        if (err) {
            return res.status(400).send(err)
        }
        else if (!file) {
            return res.status(404).send('Error on the database looking for the file.')
        }

        res.set('Content-Type', file.contentType)
        res.set('Content-Disposition', 'attachment; filename="' + file.filename + '"')

        var readstream = gfs.createReadStream({
          _id: req.params.ID,
          root: 'resume'
        })

        readstream.on("error", function (err) {
            res.end();
        })
        readstream.pipe(res)
    })
    */
})

app.listen(
    PORT,
    () => console.log(`Connected on port: ${PORT}`)
)

mongoose.set('useFindAndModify', false)
