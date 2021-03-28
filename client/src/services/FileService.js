import Api from '@/services/Api'

export default {
    preUpload (data) {
        // return Api().post('upload', data, config).then((response) => {

        return Api().post('preUpload', data).then((response) => {
            // return Api().post('upload', response.data.data, response.data.config).then((uploadResponse) => {
            //    return uploadResponse.data
            // })
            return response.data
        }).catch((error) => {
            if (error.response) {
                throw new Error('PreUpload API call failed. ' + error.response.data)
            }

            throw new Error('PreUpload API call failed.')
        })
    },
    upload (data, config) {
        return Api().post('upload', data, config).then((response) => {
            return response.data
        }).catch((error) => {
            if (error.response) {
                throw new Error('Upload API call failed. ' + error.response.data)
            }

            throw new Error('Upload API call failed.')
        })
    },
    download (data, config) {
        return Api({
            responseType: 'arraybuffer'
        }).get('download?fileId=' + data._id).then((response) => {
            return response.data
        }).catch((error) => {
            if (error.response) {
                throw new Error('Download API call failed. ' + error.response.data)
            }

            throw new Error('Download API call failed.')
        })
    },
    fetchAllFiles () {
        return Api().get('fetchAllFiles').then((response) => {
            return response.data
        }).catch((error) => {
            if (error.response) {
                throw new Error('Fetch all files API call failed. ' + error.response.data)
            }

            throw new Error('Fetch all files API call failed.')
        })
    },
    getFileById (data) {
        return Api({
            responseType: 'arraybuffer'
        }).get('getFileById?fileId=' + data._id).then((response) => {
            return response.data
        }).catch((error) => {
            if (error.response) {
                throw new Error('Download API call failed. ' + error.response.data)
            }

            throw new Error('Download API call failed.')
        })
    }
}
