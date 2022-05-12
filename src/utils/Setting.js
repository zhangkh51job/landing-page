import StorageKey from "./StorageKey";
import { Logger } from "../debug/Logger";
import Global from "../Global";
import ChannelInfo from "./ChannelInfo";
import SystemInfo from "./SystemInfo";
import Urls from "./Urls"
import Storage from "./Storage"
import Helper from "../../utils/helper";

export const ServerType = {
    DEVELOP:1,      //预发布
    INTEST:2,       //内网测试服
    RELEASE:3      //正式服
}

export default class Setting{
    //localStorage 封装函数
    storage = new Storage();

    cpWebViewSetting = null;
    //AppConfig 服务器配置
    AppConfig = null;
    //url配置地址
    Urls = new Urls();
    //是否限制充值
    rechargeLimited = false;
    //是否限制游客登录
    vistorLoginLimited = false;
    //是否限制手机注册
    registLimited = false;
    //是否允许自动登录
    enableAutoLogin = true;
    //key
    signKey = "";

    //客服类型
    loginKeFuType = 0 ;
    loginAite_url = "";
    //客服配置
    kefuConfig = {};
    //官方网址
    official_url = "";
    static sendShareInstallReportFlag = "sendShareInstallReportFlag";

    dataUrlIndex = 0;
    curDataUrl;

    //系统信息
    SystemInfo = null;

    //渠道包数据
    ChannelInfo = null;
    //关闭vip
    vipDisable = false;

    //服务器配置微信key md5值
    serverWxMd5 = "";
    //安卓包名md5
    serverAndroidIdMd5 = "";
    //ios包名md5
    serverIOSIdMd5 = "";
    //ios签名信息
    serverIOSCertMd5 = "";
    
    useHttpDNS = true;
    //data列表
    dataUrlsList = [];

    //服务器类型
    ServerType = ServerType.INTEST;
    //金币比率
    glodRatio = 10000;
    //apopid
    _appId = 0;
    //tryPlay appid
    tryPlay = 0;
    isTryPlay = false;
    //头像取值范围
    headNameRange = 20;
    //日志模式
    logEnable = false;

    //大厅心跳拉取跑马灯数量
    boardcastCount = 2;

    //APP所属平台信息,只有上报使用
    appDataPlatformId = 0;

    //支付宝上报包名
    alipayReportPackageName = "";
    //推广码
    code = ""
    //网速dns数组
    WangsuDNS = [];

    constructor(){
        
    }

    getNativeAppid(){
        return this._appId;
    }

    get appId(){
        if(Global.Setting.isTryPlay){
            return Global.Setting.tryPlay;
        }else{
            return Global.Setting._appId;
        }
    }

    set appId(value){
        this._appId = value;
    }

    tryToPlay(){    //试玩
        Global.Setting.storage.setBool(StorageKey.TRYPLAY,true);
        this.isTryPlay = true;
    }

    exitTryPlay(){  //退出试玩
        Global.Setting.storage.removeKey(StorageKey.TRYPLAY);
        Global.Setting.storage.removeKey(StorageKey.Uid);
        Global.Setting.storage.removeKey(StorageKey.Token);
        this.isTryPlay = false;
    }

    setup(){
        this.urls = new Urls();
        this.SystemInfo = new SystemInfo();
        this.ChannelInfo = new ChannelInfo();
        this.ChannelInfo.setup();
    }

    //加载本地url
    loadDataUrls(){
        let urls = this.storage.getObject(StorageKey.DATAURLS);
        if(urls == null || urls.length == 0){
            return null;
        }
        urls = Global.UrlUtil.dealFullUrlWithMutiLinesSameHost(urls);
        return urls;
    }

    getCfgDataName(){
        return this.Urls.getDataNameWithServerType(this.ServerType)
    }

    parseCheckVersionCfg(config){
        this.official_url = config.official_url
        if(config.app){
            this.serverWxMd5 = config.app.wx_sum;
            this.serverIOSIdMd5 = config.app.ios_sum;
            this.serverAndroidIdMd5 = config.app.and_sum;
            this.serverIOSCertMd5 = config.app.ios_cert;
        }
        if(config.custom){
            let cfInfo = config.custom.login_kefu;
            if(cfInfo && cfInfo.type != null && cfInfo.type != undefined){
                let cfType = cfInfo.type;
                this.loginKeFuType = cfType;
                this.kefuConfig = config.custom.login_kefu
                if(cfType == 4){
                    this.loginAite_url = cfInfo.aite_url;
                }
            }
            if(cfInfo && cfInfo.url && cfInfo.url != "" && cfInfo.url.indexOf("http") > -1){
                this.Urls.onlineService = cfInfo.url;
            }
        }
        if(config.data_hosts && config.data_hosts.length && config.data_hosts.length > 0){
            this.recordDataUrls(config.data_hosts);
        }
    }

