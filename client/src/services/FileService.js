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
          throw new Error('API call failed. ' + error.message)
        })
    },
    upload (data, config) {
        return Api().post('upload', data, config).then((response) => {
        // return Api().post('preUpload', data, config).then((response) => {
            // return Api().post('upload', response.data.data, response.data.config).then((uploadResponse) => {
            //    return uploadResponse.data
            // })
            return response.data
        }).catch((error) => {
          throw new Error('API call failed. ' + error.message)
        })
    },
    download (data, config) {
        return Api().post('download', { requestedFile: data }).then((response) => {
            return response.data
        }).catch((error) => {
          throw new Error('API call failed. ' + error.message)
        })
    },
    fetchAllFiles () {
        return Api().get('fetchAllFiles').then((response) => {
            return response.data
        }).catch((error) => {
          throw new Error('API call failed. ' + error.message)
        })
    }
}
