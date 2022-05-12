import ReportKey from "./const/ReportKey";
import StorageKey from "./const/StorageKey";
import { Logger } from "./debug/Logger";
import Global from "./Global";
import GlobalEvent from "./GlobalEvent";
import Helper from "./helper"

let preLoadProxyInstance;
export default class PreLoadProxy {
    static NAME = "PreLoadProxy";

    urlIndex = 0;
    //本地缓存的服务器配置数据
    _cachedServerContent = null;

    constructor() {
        if (!preLoadProxyInstance) {
            preLoadProxyInstance = this;
        }
        return preLoadProxyInstance;
    }

    setup() {
        //初始化App相关信息
        // Global.NativeEvent.onInit();
        // Global.NativeEvent.showSplashView();
       
        Global.NativeEvent.getNativeParams();
        this.onloadPackChannelInfo()
        // if (nativeData) {
        //     // Global.DNS.init();
        //     // Global.AppDun.init();
        //     this.handleAppConfig(nativeData, false, true)
        // } else {
        //     // Logger.log("web端获取data数据")
        //     //初始化配置信息
        //     // this.initDataUrls();
        //     // this.requestAppUrl();
        // }
        Global.ReportTool.ReportDevice(ReportKey.REPORT_TYPE_OPEN);
    }

    onloadPackChannelInfo() {
        let packCh = Global.Setting.SystemInfo.packChannel;
        if (packCh != null && packCh != "" && !isNaN(Number(packCh))) {
            Global.Setting.ChannelInfo.packageChannel = Number(packCh);
        }
    }

    initDataUrls() {
        if (Helper.isWeb()) {
            Global.Setting.dataUrlsList = []
            let appdataUrlArray = Global.Setting.Urls.dataUrls;
            let dataName = Global.Setting.getCfgDataName()
            if (appdataUrlArray && appdataUrlArray.length > 0) {
                for (let i = 0; i < appdataUrlArray.length; i++) {
                    let constUrl = appdataUrlArray[i];
                    let constDataUrl = constUrl;
                    constDataUrl = constDataUrl + Global.formatStr("/%s?", md5(dataName))
                    Global.Setting.dataUrlsList.push(constDataUrl);
                }
            }
            return
        }

        Global.Setting.dataUrlsList = [];
        let dataUrls = Global.Setting.loadDataUrls();
        if (dataUrls && dataUrls.length > 0) {
            for (let i = 0; i < dataUrls.length; i++) {
                let dUrl = this.repackUrl(dataUrls[i]);
                Global.Setting.dataUrlsList.push(dUrl);
            }
        } else {
            //取不到本地缓存就用包里面的dataUrls
            dataUrls = Global.Setting.SystemInfo.appConstUrlArray;
            for (let i = 0; i < dataUrls.length; i++) {
                let dUrl = this.repackUrl(dataUrls[i]);
                Global.Setting.dataUrlsList.push(dUrl);
            }
        }
    }

    repackUrl(url) {
        //如果配置了问号 则直接用配置下发的
        if (url.indexOf("?") > -1) {
            if (!url.startsWith("http")) {
                url = "https://" + url;
            }
            return url;
        }
        let protocal = "https:";
        let protocalArr = url.split("//");
        if (protocalArr.length > 1) {
            protocal = protocalArr[0];
            url = protocalArr[1];
        }
        let host = Global.Toolkit.getHostFromUrl(url);
        let dataName = Global.Setting.SystemInfo.appID;
        // if(dataName == null || dataName == ""){
        //     dataName = Global.Setting.
        // }
        let subPlatform = Global.Setting.SystemInfo.subPlatformID;
        let dataStr = dataName + (subPlatform ? "_" + subPlatform : "");
        dataStr = md5(dataStr);
        return protocal + "//" + host + "/c/" + dataStr + "?";
    }

    //请求appdata 数据
    requestAppUrl() {
        //原生关闭闪屏页
        if (Helper.isDevelopment()) {   //开发模式
            this.reqServerAppConfig();
            return;
        }
        //加载本地缓存配置
        if (!this.loadLocalAppConfig()) {
            this.reqServerAppConfig();
        } else {
            this.reqVerifyServerAppConfig();
        }
    }

    /**
     * 加载本地缓存配置并且解析
     */
    loadLocalAppConfig() {
        let content = Global.Setting.storage.get(StorageKey.AppConfigContent);
        if (content == null || content == "") {
            return false;
        }
        this._cachedServerContent = content;
        // this.handleAppConfig(content, false);
        Logger.log("加载本地缓存直接进游戏")
        return true;
    }