    parseServerInfo(serverCfg){
        this.AppConfig = serverCfg;
        //常规属性赋值
        this.parseNormalData(serverCfg);
        //彩票相关处理
        this.parseCPWebViewData(serverCfg);
    }

    parseCPWebViewData(serverCfg){
        if(serverCfg && serverCfg.home_url){
            // this.cp
        }
    }

    parseNormalData(serverCfg){
        let version = serverCfg.version;
        if(version){
            //设置最新的版本号(热更需要)
        }
        if(serverCfg.clearStorage){
            let isClearStorage = serverCfg.clearStorage == 1;
            if(isClearStorage){
                Logger.error("clearStorage true");
                //清除登录线路
                this.storage.removeKey(StorageKey.LoginRoutes)
                //清除Token
                this.storage.removeKey(StorageKey.Token)
                //清除AppID
                this.storage.removeKey(StorageKey.AppID)
                //清除DataURL
                this.storage.removeKey(StorageKey.DATAURLS)
            }
        }
        this.Urls.parse(serverCfg);
        let appid = serverCfg.appid;
        // console.error("设置appid",appid);
        if(appid){
            Global.Setting.appId = appid;
            this.savaAppId(serverCfg.appid);
        }

        let tryPlay = serverCfg.tryPlay;
        if(tryPlay){
            Global.Setting.tryPlay = tryPlay;
        }

        let key = Helper.isWeb() ? serverCfg.web_key : serverCfg.sign_key;
        if(key){
            this.signKey = key;
            this.SystemInfo.loginSign = Global.UrlUtil.getPlatformSign("[" + this.SystemInfo.deviceId + "]", key)
        }
        if(serverCfg.vipDisable == 1){
            this.vipDisable = true;
        }
        if(serverCfg.useHttpDNS){
            this.useHttpDNS = serverCfg.useHttpDNS == 1;
        }
        if(serverCfg.dataUrls){
            this.recordDataUrls(serverCfg.dataUrls);
        }
        if(serverCfg.alipayPkg){
            this.alipayReportPackageName = serverCfg.alipayPkg;
        }
        if(serverCfg.WangsuDNS){
            if(serverCfg.WangsuDNS.length > 0){
                this.WangsuDNS = serverCfg.WangsuDNS;
            }
        }
        if(serverCfg.DunConfig){
            //设置盾Config
            
            Global.AppDun.setDunConfig(serverCfg.DunConfig);
        }
        if(serverCfg.whiteHosts){
            let whiteHostsJson = JSON.stringify(serverCfg.whiteHosts);
            Global.NativeEvent.setWhiteHosts(whiteHostsJson)
        }
        if(serverCfg.platform_id){
            this.appDataPlatformId = serverCfg.platform_id;
        }
        if (serverCfg.reportUrls && serverCfg.reportUrls.length > 0) {
            Global.Setting.storage.set(StorageKey.ReportUrl,JSON.stringify(serverCfg.reportUrls))
        }
        if(serverCfg.DNSConfig){
            //设置DNS信息
            Global.DNS.setDNSConfig(serverCfg.DNSConfig);
        }
        if(serverCfg.rechargeLimited){
            this.rechargeLimited = serverCfg.rechargeLimited == 1
        }
        if(serverCfg.vistorLoginLimited){
            this.vistorLoginLimited = serverCfg.vistorLoginLimited == 1
        }
        if(serverCfg.registLimited){
            this.registLimited = serverCfg.registLimited == 1;
        }

        // if (serverCfg.logEnable){
        //     this.logEnable = serverCfg.logEnable == 1;
        // }else{
        //     this.logEnable = false;
        // }
            

        Logger.logEnable = this.logEnable;
        Global.NativeEvent.nativeLog(Logger.logEnable)
        let channel = serverCfg.channelid;
        this.setChannelID(channel);
    }

    setChannelID(channel){
        if(channel != null && !isNaN(Number(channel))){
            this.ChannelInfo.configChannel = channel;
        }
    }

    // setChann
    recordDataUrls(urlArr){
        if(urlArr && urlArr.length > 0){
            this.storage.setObject(StorageKey.DATAURLS,urlArr);
        }
    }

    savaAppId(appId){
        let oldId = this.storage.getNumber(StorageKey.AppID, -1);
        if(oldId != -1 && oldId != appId){
            //appid变化 需清理缓存 只需要清理
        }
        if(!this.isTryPlay){
            Global.Setting.storage.set(StorageKey.AppID,Global.Setting.appId)
        }
    }
}