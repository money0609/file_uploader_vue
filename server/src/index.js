const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const mongoose = require('mongoose')
const multer = require('multer')
const GridFsStorage = require('multer-gridfs-storage')
const gridStream = require('gridfs-stream')

const app = express()

app.use(morgan('combined'))
app.use(express.json({ limit: '50mb', extended: true })) // if not working, change it back to app.use(bodyParser.json()). based on the doc, bodyparser is deprecated, being told it's built into express
app.use(express.urlencoded({ limit: '50mb', extended: true }))
app.use(cors())
// app.use(serveStatic(__dirname, '../dist/index.html'))

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
    gfs = gridStream(conn.db, mongoose.mongo)
    gfs.collection('uploads')
})

// initialize metadata field of each upload.file in mongoDB
let updatedMetadata

const updateMetadata = data => {
    updatedMetadata = data
}

// Create a storage object with a given configuration
const storage = new GridFsStorage({
    url: MONGODB_URL,
    options: {
        useNewUrlParser: true, // gives warning if don't use these two options.
        useUnifiedTopology: true
    },
    file: (req, file) => {
        // Set the final filename, bucket name, and the optional metadata
        return new Promise((resolve, reject) => {
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
        res.status(500).send(error.message)
    }
})

app.get('/fetchAllFiles', (req, res) => {
    try {
        gfs.files.find().toArray((err, files) => {
            if (err) {
                throw new Error(err)
            }

            if (!files || files.length === 0) {
                return []
            }

            return res.json({ files: files })
        })
    } catch (error) {
        res.status(500).send(error.message)
    }
})

// update the Meatadata to the current uploading file's info
app.post('/preUpload', (req, res) => {
    const data = req.body

    if (!data) {
        throw new Error('Cannot parse image base64 string')
    }

    updateMetadata(data)

    res.json({})
})

app.post(
    '/upload',
    upload.array('file'),
    (req, res) => {
        try {
            console.time('Upload Operation')

            // Check the uploaded files.
            if ((req && !req.files) || req.files.length < 1) {
                throw new Error('File upload operation did not upload any file.')
            }

            // match the keys' names with the MongoDB keys' name
            const returnFiles = req.files.map(function (obj) {
                if (obj.id) {
                    obj._id = obj.id // Assign new key
                    delete obj.id // Delete old key
                }
                if (obj.size) {
                    obj.length = obj.size // Assign new key
                    delete obj.size // Delete old key
                }

                return obj
            })

            res.json({ files: returnFiles })
        } catch (error) {
            res.status(500).send(error.message)
        }
    }
)

app.get('/getFileById', (req, res) => {
    const fileId = req.query.fileId
    const downloadFlag = req.query.download

    // set the response content dispostion type
    const contentDispos = downloadFlag ? 'attachment' : 'inline'

    // Check the file id.
    if (!req.query || !fileId) {
        throw new Error('Requested file id is required.')
    }

    // Get one file by id
    gfs.findOne({ _id: fileId }, function (err, file) {
        // check if file found

        if (err) {
            throw new Error('Something failed. ' + err)
        } else if (!file) {
            throw new Error('File not found on the database.')
        }

        res.set('Content-Type', file.contentType)
        res.set('Content-Disposition', contentDispos + '; filename="' + file.filename + '"')

        const readstream = gfs.createReadStream({
          _id: file._id
        })

        readstream.on('error', function (error) {
            res.status(500).send(error.message)
        })

        readstream.pipe(res)
    })
})

app.listen(
    PORT,
    () => console.log(`Connected on port: ${PORT}`)
)

mongoose.set('useFindAndModify', false)
