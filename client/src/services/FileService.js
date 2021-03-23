import Api from '@/services/Api'

export default {
    upload (files, config) {
        return Api().post('upload', files, config).then((response) => {
            return response.data
        }).catch((error) => {
          throw new Error('API call failed. ' + error.message)
        })
    }
}