    /**
     * 本地没有缓存,请求服务器配置
     */
    reqServerAppConfig() {
        // let url = this.getConfigUrl();
        // let uid = Number(Global.Setting.storage.get(StorageKey.Uid)) || 0;
        // url += "uid=" + uid + "&appver=" + Global.Setting.SystemInfo.appVersion + "&os=" + Global.Toolkit.getOsType() + "&n=" + Date.now();
        // Global.Setting.dataUrlIndex = this.urlIndex;
        // url = Global.UrlUtil.refreshSuffixOperTime(url);
        // url = Global.UrlUtil.refreshSuffixRetryTime(url, this.urlIndex);
        // Global.Setting.curDataUrl = url;
        // Global.Http.getWithRetry(url, this.handleAppConfig.bind(this), this.handleCfgReqeustError.bind(this), null, 0, false)
    }

    //本地有缓存，先进游戏，再和服务器数据做校验
    reqVerifyServerAppConfig() {
        let url = this.getConfigUrl();
        let uid = Number(Global.Setting.storage.get(StorageKey.Uid)) || 0;
        url += "uid=" + uid + "&appver=" + Global.Setting.SystemInfo.appVersion + "&os=" + Global.Toolkit.getOsType() + "&n=" + Date.now();
        url = Global.UrlUtil.refreshSuffixOperTime(url);
        url = Global.UrlUtil.refreshSuffixRetryTime(url, this.urlIndex);
        Global.Setting.dataUrlIndex = this.urlIndex;
        Global.Setting.curDataUrl = url;
        Global.Http.get(url, this.verifyServerCfg.bind(this), this.verifyServerCfgError.bind(this));
    }

    //验证服务器配置与本地配置F
    verifyServerCfg(msg) {
        let result = this.checkServerCfg(msg, this._cachedServerContent);
        Logger.error("verifyServerCfg checkServerCfg result = " + result)
        if (result == 4) {
            //服务器数据验证不通过 需要切换继续请求
            this.verifyServerCfgError();
            return;
        }
        Global.Setting.dataUrlIndex = this.urlIndex;
        Global.Setting.curDataUrl = this.getConfigUrl();
        if (result == 0) {
            return;
        }
        Logger.log("服务器配置更新");
        Global.Setting.storage.set(StorageKey.AppConfigContent, msg);

        let decodeMsg = Global.AESUtil.decodeMsg(msg);
        let serverCfg = JSON.parse(decodeMsg);
        Logger.log("-------appconfig---------", decodeMsg);
        Global.Setting.parseServerInfo(serverCfg);
    }

    verifyServerCfgError() {
        this.urlIndex++;
        if (this.urlIndex < Global.Setting.dataUrlsList.length) {
            Logger.error("use back up verify");
            this.reqVerifyServerAppConfig();
        }
    }

    //0  不做操作  1 切回到登录界面  2 重启游戏  3不操作 4 data数据有问题 需要切换下一个
    checkServerCfg(svrMsg, localMsg) {
        if (md5(svrMsg) == md5(localMsg)) {
            return 0;
        }
        let serCfg = this.safeDecode(svrMsg);
        if (serCfg == null) {
            return 4;
        }
        let localCfg = this.safeDecode(localMsg);
        if (localMsg == null) {
            return 2;
        }
        //serverRoutes 变化需要重启
        try {
            let localRoutesStr = JSON.stringify(localCfg.routes);
            let svrRoutesStr = JSON.stringify(serCfg.routes);
            if (md5(localRoutesStr) != md5(svrRoutesStr)) {
                return 5;
            }
        } catch (error) {
            return 2;
        }
        return 3;
    }

    safeDecode(cfg) {
        let serverCfg = null;
        try {
            let decodeMsg = Global.AESUtil.decodeMsg(cfg);
            serverCfg = JSON.parse(decodeMsg);
            //routes 为空 验证不通过
            if (serverCfg.routes == null || !serverCfg.routes.length || serverCfg.routes.length == 0) {
                serverCfg = null;
                Logger.error("data routes is null");
            }
        } catch (error) {
            Logger.error("load app error", cfg);
            serverCfg = null;
        }
        return serverCfg;
    }

