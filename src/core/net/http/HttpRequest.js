import { Logger } from "../../debug/Logger";
import EventDispatcher from "../../event/EventDispatcher";

export default class HttpRequest extends EventDispatcher{
    static EVENT_COMPLETE = "complete";
    static EVENT_ERROR = "error";

    _http = new XMLHttpRequest();
    _data;
    _url;
    _responseType;
    _startTime = 0;
    _endTime = 0;

    _timeOut;
    isError = false;

    get data(){
        return this._data;
    }
    get url(){
        return this._url;
    }

    send(serverUrl,data = null,method = "get",responseType = "text",headers = null){
        this._responseType = responseType;
        this._data = null;
        let url = "";
        let requestInfo = Global.DNS.getHttpRequestDNSInfo(serverUrl,0);
        let requestHeaderMap = {};
        if(requestInfo != null && requestInfo.headerMap != null){
            url = requestInfo.realUrl;
            let headerMap = requestInfo.headerMap;
            if(headerMap != null){
                if(Global.Http.cookie){
                    headerMap["Cookie"] = Global.Http.cookie;
                }
                let headerStr = JSON.stringify(headerMap);
                Logger.error("header is !!",headerStr);
                for(let key in headerMap){
                    let value = headerMap[key];
                    requestHeaderMap[key] = value;
                }
            }
        }else{
            if(Global.Http.cookie){
                let headerMap = {"Cookie":Global.Http.cookie};
                // let headerStr = JSON.stringify(headerMap);
                Logger.error("header 2 is !!!!", headerStr);
                // Global.NativeEvent.setRequestProperty(headerStr);

                for (let key in headerMap){
                    let value = headerMap[key]
                    // this._http.setRequestHeader(key,value)
                    requestHeaderMap[key] = value;
                }
            }
        }
        let headSign = null;
        let sign_url = null;
        if(serverUrl.isInnerRequest){
            let httpSignInfo = Global.UrlUtil.dealHttpSign(serverUrl);
            headSign = httpSignInfo.headSign;
            sign_url = httpSignInfo.sign_url;
        }else{
            sign_url = serverUrl.getUrl()
        }

        if(!sign_url){
            Logger.error("http send sign_url error " + sign_url);
            return;
        }
        url = sign_url
        this._url = sign_url;
        let http = this._http;

        http.open(method,url,true);

        if(headers && headers.length > 0){          //如果header不为空,则将这些字段设置到请求头部去
            for(let i = 0; i < headers.length; i++){
                // http.setRequestHeader(headers[i++],headers[i]);
                let key = headers[i++]
                let value = headers[i]
                requestHeaderMap[key] = value;
            }
        }else{
            // http.setRequestHeader("Content-Type","text/plain");
            requestHeaderMap["Content-Type"] = "text/plain";
        }

        if(!Helper.isWeb() && headSign){      //原生设置Summor字段
            // http.setRequestHeader("Summor", headSign);
            requestHeaderMap["Summor"] = headSign;
        }
        requestHeaderMap["data"] = data
        if(Helper.isIos() || (Helper.isAndroid() && Helper.checkVersionSupport(50000))){
            requestHeaderMap["url"] = sign_url
        }
        
        let requestHeaderMapStr = JSON.stringify(requestHeaderMap);
        // Logger.error("requestHeaderMap !!!!", requestHeaderMapStr);
        Global.NativeEvent.setRequestProperty(requestHeaderMapStr);

        http.responseType = responseType !== "arraybuffer" ? "text" : "arraybuffer";
        http.onreadystatechange = this.onReadyStateChange.bind(this);

        http.send(data);
        

        http.onerror = (e) => {
            this.onError("onerror " + "[" + this._http.status + "]" + this._http.statusText + ":" + this._http.responseURL);
        }

        this._startTime = new Date().valueOf();

        http.ontimeout = (e) => { this.httpEvent("ontimeout",e) }
    }

    setTimeout(timeout){
        this.clearTimer();
        if(this._http){
            this._http.timeout = timeout;
            this._timeOut = setTimeout(() => {
                this.onError("request timeout" + 0)
            },timeout)
        }
    }

    clearTimer(){
        if(this._timeOut){
            clearTimeout(this._timeOut);
            this._timeOut = null;
        }
    }

    httpEvent(type,event){
        Logger.error(type,event);
        this.onError("request timeout" + 0);
    }

    onReadyStateChange(){
        if(this._http.readyState == 4){
            this._endTime = new Date().valueOf();
            this.clearTimer();
            if(this._http.status >= 200 && this._http.status < 300){
                this.onComplete();
            }else{
                this.onError("onReadyStateChange " + "[" + this._http.status + "]" + this._http.statusText + ":" + this._http.responseURL);
            }
        }
    }

    onError(content){
        this.clearTimer();
        this._endTime = new Date().valueOf();
        Logger.error("onError():" + content, this._url);
        if(this.isError){
            return;
        }
        this.isError = true;
        let hTime = this._endTime - this._startTime;
        this.event(HttpRequest.EVENT_ERROR,this._http,hTime);
        this.clear();
    }

    onComplete(){
        this.clearTimer();
        let flag = true;
        try {
            if(this._responseType === "json"){
                this._data = JSON.parse(this._http.responseText);
            }else{
                this._data = this._http.response || this._http.responseText;
            }
        } catch (error) {
            flag = false;
            this.onError(error);
        }
        flag && this.event(HttpRequest.EVENT_COMPLETE, this._data instanceof Array ? [this._data] : this._data);
        this.clear();
    }

    clear(){
        this._http.onReadyStateChange = null;
        this.offAll("");
    }
}