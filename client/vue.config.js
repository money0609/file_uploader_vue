const path = require('path')

module.exports = {
    devServer: {
        outputDir: path.resolve(__dirname, '../server/pulic'),
        proxy: {
            '/': {
                target: 'http://localhost: 8080'
            }
        }
    }
  }