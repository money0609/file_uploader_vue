module.exports = {
    register (req, res) {
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
