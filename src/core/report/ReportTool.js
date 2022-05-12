import Helper from "../helper";
import ReportKey from "../const/ReportKey";
import StorageKey from "../const/StorageKey";
import {
    Logger
} from "../debug/Logger";
import Global from "../Global";
import {
    ServerUrl
} from "../net/route/ServerRoutes";
import LineRecordInfo from "./LineRecordInfo";

export default class ReportTool {
    //当前使用的线路索引
    _curIndex = 0;
    //上报次数
    _reportTimes = 0
    //日志是否合并上报
    _merge = true;
    //缓存日志上线 默认5条
    _maxLogCount = 5;
    //缓存日志时间上限 默认5分钟 秒数
    _maxLogCacheInterval = 5 * 60;
    //缓存日志Debug
    _LogCache = [];
    //缓存日志定时器
    _logCacheInterval = 0;
    //热更失败只上报一次
    _hotUpdateReport = {}

    logUrlsList = ["https://report-b66t-4.lexyqlc.com"];

    reportUrl = "https://report-b66t-4.lexyqlc.com/logCenter/";

    //上报调试日志开关，通过checkversion下发，rootadmin控制
    debugEnable = false;

    //debug uid 。 防止切换账号问题
    debugUid = 0;

    //用于test_route重试计数
    retryTimes = 0;

    //用于请求t_url计数
    requestTime = 0;

    //测速参数缓存
    _reportParam = []

    uid = 0;

    phone = 0;


    //上报类初始化
    init() {
        this._reportTimes = 0;
        this._loadLocalLogUrls();
        this._initReportUrl();
        // Global.Http.onRegister("reportTool",this.onUpdate.bind(this));
    }

    //判断host是否是reportUrl
    isReportUrl(reportUrl) {
        let host = reportUrl.realHost
        let returnValue = false;
        for (let i = 0; i < this.logUrlsList.length; i++) {
            let url = this.logUrlsList[i];
            if (url.indexOf(host) > -1) {
                returnValue = true;
            }
        }
        return returnValue;
    }

    //加载本地上报地址
    _loadLocalLogUrls() {
        let urlsStr = Global.Setting.storage.get(StorageKey.ReportUrl);
        let arr = null;
        try {
            if (urlsStr != null && urlsStr != "") {
                arr = JSON.parse(urlsStr);
            }
        } catch (error) {
            Logger.error("解析ReportUrl失败", urlsStr);
        }
        if (arr == null || arr.length == 0) {
            return;
        }
        //过滤无效地址
        for (let i = arr.length - 1; i >= 0; i--) {
            if (arr[i].indexOf("http") == -1) {
                Logger.error("过滤无效域名:", arr[i]);
                arr.splice(i, 1);
            }
        }
        if (arr.length > 0) {
            this.logUrlsList = arr;
        }
        //处理多地址同host
        this.logUrlsList = Global.UrlUtil.dealFullUrlWithMutiLinesSameHost(this.logUrlsList);
    }

    //初始化上报地址
    _initReportUrl() {
        let length = this.logUrlsList.length;
        if (length == 0) {
            Logger.error("Report URL is null !!!");
            return;
        }
        this._curIndex = Global.Toolkit.getRoundInteger(length, 0);
        this._refreshReportUrl();
    }

    get _phoneCode() {
        return Global.Setting.storage.get(StorageKey.AreaCode) || "";
    }

    get _loginIp() {
        if (Global.PlayerData && Global.PlayerData.ip) {
            return Global.PlayerData.ip;
        }
        return "";
    }

    get _uid() {
        return Number(this.uid);
        // if (Global.PlayerData && Global.PlayerData.uid) {
        //     return Global.PlayerData.uid;
        // }
        // return Number(Global.Setting.storage.get(StorageKey.Uid)) || 0;
    }
    
    get _phone(){
        return Number(this.phone)
    }

    get _packId() {
        if (Global.PlayerData && Global.PlayerData.pack) {
            return Global.PlayerData.pack;
        }
        return Number(Global.Setting.storage.get(StorageKey.Channel)) || 0;
    }

