module.exports = {
    upload (req, res) {
        // console.log(req)

        try {
            if ((req && !req.body.files) || req.body.files.length < 1) {
                throw new Error('File is required.')
            }

            console.log(req)
                // message: `Hi ${req.body.username}!`

            console.log('res null? ' + res)
            console.log(typeof (res))
            res.json(res)
        } catch (error) {
            res.status(500).send({
                error: error.message
            })
        }
    },
    download (req, res) {
        if (!req.files) {
            return res.status(500).send({
                error: 'File is not found. '
            })
        }

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
    }
}
