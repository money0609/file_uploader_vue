import axios from 'axios'

export default (optionalConfig) => {
    let config = {
        baseURL: `https://fileuploadercloud-server.herokuapp.com/`
    }

    if (optionalConfig) {
        for (var key in optionalConfig) {
            if (optionalConfig.hasOwnProperty(key)) {
                config[key] = optionalConfig[key]
            }
        }
    }
    console.log('Api: ' + JSON.stringify(config))
    return axios.create(config)
}