    get _pid() {
        if (Global.PlayerData && Global.PlayerData.pid) {
            return Global.PlayerData.pid;
        }
        return Number(Global.Setting.storage.get(StorageKey.InviteCode)) || 0;
    }

    get _userType() {
        if (Global.PlayerData && Global.PlayerData.type) {
            return Global.PlayerData.type;
        }
        return 0;
    }

    get _osType() {
        if (Helper.isWeb()) {
            return 0;
        }
        if (Helper.isAndroid()) {
            return 1;
        }
        if (Helper.isIos()) {
            return 2;
        }
        return 0;
    }

    get _phone() {
        if (Global.PlayerData && Global.PlayerData.phone) {
            return Global.PlayerData.phone;
        }
        return Global.Setting.storage.get(StorageKey.phone) || "";
    }

    /**
     * 上报客户端错误日志
     * @param {*} key 日志标识
     * @param {*} param 上报内同
     */
    ReportClientError(key, param) {
        if (key == ReportKey.REPORT_TYPE_HOT_UPDATE_ERROR) {
            let gameType = param.game;
            if (!gameType) {
                return;
            }
            if (this._hotUpdateReport[gameType]) {
                return;
            }
            this._hotUpdateReport[gameType] = 1;
        }
        this._reportTimes++;
        this._ReportLogMixing(ReportKey.ERROR_LOG, key, param);
    }

    ReportDevice(type) {
        if (!Helper.isRelease()) {
            return;
        }
        let url = this.reportUrl + "basic?";
        let param = this._genDeviceParam();
        param._param.stype = type;
        let serverUrl = new ServerUrl();
        serverUrl.parse(url);
        if (Helper.isIos()) {
            Logger.log("ReportDevice ios param:" + param);
        } else if (Helper.isAndroid()) {
            Logger.log("ReportDevice android param:" + param);
        }

        Global.Http.send(serverUrl, param, () => {}, () => {
            this._changeReportUrl();
        })
    }

    _refreshReportUrl() {
        if (this._curIndex > this.logUrlsList.length || !this.logUrlsList[this._curIndex]) {
            this._curIndex = 0;
            Logger.error("curIndex is null !! curIndex =" + this._curIndex);
            return;
        }
        if (this.logUrlsList[this._curIndex].indexOf("http") > -1) {
            this.reportUrl = this.logUrlsList[this._curIndex] + "/logCenter/";
        } else {
            this.reportUrl = "https://" + this.logUrlsList[this._curIndex] + "/logCenter";
        }
    }

    _changeReportUrl() {
        this._curIndex = (this._curIndex + 1) % this.logUrlsList.length;
        this._refreshReportUrl();
    }

    ParseDebugConfig(config, uid) {
        if (config.debug && config.debug == 1) {
            Global.ReportTool.debugEnable = true;
            this.debugUid = uid;
        }
    }

    _packLogParam(param) {
        //上报的客户端时间
        param.client_time = Date.now();
        //系统类型
        param.os_type = this._osType;
        //设备id
        param.device_id = Global.Setting.SystemInfo.device;
        //系统版本
        param.os_version = Helper.sysInfo().osVersion;
        //设备幸好
        param.mobile_brand = Helper.sysInfo().mobile;
        //appid
        param.app_id = window.envInfo.appid;
        //系统版本号
        param.app_version = Global.Setting.SystemInfo.appVersion || "";
        param.version = Global.Setting.SystemInfo.version || ""
        //包名
        param.app_name = Global.Setting.SystemInfo.bundleName;
        //马甲包类型
        param.copy_pack_type = Global.Setting.SystemInfo.nativePlatform;
        //是否第一次安装
        param.is_first = Global.Setting.SystemInfo.firstInstallStatus ? 1 : 0;
        //uid
        param.uid = this._uid;
        param.user_key = this._phone;
        //手机号
        param.mobile = Global.AESUtil.aesEncrypt(Global.AESUtil.cryptoKey, Global.AESUtil.cryptoIv, this._phone);
        //服务器设备唯一码
        param.server_id = Global.Setting.SystemInfo.server_id || "";
        //大厅版本
        // param.hall_version = Global.Toolkit.genLoadingAppInfo();
        param.hall_version = ""
        param.build_Version_Release = Global.Setting.SystemInfo.build_Version_Release || ""
        param.build_Version_SDK = Global.Setting.SystemInfo.build_Version_SDK || ""
        param.build_Model = Global.Setting.SystemInfo.build_Model || ""
        param.build_Brand = Global.Setting.SystemInfo.build_Brand || ""
        //平台id
        param.platform_id = Global.Setting.appDataPlatformId || 0;
        if (Global.Setting.storage.get('gid')) {
            param.gid = Global.Setting.storage.get('gid');
        } else {
            param.gid = 0;
        }
    }

