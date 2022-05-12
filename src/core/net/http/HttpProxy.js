import ReportKey from "../../const/ReportKey";
import { Logger } from "../../debug/Logger";
import Global from "../../Global";
import { ServerUrl } from "../route/ServerRoutes";
import HttpRequest from "./HttpRequest";

let HttpTimer = null;

export class ParallelReqInfo{
    isReq = false;
    isRsp = false
    isReport = false;
    reqLines = [];
}

export class ParallelReqLine{
    lineIndex = 0;
    repFlag = 0;// 0 未回复，1为有回包 2 为没回包
    startTime = 0;
    endTime = 0;
    reqTime = 0;
    host = ""
    url = ""
}

export default class HttpProxy{
    static Interval = 20;   //轮询时间间隔
    static HttpTimeout = 15000;
    //异常弹窗
    static erroDialog = false;
    cookie = "";
    reqList = [];
    //并发请求key
    parallelReqKey = {};
    //全局定时器
    timerMap;

    constructor(){
        if(HttpTimer){
            HttpTimer = null;
        }
        // HttpTimer = setInterval(()=>{
        //     this.startPolling();
        //     this.onUpdate();
        // },HttpProxy.Interval)
        this.parallelReqKey["checkversion"] = new ParallelReqInfo();
        this.parallelReqKey["heartbeat"] = new ParallelReqInfo();
    }

    //注册全局定时回调函数
    onRegister(type,updateFunc){
        if(!this.timerMap){
            this.timerMap = {};
        }
        if(this.timerMap[type]){
            Logger.error("timerFunc is Already exist")
            return;
        }else{
            this.timerMap[type] = {
                "onUpdate":updateFunc,
                "typs":type
            }
        }
    }

    //反注册全局定时回调函数
    unRegister(type){
        if(this.timerMap[type]){
            this.timerMap[type] = null;
            delete this.timerMap[key];
        }
    }

    onUpdate(){
        if(this.timerMap === {}){
            return;
        }else{
            for(let key in this.timerMap){
                let item = this.timerMap[key];
                if(item && item["onUpdate"] && item["onUpdate"] instanceof Function){
                    let callBack = item["onUpdate"];
                    callBack(HttpProxy.Interval/1000);
                }
            }
        }
    }
    
    startPolling(){
        let reqModel = this.reqList.shift();
        if(reqModel){
            let url = reqModel["url"];
            let msg = reqModel["msg"];
            let reqType = reqModel["reqType"];
            let onComplete = reqModel["onComplete"];
            let onError = reqModel["onError"];
            let timeout = reqModel["timeout"];
            let req = new HttpRequest();
            req.on(HttpRequest.EVENT_COMPLETE, this, onComplete);
            req.on(HttpRequest.EVENT_ERROR, this, onError);
            req.setTimeout(timeout);
            Logger.log("Send HallMSG:",msg,url.getUrl());
            msg == msg ? msg : "";
            let encrptedMsg = msg;
            if(url.isEncrptParam && msg){
                encrptedMsg = Global.AESUtil.aesEncrptMsg(msg);
            }
            req.send(url,encrptedMsg,reqType);
        }
    }

    get(url,onComplete,onError = null,param = null){
        if(onComplete && ! onComplete instanceof Function){
            Logger.error("onComplete is not a Function",onComplete);
            return;
        }
        if(onError && ! onError instanceof Function){
            Logger.error("onError is not a Function",onError);
            return;
        }
        let msg = this.getSendContent(param);
        let serverUrl = new ServerUrl();
        serverUrl.parse(url);
        this.pushReqListModel(serverUrl,msg,"get",onComplete,(htpp,hTime) => {
            this.getError(http,serverUrl,onError,hTime);
        },HttpProxy.HttpTimeout)
    }

    getError(http,url,onError,hTime){
        this.onHttpError(http,url,hTime);
        if(onError){
            onError()
            onError = null;
        }
    }

    pushReqListModel(url,msg,reqType,onComplete,onError,timeout){
        let reqModel = {};
        reqModel["url"] = url;
        reqModel["msg"] = msg;
        reqModel["reqType"] = reqType;
        reqModel["onComplete"] = (msg) => {
            //上报类 标注成功
            // Global.ReportTool.markSuccess(url);
            if(onComplete){
                onComplete(msg);
            }
        }
        reqModel["onError"] = onError;
        reqModel["timeout"] = timeout;
        this.reqList[this.reqList.length] = reqModel;
        Logger.log("reqList length = " + this.reqList.length)
    }

    send(url,param,onComplete,onError){
        let msg = this.getSendContent(param);
        this.pushReqListModel(url,msg,"post",onComplete,(http,hTime) => {
            this.sendError(http,url,onError,hTime);
        },HttpProxy.HttpTimeout);
    }

    sendError(http,url,onError,hTime = 0){
        this.onHttpError(http,url,hTime);
        if(onError){
            onError();
            onError = null;
        }
    }

    getWithRetry(url,onComplete,onError = null,param = null,retryTime = 0){
        if(onComplete && ! onComplete instanceof Function){
            Logger.error("onComplete is not a Function",onComplete);
            return;
        }
        if(onError && ! onError instanceof Function){
            Logger.error("onError is not a Function",onError);
            return;
        }
        let msg = this.getSendContent(param);
        let serverUrl = new ServerUrl();
        serverUrl.parse(url);
        this.pushReqListModel(serverUrl,msg,"get",onComplete,(http,hTime) => {
            this.getWithRetryError(http,serverUrl,onError,hTime);
        },HttpProxy.HttpTimeout)
    }

