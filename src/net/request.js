import axios from "./myAxios";

export default (data) => {
    const method = data.method
    const url = data.url
    const callback = data.callback

    data.params = data.params || {}
    // data.params.httpRequestIndex = data.params.httpRequestIndex == undefined ? 0 : data.params.httpRequestIndex;
    // data.params.httpRequestCount = data.params.httpRequestCount || 0;

    return  axios[method?method:'post'](url, data.params).then(res => {
        callback && callback(res.data)
        return Promise.resolve(res.data)
    });
}