    _genDeviceParam() {
        let paramTab = {};
        paramTab._mod = 'logAgent';
        paramTab._func = 'clientLog';
        let param = {};
        let sysInfo = Global.Setting.SystemInfo;
        if (sysInfo == null) {
            Logger.error("sysInfo is null !!!!");
            return;
        }
        //ios签名
        param.ios_sign = sysInfo.appSign;
        //微信key
        param.wx_key = sysInfo.wxKey;
        //极光key
        param.jpush_key = sysInfo.jpushKey;
        //openinstall key
        param.openinstall_key = sysInfo.openInstallKey || "";
        //shareinstall key 
        param.shareInstallKey = sysInfo.shareInstallKey || "";
        //使用的域名列表
        param.data_urls = Global.Setting.dataUrlsList;
        //正在使用的url
        param.data_url = Global.Setting.curDataUrl;
        //设备渠道号
        if (sysInfo.packChannel && !isNaN(Number(sysInfo.packChannel))) {
            param.channel_id = Number(sysInfo.packChannel) || 0;
        }
        //appdata渠道id
        param.app_data_channel_id = Global.Setting.ChannelInfo.configChannel;
        //包名
        param.pack_name = sysInfo.bundleName;
        //玩家实际渠道
        param.pack_id = this._packId;
        //上级id
        param.pid = this._pid;
        //用户类型
        param.user_type = this._userType;
        //玩家手机号 或者 缓存手机号
        param.mobile = Global.AESUtil.aesEncrypt(Global.AESUtil.cryptoKey, Global.AESUtil.cryptoIv, this._phone);
        //手机号码区域
        param.mobile_form = this._phoneCode;
        //登录ip
        param.login_ip = this._loginIp;
        //平台id
        param.platform_id = Global.Setting.appDataPlatformId || 0;
        //大厅版本
        param.hall_version = Global.Toolkit.genLoadingAppInfo();
        //openinstall 内容
        param.openinstall_content = Global.Setting.ChannelInfo.openInstallContent || "";
        if (Global.ChannelUtil.isShareinstallVaild()) {
            param.shareinstall_content = Global.Setting.ChannelInfo.shareInstallContent || "";
        }
        //剪贴板内容
        if (Global.ChannelUtil.isCliptextVaild()) {
            param.clipboardContent = Global.Setting.ChannelInfo.clipboardContent || "";
        }
        this._packLogParam(param);
        paramTab._param = param;
        return paramTab;
    }

    /**
     * 将日志先入缓存然后再检测超过5条上报再写入localStorage
     * @param {*} key       日志大类型
     * @param {*} subKey    日志小类型
     * @param {*} content   日志内容
     */
    _ReportLogMixing(key, subKey, content) {
        //直接上报 不入缓存
        // if (!this._merge) {
        //     this._ReportLogInternal(key, subKey, content);
        //     return;
        // }
        //拿单条日志
        let subLog = this._newLogParams(key, subKey, content);
        this._LogCache.push(subLog);
        if (this._LogCache.length >= this._maxLogCount) {
            //上报
            let mergeLog = {};
            mergeLog.data = this._LogCache;
            this._ReportLogMergeInternal(mergeLog);
            //清空缓存
            this._clearLogCacheAll();
        } else {
            //写storage
            this._saveLogCacheToStorage();
        }
    }

