import StorageKey from "../../const/StorageKey";
import Global from "../../Global";
import { DUNSTATE, DUNTYPE } from "./AppDunControl";

export default class AliDun {
    isDunInit = false;
    _isSupport = false;
    sdkName = "alidun"
    _dunType = 0;
    _group = null;

    constructor(dunType){
        this._dunType = dunType;
        // Global.NativeEvent.isSupportSDK(this.sdkName, null, (retObj) => {
        //     if (retObj.result == 0) {
                this._isSupport = true;
            // } else {
                Logger.error("checkAppIsSupportDunByType dunType = " + dunType + " isSupport = false")
            // }
        // })
    }

    isAppSupport(){
        return this._isSupport;
    }

    checkCfgIsValid(cfg){
        if(cfg){
            if(cfg.group){
                this._group = cfg.group
                Logger.error("checkCfgIsValid set group " + this._group)
            }else{
                Logger.error("checkCfgIsValid set group = null")
            }
            if(cfg.dip){
                this._dip = cfg.dip
                Logger.error("checkCfgIsValid set dip " + this._dip)
            }else{
                Logger.error("checkCfgIsValid set dip = null")
            }
        }
        if(Helper.isAndroid()){
            if(cfg && cfg.android){
                return true;
            }
        }else if(Helper.isIos()){
            if(cfg && cfg.ios){
                return true;
            }
        }
        return false;
    }

    getCfgAppKey(cfg){
        if(Helper.isAndroid()){
            if(cfg && cfg.android){
                return cfg.android;
            }
        }else if(Helper.isIos()){
            if(cfg && cfg.ios){
                return cfg.ios;
            }
        }
    }

    //异步初始化
    init(cfg,callback = null){
        Logger.error("init AliDun SDK")
        if(!this.checkCfgIsValid(cfg)){
            Logger.error("init AliDun SDK checkCfgIsValid  = false")
            return;
        }
        if(this.isDunInit){
            Logger.error("init AliDun SDK this.isTDunInit  = true")
            return;
        }
        let initState = this.getInitState();
        Logger.error("init AliDun SDK state = " + initState)
        let appKey = this.getCfgAppKey(cfg);
        let token = this.getToken();
        if((initState == DUNSTATE.INIT) && appKey && token){
            Logger.error("initAliDunSDK")
            Global.NativeEvent.initAliDunSDK(appkey, token, (retObj) => {
                Logger.error("initAliDunSDK ret = " + JSON.stringify(retObj))
                if(retObj){
                    let result = Number(retObj.result);
                    if(result == 0 || result == 0.0){
                        this.isDunInit = true;
                        localStorage.setItem(StorageKey.DunInitRecord + "_" + DUNTYPE.Ali_DUN,1);
                        Logger.error("initAliDunSDK ret = 0 success ")
                    }else{
                        Logger.error("initAliDunSDK ret != 0 failed ")
                        //上报错误(top)
                        let reportParam = { "result": "ret != 0 " + result, "type":DUNTYPE.Ali_DUN };
                        // Global.ReportTool.ReportClientError(ReportKey.REPORT_TYPE_INIT_DUN_ERROR,reportParam);
                        //上报错误(sentry)
                        // let msgRet = "initAliDunSDK ret != 0 failed ";
                        // errorReport.senTryReport(new Error(msgRet),errType.FATAL,msgRet,"initAliDunFaild",null);
                    }
                }else{
                    Logger.error("initAliDunSDK retObj == null failed ")
                    //上报错误(top)
                    let reportParam = { "result": "initAliDunSDK retObj == null failed", "type":DUNTYPE.Ali_DUN };
                    // Global.ReportTool.ReportClientError(ReportKey.REPORT_TYPE_INIT_DUN_ERROR,reportParam);
                    //上报错误(sentry)
                    // let msg = "initAliDunSDK retObj == null failed";
                    // errorReport.senTryReport(new Error(msg),errType.FATAL,msg,"initAliDunFaild",null);
                }
                if(callback){
                    callback()
                }
            })
        }else{
            Logger.error("initAliDunSDK failed " ,initState ,appkey,token)
        }
    }

    getToken(){
        let uid = Number(Global.Setting.storage.get(StorageKey.Uid)) || 0;
        let token = uid ? uid.toString() : "token";
        return token;
    }

    //获取初始化状态
    isInit(){
        if(!this.isDunInit){
            let ret = this.getInitState();
            if(ret == 0){
                this.isDunInit = true
            }
        }
        return this.isDunInit;
    }

    getInitState(){
        let ret = Global.NativeEvent.getAliDunInitRet();
        return ret;
    }

    getServerIPAndPort(host,port,attr){
        if(!this.isDunInit){
            Logger.error("AliDun getServerIPAndPort isDunInit = false")
            return;
        }
        let hostInfo = {};
        hostInfo["token"] = this.getToken();
        let group = this._group;
        let dip = this._dip;
        if(attr){
            Logger.error("AliDun getServerIPAndPort set attr param")
            if(attr.group){
                group = attr.group;
                Logger.error("AliDun getServerIPAndPort set group " + group)
            }else{
                Logger.error("AliDun getServerIPAndPort set group = null" )
            }
            if(attr.dip){
                dip = attr.dip
                Logger.error("AliDun getServerIPAndPort set dip " + dip)
            }else{
                Logger.error("AliDun getServerIPAndPort set dip = null" )
            }
        }
        if(!group || !dip){
            Logger.error("AliDun getServerIPAndPort group == null  or dip == null")
            return;
        }
        hostInfo["groupName"] = group;
        hostInfo["domainName"] = dip;

        let serverIPAndPortJson = Global.NativeEvent.getAliDunPort(hostInfo, port);
        if(serverIPAndPortJson){
            Logger.error("getServerIPAndPort serverIPAndPortJson = " + serverIPAndPortJson)
            let serverIPAndPort = JSON.parse(serverIPAndPortJson);
            if(serverIPAndPort){
                if(serverIPAndPort.result != null && (serverIPAndPort.result == 0 || serverIPAndPort.result == 0.0) && serverIPAndPort.serverIp && serverIPAndPort.serverPort){
                    let ipPortObj = {"ip":serverIPAndPort.serverIp,"port":Number(serverIPAndPort.serverPort)}
                    return ipPortObj;
                }
            }else{
                Logger.error("getServerIPAndPort serverIPAndPort json error")
            }
        }else{
            Logger.error("getServerIPAndPort serverIPAndPortJson = null" )
        }
        return null;
    }
}