    handleCfgReqeustError() {
        this.urlIndex++;
        if (this.urlIndex < Global.Setting.dataUrlsList.length) {
            this.reqServerAppConfig();
        } else {
            this.urlIndex = 0;
            Logger.error("拉取配置文件失败！")
        }
    }

    /**
     * 获取appconfig主地址
     */
    getConfigUrl() {
        //默认配置地址
        let url = Global.Setting.dataUrlsList[this.urlIndex];
        if (url == null) {
            url = Global.Setting.dataUrlsList[0];
            this.urlIndex = 0;
        }
        return url;
    }

    handleCfgRequestError() {
        this.urlIndex++;
        // if (this.urlIndex < Global.Setting.dataUrlsList.length) {
        //     this.reqServerAppConfig();
        // } else {
        //     this.urlIndex = 0;
        // }
    }

    //解析AppConfig 进入热更流程
    handleAppConfig(msg, saveStorage = true, isDecodeMsg = false) {
        try {
            let decodeMsg = null;
            if (isDecodeMsg) {
                decodeMsg = msg;
            } else {
                decodeMsg = Global.AESUtil.decodeMsg(msg)

            }
            let serveCfg = JSON.parse(decodeMsg);
            //如果data里面没有配置routes 这份data算失效 需要寻找下一个data
            if (serveCfg.routes == null || serveCfg.routes.length == null || serveCfg.routes.length == 0) {
                this.handleCfgRequestError();
                Logger.error("没有配置routers");
                //上报错误(top后台)
                // Global.ReportTool.ReportClientError(ReportKey.APPCONFIGPARSEERROR,{
                //     des:"AppConfig",
                //     content:msg,
                //     fromLocal:!saveStorage
                // })
                //上报错误(sentry)
                // errorReport.senTryReport(new Error(decodeMsg),errType.FATAL,msg,"AppConfigError",{"AppConfig":false});
                return;
            }
            Global.Setting.parseServerInfo(serveCfg);
        } catch (error) {
            //解析文件出错可能是域名呗污染或者劫持 需要替换下一个url
            // console.log("报错", error)
            this.handleCfgRequestError();
            Logger.error("加载appCfg失败", msg);
            //上报错误(top后台)
            // Global.ReportTool.ReportClientError(ReportKey.APPCONFIGPARSEERROR,{
            //     des:"AppConfig",
            //     content:msg,
            //     fromLocal:!saveStorage
            // })
            //上报错误(sentry)
            // errorReport.senTryReport(error,errType.FATAL,"","AppConfigParseError",{"AppConfig":false});
            return;
        }

        if (saveStorage) {
            Global.Setting.storage.set(StorageKey.AppConfigContent, msg);
        }

        Global.Setting.dataUrlIndex = this.urlIndex;
        Global.Setting.curDataUrl = this.getConfigUrl();
        //优先检测剪贴板
        Global.ChannelUtil.decodeCliptext();
        //上报上次的日志(top后台)
        Global.ReportTool.reportRequestRecord();
        //上报上次登录日志(top后台)
        Global.ReportTool.ReportLastLoginLogCache();
        let reqCheckVersionFunc = () => {
            //设置httpdns
            // Global.DNS.requestHosts(Global.Setting.Urls.globalRoutes.getRouteArr(),() => {

            // })
            //获取热更地址
            // if (!Helper.isWeb()) {
            //     //第一次安装时 需要获取到对应渠道信息
            //     if (Global.Setting.SystemInfo.firstInstallStatus) {
            //         setTimeout(() => {
            //             this.openCPGame();
            //         }, 500)
            //     } else {
            //         this.openCPGame();
            //     }
            // } else {
                Global.Event.event(GlobalEvent.GETDATACONFIGOVER)
            // }
        }
        let errorReStartTimes = Global.Setting.storage.get("errorReStartTimes");
        if (errorReStartTimes != null && errorReStartTimes != "") {
            let num = Number(errorReStartTimes);
            if (num && (num % 3 == 0)) {
                Logger.error("errorReStartTimes = " + errorReStartTimes + " 网络异常，请重新加载 ")
            } else {
                Logger.error("errorReStartTimes = num % 3 != 0 " + errorReStartTimes)
                reqCheckVersionFunc();
            }
        } else {
            Logger.error("errorReStartTimes = null  ")
            reqCheckVersionFunc()
        }
    }


    openCPGame() {
        // Global.NativeEvent.hideSplashView();
        Global.Event.event(GlobalEvent.GETDATACONFIGOVER)
    }
}