    //合并上报生成一条子日志
    _newLogParams(key, subKey, content) {
        let param = {};
        //上报的客户端时间
        //上报的客户端时间
        param.client_time = Date.now();
        //系统类型
        param.os_type = this._osType;
        //设备id
        param.device_id = Global.Setting.SystemInfo.device || "";
        //系统版本
        param.os_version = Helper.sysInfo().osVersion;
        //设备幸好
        param.mobile_brand = Helper.sysInfo().mobile;
        //appid
        param.app_id = window.envInfo.appid;
        //系统版本号
        param.app_version = Global.Setting.SystemInfo.appVersion;
        param.version = Global.Setting.SystemInfo.version || ""
        //包名
        param.app_name = Global.Setting.SystemInfo.bundleName;
        //马甲包类型
        param.copy_pack_type = Global.Setting.SystemInfo.nativePlatform;
        //是否第一次安装
        param.is_first = Global.Setting.SystemInfo.firstInstallStatus ? 1 : 0;
        //uid
        param.uid = this._uid;
        param.user_key = this._phone;
        //手机号
        param.mobile = Global.AESUtil.aesEncrypt(Global.AESUtil.cryptoKey, Global.AESUtil.cryptoIv, this._phone);
        //服务器设备唯一码
        param.server_id = Global.Setting.SystemInfo.server_id || "";
        //大厅版本
        // param.hall_version = Global.Toolkit.genLoadingAppInfo();
        param.hall_version = ""
        param.build_Version_Release = Global.Setting.SystemInfo.build_Version_Release || ""
        param.build_Version_SDK = Global.Setting.SystemInfo.build_Version_SDK || ""
        param.build_Model = Global.Setting.SystemInfo.build_Model || ""
        param.build_Brand = Global.Setting.SystemInfo.build_Brand || ""
        //日志内容
        let contentStr = "";
        try {
            contentStr = JSON.stringify(content);
        } catch (error) {
            contentStr = "";
        }
        param.content = contentStr;
        if (content.error_code) {
            // param.htime = content.htime;
            param.error_code = content.error_code;
        }
        if (content.htime || content.hTime) {
            if (content.htime) {
                param.htime = content.htime;
            }
            if (content.hTime) {
                param.htime = content.hTime;
            }
        }
        if (Global.Setting.storage.get('gid')) {
            param.gid = Global.Setting.storage.get('gid');
        } else {
            param.gid = 0;
        }
        return param;
    }

    //合并上报接口
    _ReportLogMergeInternal(params) {
        if (!Helper.isRelease()) {
            return;
        }
        if (params == null) {
            params = {};
        }
        if (Global.Setting.SystemInfo == null) {
            return;
        }
        let paramTab = {};
        paramTab._mod = "logAgent";
        paramTab._func = "clientLog";
        paramTab._param = params;
        let suffix = "batchclis?";
        let url = this.reportUrl + suffix;
        try {
            let serverUrl = new ServerUrl();
            serverUrl.parse(url);
        } catch (error) {

        }
        axios.post(url, paramTab).then(res => {
            this._changeReportUrl();
        })
    }

