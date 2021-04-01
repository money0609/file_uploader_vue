import axios from 'axios'

export default (optionalConfig) => {
    let config = {
        baseURL: `http://localhost:8081`
    }

    if (optionalConfig) {
        for (var key in optionalConfig) {
            if (optionalConfig.hasOwnProperty(key)) {
                config[key] = optionalConfig[key]
            }
        }
    }

    return axios.create(config)
}