    getWithRetryError(http,url,onError,hTime){
        this.onHttpError(http,url,hTime);
        if(onError){
            onError();
            onError = null;
        }
    }

    //直接请求 不使用自定义httpdns
    requestDirect(url,onComplete,onError = null,type = "get",param = null,timeout = 15000){
        if(onComplete && ! onComplete instanceof Function){
            Logger.error("onComplete is not a Function",onComplete);
            return;
        }
        if(onError && ! onError instanceof Function){
            Logger.error("onError is not a Function",onError);
            return;
        }
        let msg = this.getSendContent(param);
        let serverUrl = new ServerUrl();
        serverUrl.parse(url);
        serverUrl.isInnerRequest = false;
        this.pushReqListModel(serverUrl,msg,"get",onComplete,(http,hTime) => {
            this.requestDirectError(http, serverUrl,onError,hTime)
        },timeout)
    }

    requestDirectError(http,url,onError,hTime){
        this.onHttpError(http,url,hTime);
        if(onError){
            onError();
            onError = null;
        }
    }

    onHttpError(http,serverUrl,hTime){
        //上报错误码/提示
        Logger.error("onHttpError",http,serverUrl,hTime)
        if(!http || !serverUrl){
            Logger.error("onHttpError http  || url = null");
            return;
        }
        let httpStatus = http.status;
        let httpBody = http.response || http.responseText;
        let reqUrl = serverUrl.getUrl();
        let realHost = serverUrl.realHost;
        let addrHost = serverUrl.addressHost;

        if(Global.ReportTool.isReportUrl(serverUrl)){
            Logger.error("isReportUrl !!!!");
            return;
        }

        let reportSignUrl = "";
        if(serverUrl.isInnerRequest){
            let httpSignInfo = Global.UrlUtil.dealHttpSign(serverUrl);
            reportSignUrl = httpSignInfo.sign_url;
        }else{
            reportSignUrl = serverUrl.getUrl();
        } 
        let reportParam = { "error_code":httpStatus,"body":httpBody,"url":reportSignUrl,"htime":hTime,"host":realHost,"addrHost":addrHost };
        let reportKey = ReportKey.REPORT_TYPE_HTTP_ERROR;
        //上报错误
        let sceneName = '';
        if(this._checkIsDataUrl(realHost)){
            sceneName = 'D';
            reportKey = ReportKey.REPORT_TYPE_DATA_ERROR;
        }else if(reqUrl.indexOf("login") > -1){
            sceneName = 'L';
            reportKey = ReportKey.REPORT_TYPE_LOGIN;
        }else if(reqUrl.indexOf("checkversion") > -1){
            sceneName = 'C';
            reportKey = ReportKey.REPORT_TYPE_CHECKVERSION_ERROR;
        }
        // else if(reqUrl.indexOf("httpdns") > -1){
        //     reportKey = ReportKey.REPORT_TYPE_HTTPDNS_ERROR;
        // }
        let needReload = false;
        if(!this._isHostWithNoTips(reqUrl, httpStatus)){
            if(window.DialogBox && !Global.Http.erroDialog){
                Global.Http.erroDialog = true;
                // window.DialogBox({
                //     title:"提示",
                //     content:`网络异常：H-${sceneName} ${httpStatus}`,
                //     confirmFunc:()=>{
                //         Global.Http.erroDialog = false;
                //     }
                // })
            }
        }
        //重定向
        if(httpStatus == 308 || httpStatus == 307 || httpStatus == 302){
            let cookie = http.getResponseHeader("Set-Cookie");
            if(cookie){
                Logger.error("httpStatus " + httpStatus)
                Logger.error("307 cookie = " + cookie)
                let cookieStrArray = cookie.split(";");
                if(cookieStrArray && cookieStrArray.length > 0){
                    let cookieStr = cookieStrArray[0];
                    if(cookieStr && cookieStr.length > 0){
                        cookieStr = cookieStr.trim();
                        this.cookie = cookieStr
                        Logger.error("307 set cookie = " + this.cookie)
                    }
                }
            }
        }else{
            Global.ReportTool.ReportClientError(reportKey,reportParam);
        }
        Global.ReportTool.markFailed(serverUrl,httpStatus);
        return needReload;
    }

    //判断链接是否是dataUrl
    _checkIsDataUrl(url){
        if(!url){
            return false;
        }
        let dataList = Global.Setting.dataUrlsList;
        if(!dataList){
            return false;
        }
        for(let i = 0;i < dataList.length;i++){
            if(dataList[i].indexOf(url) > -1){
                return true;
            }
        }
        return false;
    }

    //过滤不需要弹tips错误的域名
    _isHostWithNoTips(url,httpStatus){
        if(httpStatus == 0 || httpStatus == 307 || httpStatus == 302){
            return true;
        }
        if(url){
            if(url.indexOf("httpdns") > -1 || url.indexOf("ip.360.cn") > -1){
                return true;
            }
        }
        return false;
    }

    getSendContent(param){
        if(param == null || param == ""){
            return null;
        }
        if(typeof (param) == "string"){
            return param;
        }
        return JSON.stringify(param);
    }
}