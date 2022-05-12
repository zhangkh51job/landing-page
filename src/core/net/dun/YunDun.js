import StorageKey from "../../const/StorageKey";
import Global from "../../Global";
import { DUNSTATE, DUNTYPE } from "./AppDunControl";

export default class YuunDun {
    isDunInit = false;
    _isSupport = false;
    sdkName = "yundun";
    _dunType = 0;

    constructor(dunType){
        this._dunType = dunType;
        // Global.NativeEvent.isSupportSDK(this.sdkName, null, (retObj) => {
        //     if (retObj.result == 0) {
                this._isSupport = true;
            // } else {
                Logger.error("checkAppIsSupportDunByType dunTyp = " + dunType + " isSupport = false")
            // }
        // })
    }

    isAppSupport(){
        return this._isSupport;
    }

    checkCfgIsValid(cfg){
        if(cfg && cfg.accessKey && cfg.uuid){
            return true;
        }
        return false;
    }

    //异步初始化
    init(cfg,callback = null){
        Logger.error("init YunDun SDK")
        if(!this.checkCfgIsValid(cfg)){
            Logger.error("init YunDun SDK checkCfgIsValid  = false")
            return;
        }
        if(this.isDunInit){
            Logger.error("init YunDun SDK this.isTDunInit  = true")
            return;
        }
        let initState = this.getInitState()
        Logger.error("init YunDun SDK state = " + initState)
        let accessKey = cfg.accessKey
        let uuid = cfg.uuid
        if((initState == DUNSTATE.INIT) && accessKey && uuid){
            Logger.error("initYunDunSDK")
            Global.NativeEvent.initYunDunSDK(accessKey, uuid, (retObj) => {
                Logger.error("initYunDunSDK ret = " + JSON.stringify(retObj))
                if(retObj){
                    let result = Number(retObj.result);
                    if(result == 0 || result == 0.0){
                        this.isDunInit = true;
                        localStorage.setItem(StorageKey.DunInitRecord + "_" + DUNTYPE.YUN_DUN,1);
                        Logger.error("initYunDunSDK ret = 0 success ")
                    }else{
                        Logger.error("initYunDunSDK ret != 0 failed ")
                        //上报错误(top)
                        let reportParam = { "result": "ret != 0 " + result, "type":DUNTYPE.YUN_DUN };
                        // Global.ReportTool.ReportClientError(ReportKey.REPORT_TYPE_INIT_DUN_ERROR,reportParam);
                        //上报错误(sentry)
                        // let msgRet = "initYunDunSDK ret != 0 failed ";
                        // errorReport.senTryReport(new Error(msgRet),errType.FATAL,msgRet,"initYunDunFaild",null);
                    }
                }else{
                    Logger.error("initYunDunSDK retObj == null failed ");
                    //上报错误(top)
                    let reportParam = { "result": "initYunDunSDK retObj == null failed", "type": DUNTYPE.YUN_DUN };
                    // Global.ReportTool.ReportClientError(ReportKey.REPORT_TYPE_INIT_DUN_ERROR,reportParam);
                    //上报错误(sentry)
                    // let msg = "initYunDunSDK retObj == null failed";
                    // errorReport.senTryReport(new Error(msg),errType.FATAL,msg,"initYunDunFaild",null);
                }

                if(callback){
                    callback()
                }
            })
        }
    }

    //获取初始化状态
    isInit(){
        if(!this.isDunInit){
            let ret = this.getInitState();
            if(ret == 0){
                this.isDunInit = true;
            }
        }
        return this.isDunInit;
    }

    getInitState(){
        let ret = Global.NativeEvent.getYunDunInitRet();
        return ret;
    }

    getServerIPAndPort(host,port,attr){
        if(!this.isDunInit){
            Logger.error("YunDun getServerIPAndPort isDunInit = false")
            return;
        }
        let serverIPAndPortJson = Global.NativeEvent.getYunDunServerIPAndPort(host, port);
        if(serverIPAndPortJson){
            Logger.error("getServerIPAndPort serverIPAndPortJson = " + serverIPAndPortJson)
            let serverIPAndPort = JSON.parse(serverIPAndPortJson);
            if(serverIPAndPort){
                if(serverIPAndPort.result != null && (serverIPAndPort.result == 0 || serverIPAndPort.result == 0.0) && serverIPAndPort.serverIp && serverIPAndPort.serverPort){
                    let ipPortObj = {"ip":serverIPAndPort.serverIp,"port":serverIPAndPort.serverPort}
                    return ipPortObj
                }
            }
        }else{
            Logger.error("getServerIPAndPort serverIPAndPortJson = null" )
        }
        return null;
    }
}