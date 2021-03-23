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

// Create a storage object with a given configuration
const storage = new GridFsStorage({
    url: MONGODB_URL,
    options: {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    file: (req, file) => {
        return {
            filename: file.originalname,
            bucketName: 'uploads'
        }
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

app.post('/upload', upload.array('file'), (req, res) => {
    try {
        console.log(req.files)

        if ((req && !req.files) || req.files.length < 1) {
            throw new Error('File is required.')
        }

        // console.log(req.files)
            // message: `Hi ${req.body.username}!`
        res.json({ files: req.files })
    } catch (error) {
        res.status(500).send({
            error: error.message
        })
    }
})

// 32:00 https://www.youtube.com/watch?v=3f5Q9wDePzY
app.post('/download', (req, res) => {

})

app.listen(
    PORT,
    () => console.log(`Connected on port: ${PORT}`)
)

mongoose.set('useFindAndModify', false)