    _ReportLogInternal(type, key, contentTab, bacth = false) {
        if (!Helper.isRelease() || Global.Setting.SystemInfo == null) {
            return;
        }
        contentTab = contentTab || {};
        let suffix = bacth ? "batchclis?" : "clis?";
        let url = this.reportUrl + suffix;
        let paramTab = {};
        paramTab._mod = "logAgent";
        paramTab._func = "clientLog";
        let param = {};
        //大类型
        param.class = type;
        //子类型
        param.sub_class = key;
        let contentStr = "";
        try {
            contentStr = JSON.stringify(contentTab);
        } catch (error) {
            contentStr = "";
        }
        //上报具体内容
        param.content = contentStr;
        if (contentTab.error_code) {
            param.error_code = contentTab.error_code;
        }
        if (contentTab.htime || contentTab.hTime) {
            if (contentTab.htime) {
                param.htime = contentTab.htime;
            }
            if (contentTab.hTime) {
                param.htime = contentTab.hTime;
            }
        }
        this._packLogParam(param);
        paramTab._param = param;
        try {
            let serverUrl = new ServerUrl();
            serverUrl.parse(url);
        } catch (error) {

        }
        axios.post(url, paramTab).then(res => {
            this._changeReportUrl();
        })
    }
    reportAppOpen() {
        try {
            let start_time = Global.Setting.SystemInfo.start_time || []
            if (start_time.length > 0) {
                this._ReportLogInternal(ReportKey.DEBUG_LOG, ReportKey.REPORT_TYPE_APP_OPEN, {
                    opentime: new Date().getTime() - Number(start_time[start_time.length - 1]),
                    opencount: start_time.length
                });
            }
        } catch (error) {
            Logger.error("reportAppOpen failed!!!");
        }
    }

    //上报上一次的请求计数
    reportRequestRecord() {
        let recordStr = Global.Setting.storage.get(StorageKey.RequestRecord);
        if (recordStr == null || recordStr == "") {
            return;
        }
        try {
            let decodeStr = Global.AESUtil.aesDcryptWithPKC27(recordStr);
            let content = JSON.parse(decodeStr);
            this._ReportLogInternal(ReportKey.DEBUG_LOG, ReportKey.REPORT_TYPE_REQUEST_RECORD, content);
        } catch (error) {
            Logger.error("decode RequestRecord failed!!!", recordStr);
        }
        Global.Setting.storage.set(StorageKey.RequestRecord, "")
    }

    //把日志缓存到本地，下次登录时再上报
    _saveRecord() {
        try {
            this._recordTab.reqMap = this._requestResultMap;
            for (let key in this._requestResultMap) {
                LineRecordInfo.deleteEmpty(this._requestResultMap[key]);
            }
            let content = JSON.stringify(this._recordTab);
            let encryptContent = Global.AESUtil.aesEncrypt(Global.AESUtil.cryptoKey, Global.AESUtil.cryptoIv, content);
            Global.Setting.storage.set(StorageKey.RequestRecord, encryptContent);
        } catch (error) {
            Logger.error("JSON.stringify(this.successRequestMap) error !!!");
            this._requestResultMap = {};
        }
    }

    //超过时间限制无论缓存中有多少条日志都上报,同时清除缓存,清除storage
    _ReportCacheTimeout() {
        if (this._LogCache == null || this._LogCache.length == 0) {
            return;
        }
        try {
            let mergeLog = {};
            mergeLog.data = this._LogCache;
            this._ReportLogMergeInternal(mergeLog);
        } catch (error) {
            Logger.error("ReportCacheTimeout", error);
        }
        this._clearLogCacheAll();
    }

    //上报上次登录后缓存在storage中的日志(无论多少)
    ReportLastLoginLogCache() {
        let lastLoginCache = Global.Setting.storage.get(StorageKey.PostLogCache);
        if (lastLoginCache == null || lastLoginCache == "") {
            return;
        }
        try {
            let decodeStr = Global.AESUtil.aesDcryptWithPKC27(lastLoginCache);
            let content = JSON.parse(decodeStr);
            let mergeLog = {};
            mergeLog.data = content;
            this._ReportLogMergeInternal(mergeLog);
        } catch (error) {
            Logger.error("decode RequestRecord failed!!!", lastLoginCache);
        }
        this._clearLogCacheAll();
    }

    ReportPublicClientLog(key, param, bacth = false) {
        this._ReportLogMixing(ReportKey.DEBUG_LOG, key, param);
    }

