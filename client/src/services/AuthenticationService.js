import Api from '@/services/Api'

export default {
    register (username) {
        return Api().post('register', username)
    }
}
