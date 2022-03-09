import axios from 'axios';

const req = function (url, params, type) {
    return new Promise((resolve, reject) => {
        axios.request({
            url: url,
            method: type,
            data: params,
            timeout: 1000 * 60
        }).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject(err)
        });
    });
}
export default req