    _saveLogCacheToStorage() {
        try {
            let content = JSON.stringify(this._LogCache);
            let encryptContent = Global.AESUtil.aesEncrypt(Global.AESUtil.cryptoKey, Global.AESUtil.cryptoIv, content);
            Global.Setting.storage.set(StorageKey.PostLogCache, encryptContent);
        } catch (error) {
            Logger.error("saveLogCacheToStorage:日志写缓存失败", error);
        }
    }

    /**
     * 清除所有缓存 同时清除Storage
     */
    _clearLogCacheAll() {
        this._LogCache = null;
        this._LogCache = [];
        Global.Setting.storage.set(StorageKey.PostLogCache, "");
    }

    //每60秒写一次到缓存
    _RECODE_TIME = 60;
    _REQUEST_SUCCESS = "sCount";
    _REQUEST_FAILED = "fCount";
    _interval = 0;
    //记录成功的请求次数和域名
    _requestResultMap = {};
    //上报总数据结构
    _recordTab = {}

    markSuccess(serverUrl) {
        if (serverUrl) {
            return;
        }
        this._recordRequestResult(serverUrl, this._REQUEST_SUCCESS);
    }

    markFailed(serverUrl, httpStatus) {
        if (!serverUrl) {
            return;
        }
        this._recordRequestResult(serverUrl, this._REQUEST_FAILED, httpStatus);
    }

    //请求失败或者成功 计数+1
    //type:1 成功 2 失败
    _recordRequestResult(serverUrl, type, httpStatus = 0) {
        let host = serverUrl.realHost;
        if (!host) {
            return;
        }
        if (this._requestResultMap[host] == null) {
            this._requestResultMap[host] = LineRecordInfo.create(serverUrl);
        }
        let info = this._requestResultMap[host];
        if (info == null) {
            return;
        }
        if (type == this._REQUEST_FAILED) {
            info.fCount++;
            if (info.errCodeMap[httpStatus] == null) {
                info.errCodeMap[httpStatus] = 0;
            }
            info.errCodeMap[httpStatus]++
        } else {
            info.sCount++;
        }
        //ip每次请求都更新
        info.addr = serverUrl.address;
    }

    onUpdate(dt) {
        return;
        //非正式环境不上报
        if (!Helper.isRelease()) {
            return;
        }
        // console.error("触发",dt);
        this._interval += dt;
        if (this._interval >= this._RECODE_TIME) {
            this._interval = 0;
            this._saveRecord();
        }
        //5分钟上报一次日志
        this._logCacheInterval += dt;
        if (this._logCacheInterval >= this._maxLogCacheInterval) {
            this._logCacheInterval = 0;
            this._ReportCacheTimeout();
        }
    }

    //线路测速
    DealReportUrl(serverCfg) {
        let url = serverCfg.t_url;
        if (!url || typeof (url) != 'string') {
            return;
        }
        if (this.requestTime < 3) {
            let xhr = new XMLHttpRequest(); //第一步:创建需要的对象
            let time = new Date().getTime() - time;
            url += Global.formatStr("?%s", time);
            xhr.open('GET', url, true);
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) { //验证请求是否发送成功 
                    if (xhr.status == 200) {
                        let off = new Date().getTime() - time;
                        let len = xhr.getResponseHeader('content-length');
                        let xip = xhr.getResponseHeader('xips');
                        this._reportParam[this.requestTime] = {
                            "time": off,
                            "len": len,
                            "xip": xip,
                            "test_url": url
                        };
                        this.requestTime++;
                        this.DealReportUrl(serverCfg);
                    } else {
                        Logger.error("拉取失败");
                        Logger.error("xhr.readyState", xhr.readyState, xhr.status);
                        this.requestTime++;
                        this.retryTimes++;
                        this.DealReportUrl(serverCfg);
                    }
                }
            }
            xhr.send();
        } else {
            let param = {};
            param.content = this._reportParam;
            param.retryTimes = this.retryTimes;
            let reportKey = ReportKey.REPORT_TYPE_TEST_ROUTE;
            Global.ReportTool.ReportPublicClientLog(reportKey, param, false);
            this._reportParam = [];
        }
    }
}