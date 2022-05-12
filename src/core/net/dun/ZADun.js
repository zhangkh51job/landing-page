import ReportKey from "../../const/ReportKey";
import StorageKey from "../../const/StorageKey";
import Global from "../../Global";
import { DUNSTATE, DUNTYPE } from "./AppDunControl";

export default class ZADun{
    isDunInit = false;
    _isSupport = false;
    sdkName = "zadun";
    _dunType = 0;

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
        if(cfg && cfg.keys){
            return true;
        }
        return false;
    }

    //异步初始化
    init(cfg,callback = null){
        Logger.error("init ZADun SDK");
        if(!this.checkCfgIsValid(cfg)){
            Logger.error("init ZADun SDK checkCfgIsValid  = false")
            return;
        }
        if(this.isDunInit){
            Logger.error("init ZADun SDK this.isTDunInit  = true")
            return;
        }
        if(!this._isSupport){
            Logger.error("init ZADun SDK is not support")
            return;
        }
        let initState = this.getInitState();
        Logger.error("init ZADun SDK state = " + initState)
        let zaDunkey = cfg.key2;
        if(initState == DUNSTATE.INIT){
            if(zaDunkey){
                Global.NativeEvent.initZADunSDK(zaDunkey, (retObj) => {
                    if(retObj){
                        let result = Number(retObj.result);
                        if(result == 0 || result == 0.0){
                            this.isDunInit = true;
                            localStorage.setItem(StorageKey.DunInitRecord + "_" + DUNTYPE.ZA_DUN,1);
                            Logger.error("initZADunSDK ret = 0 success ")
                        }else{
                            Logger.error("initZADunSDK ret != 0 failed ");
                            //上报错误(top)
                            let funcParam = retObj.funcParam ? retObj.funcParam: "";
                            let reportParam = { "result": "ret != 0 " + result ,"type":DUNTYPE.ZA_DUN,"error_msg":funcParam };
                            // Global.ReportTool.ReportClientError(ReportKey.REPORT_TYPE_INIT_DUN_ERROR,reportParam);
                            //上报错误(sentry)
                            // let msgRet = "initZADunSDK ret != 0 failed /" + funcParam;
                            // errorReport.senTryReport(new Error(msgRet),errType.FATAL,"initZADunFaild",null); 
                        }
                    }else{
                        Logger.error("initZADunSDK retObj == null failed ");
                        //上报错误(top)
                        let reportParam = { "result": "initZADunSDK retObj == null failed" ,"type":DUNTYPE.ZA_DUN };
                        // Global.ReportTool.ReportClientError(ReportKey.REPORT_TYPE_INIT_DUN_ERROR,reportParam);
                        //上报错误(sentry)
                        // let msg = "initZADunSDK retObj == null failed ";
                        // errorReport.senTryReport(new Error(msg),errType.FATAL,"initZADunFaild",null);
                    }
                    if(callback){
                        callback()
                    }
                })
            }
        }
    }

    getInitState(){
        if(!this._isSupport){
            return DUNSTATE.FAILED;
        }
        let ret = Global.NativeEvent.getZADunInitRet();
        return ret;
    }

    getPort(lo_port){
        //后续App添加了单独获取port方法
        let port = 0;
        port = Global.NativeEvent.getZADunPortByAddr("",lo_port);
        Logger.error("ZADun getPort lo_port ,port " , lo_port,port)
        return port;
    }

    getServerIPAndPort(host,lo_port,attr){
        if(!this.isDunInit){
            Logger.error("ZADun getServerIPAndPort isDunInit = false")
            return;
        }
        let ip = "127.0.0.1"
        let port = this.getPort(lo_port);
        return {"ip":ip,"port":port}
    }

    isInit(){
        if(!this._isSupport){
            return false;
        }
        if(!this.isDunInit){
            let ret = this.getInitState();
            if(ret == 0){
                this.isDunInit = true;
            }
        }
        return this.isDunInit;
    }
}