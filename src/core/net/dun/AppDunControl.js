import StorageKey from "../../const/StorageKey";
import { Logger } from "../../debug/Logger";
import Global from "../../Global";
import AliDun from "./AliDun";
import YuunDun from "./YunDun";
import ZADun from "./ZADun";

export const DUNTYPE = {
    None : 0,       //无盾
    YUN_DUN : 2,    //云盾
    ZA_DUN : 3,     //ZA盾
    Ali_DUN : 4     //阿里云游戏盾
}

export const DUNSTATE = {
    INIT : 10000,
    LOADING : 10001,
    SUCCESS : 0,
    FAILED : -1
}

export default class AppDunControl{
    DUNConfig;
    //云盾
    yunDun;
    //ZA盾
    zaDun;
    //阿里云游戏盾
    aliDun;

    init() {
        //初始化盾配置
        this.loadDunConfig();
        //初始化盾类
        this.initDun();
    }

    //设置盾配置
    setDunConfig(cfg){
        if(cfg == null && cfg.type == null){
            return;
        }
        Global.Setting.storage.setObject(StorageKey.DunConfig,cfg);
    }

    //加载盾配置
    loadDunConfig(){
        let cfg = Global.Setting.storage.getObject(StorageKey.DunConfig);
        if(cfg == null){
            Logger.error("loadDunConfig cfg = null")
            return;
        }
        this.DUNConfig = cfg;
    }

    initDun(){
        this.yunDun = new YuunDun(DUNTYPE.YUN_DUN);
        this.zaDun = new ZADun(DUNTYPE.ZA_DUN);
        this.aliDun = new AliDun(DUNTYPE.Ali_DUN);
        //上次盾有没有启动成功记录，有的话则优先启动
        if(this.DUNConfig){
            this.initDunSDKByStorage(DUNTYPE.YUN_DUN);
            this.initDunSDKByStorage(DUNTYPE.ZA_DUN);
            this.initDunSDKByStorage(DUNTYPE.Ali_DUN)
        }
    }

    initDunSDKByStorage(dunType){
        let dunInitRecord = Global.Setting.storage.get(StorageKey.DunInitRecord + "_" + dunType);
        if(dunInitRecord){
            this.initDunSDK(dunType)
        }
    }

    initDunSDK(dunType){
        if(!dunType){
            Logger.log("initDunSDK dunType == null")
            return;
        }
        let isSupport = this.checkAppIsSupportDunByType(dunType);
        if(!isSupport){
            Logger.log("initDunSDK App is not Support dunType =" + dunType)
            return;
        }
        if(!this.DUNConfig){
            Logger.log("initDunSDK this.DUNConifg == null")
            this.loadDunConfig();
            if(!this.DUNConfig){
                Logger.log("initDunSDK loadDunConfig DUNConifg == null")
                return;
            }
        }
        let dunObj = null;
        let dunConfig = null;
        switch(dunType){
            case DUNTYPE.YUN_DUN:
                dunObj = this.yunDun;
                dunConfig = this.DUNConfig.yundun;
                break;
            case DUNTYPE.ZA_DUN:
                dunObj = this.zaDun;
                dunConfig = this.DUNConfig.zaDun;
                break;
            case DUNTYPE.Ali_DUN:
                dunObj = this.aliDun;
                dunConfig = this.DUNConfig.alidun;
                break;
            default:
                break;
        }
        if(!dunObj){
            Logger.log("initDunSDK dunObj == null dunType = " + dunType)
            return;
        }
        if (!dunConfig) {
            Logger.log("initDunSDK dunConfig == null dunType = " + dunType)
            return;
        }
        let isCfgValid = dunObj.checkCfgIsValid(dunConfig)
        if(isSupport && isCfgValid){
            let dunInitState = dunObj.getInitState();
            if(!this.checkDunStateIsInit(dunInitState)){
                dunObj.init(dunConfig);
            }else{
                Logger.log("initDunSDK checkDunStateIsInit == true " + dunType)
            }
        }else{
            Logger.log("initDunSDK  can't init dunType" + dunType)
        }
    }

    //检测当前版本是否支持指定类型盾
    checkAppIsSupportDunByType(dunType){
        let isSupport = false;
        let dunObj = null;
        switch(dunType){
            case DUNTYPE.YUN_DUN:
                dunObj = this.yunDun;
                break;
            case DUNTYPE.ZA_DUN:
                dunObj = this.zaDun;
                break;
            case DUNTYPE.Ali_DUN:
                dunObj = this.aliDun;
                break;
            default:
                break;
        }
        if(dunObj){
            isSupport = dunObj.isAppSupport();
        }
        return isSupport;
    }

    //判断盾是都初始化完成
    checkDunStateIsInit(dunInitState){
        if(dunInitState != null){
            //还没开始初始化或者初始化失败
            if(dunInitState == DUNSTATE.INIT || dunInitState == DUNSTATE.FAILED){
                return false;
            }else{
                return true;
            }
        }
        return false;
    }

    getDunIsInitByType(dunType){
        return;
        if(!dunType){
            Logger.log("getDunIsInitByType dunType = null")
            return;
        }
        let isDunInit = false;
        let dunObj = null;
        switch(dunType){
            case DUNTYPE.YUN_DUN:
                dunObj = this.yunDun;
                break;
            case DUNTYPE.ZA_DUN:
                dunObj = this.zaDun;
                break;
            case DUNTYPE.Ali_DUN:
                dunObj = this.aliDun;
                break;
        }
        if(dunObj){
            isDunInit = dunObj.isInit();
        }
        //如果没有初始化成功，尝试初始化
        if(!isDunInit){
            this.initDunSDK(dunType);
        }
        Logger.error("getDunIsInit dunType = " + dunType + " isDunInit = " + isDunInit)
        return isDunInit;
    }

    getServerIPAndPort(host,lo_port,dunType,attr){
        if(!host || !lo_port || !dunType){
            Logger.log("getServerIPAndPort error host lo_port dunType ")
            return;
        }
        let isSupport = this.checkAppIsSupportDunByType(dunType);
        if(!isSupport){
            Logger.log("getServerIPAndPort App not Support dunType = " + dunType)
            return;
        }
        let ipPortInfo = null;
        let dunObj = null;
        switch(dunType){
            case DUNTYPE.YUN_DUN:
                dunObj = this.yunDun;
                break;
            case DUNTYPE.ZA_DUN:
                dunObj = this.zaDun;
                break;
            case DUNTYPE.Ali_DUN:
                dunObj = this.aliDun;
                break;
            default:
                break;
        }
        if(dunObj){
            ipPortInfo = dunObj.getServerIPAndPort(host,lo_port,attr)
        }
        return ipPortInfo;
    }

    //判断是都有盾在异步初始化中
    checkIsDunLoading(){
        let dunInitState = 0;
        let isDunLoading = false;
        if(this.yunDun){
            dunInitState = this.yunDun.getInitState();
            if(dunInitState == DUNSTATE.LOADING){
                isDunLoading = true;
            }
        }
        if(this.zaDun){
            dunInitState = this.zaDun.getInitState();
            if(dunInitState == DUNSTATE.LOADING){
                isDunLoading = true;
            }
        }
        if(this.aliDun){
            dunInitState = this.aliDun.getInitState();
            if(dunInitState == DUNSTATE.LOADING){
                isDunLoading = true;
            }
        }
        return isDunLoading;
    }
}