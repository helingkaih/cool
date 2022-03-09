import axios from 'axios';
import { Base64 } from "js-base64";
axios.defaults.withCredentials = true;
/**
 * ���󷽷�
 * @param {*} fun ��������
 * @param {*} params ����
 * @param {*} type ��������
 * @param {*} url fun �Ƿ��Ǹ�url
 * @param {*} withoutCookies ����Ҫ cookies
 * @returns 
 */

const req = function (fun, params, type, isurl, withoutCookies) {
    // �����Ƿ���ҪЯ�� cookie Ĭ����Я����
    if (withoutCookies) {
        axios.defaults.withCredentials = false;
    } else {
        axios.defaults.withCredentials = true;
    }
    // http://helingkai.com:3000/api/
    // /3000/api/
    return new Promise((resolve, reject) => {
        axios.request({
            url: isurl ? fun : (process.env.NODE_ENV === "development" ? 'http://127.0.0.1:3000/' : '/api/') + fun,
            method: type,
            data: Base64.encode(JSON.stringify(params)),
            timeout: 1000 * 60
        }).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject(err)
        });
    });
}
export default req