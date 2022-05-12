import Helper from "../helper";
import StorageKey from "../const/StorageKey";
import { Logger} from "../debug/Logger";
import Global from "../Global";
import SyncJSBridge from "./SyncJSBridge";

export default class NativeEvent {
    callbackArray = [];
    _syncBridge = null; //同步原生交互桥

    /**
     * 原生模块初始化
     */
    setup() {
        this._syncBridge = new SyncJSBridge();
    }

    /**
     * 切前台
     */
    onResume() {
        Logger.error("NativeEvent onResume")
    }

    /**
     * 切后台
     */
    onPause() {
        Logger.error("NativeEvent onPause")
    }

    /**
     * 异步调用原生方法
     * @param {*} funcName 方法名
     * @param {*} funcParam 所需要的参数
     * @param {*} callback 回调函数
     */
    nativeCallAsync(funcName, funcParam = null, callback = null) {
        this.callbackArray.push({
            "funcName": funcName,
            "callback": callback
        });
        let paramsObj = {
            "funcName": funcName,
            "funcParam": JSON.stringify(funcParam)
        }
        let paramJson = JSON.stringify(paramsObj);
        this._syncBridge.asyncCall(paramJson)
    }


    NativeCallBackAsync(returnStr) {
        Logger.error("NativeCallBackAsync returnStr " + returnStr)
        if (returnStr) {
            let returnJsonObj
            try {
                returnJsonObj = JSON.parse(returnStr)
            } catch (error) {
                Logger.error("解析json失败", returnStr);
                //上报错误(top)
                Global.ReportTool.ReportClientError("nativeCallAsyncError", {
                    des: "nativeCallAsyncError",
                    content: returnStr,
                });
                //上报错误(sentry)
                // errorReport.senTryReport(error,errType.FATAL,returnStr,"nativeCallAsyncError",{"NativeCallBackAsync":false})
                return;
            }
            let index
            for (let i = 0; i < this.callbackArray.length; i++) {
                let element = this.callbackArray[i];
                if (returnJsonObj.funcName == element.funcName) {
                    index = i;
                    let mCallback = element.callback;
                    if (mCallback) {
                        mCallback(returnJsonObj)
                    } else {
                        Logger.log("call is null", element.funcName, "return name", returnJsonObj.funcName);
                    }
                } else {
                    Logger.log("element.funcName", element.funcName, "return name", returnJsonObj.funcName);
                }
            }
            if (index != null && index != undefined) {
                this.callbackArray.splice(index, 1)
            }
        } else {
            Logger.log("-----------native has no return-----")
        }
    }

    /**
     * 同步调用原生的方法
     * @param {*} funcName 调用原生的方法名
     * @param {*} funcParam 调用原生方法需要带的参数
     * @param {*} callback 调用原生方法后的回调
     */
    nativeCallSync(funcName, funcParam = null, callback = null) {}

    nativeForAndroid(classPath, funcName, paramType, params) {

    }

    nativeForIos(classPath, funcName, params) {

    }

    nativeForWeb(funcName, params = null) {
        return null
    }

    /**************************************************************同步获取参数************************************************/

    onInit() {
        this._syncBridge.onInit()

        // this.initZADunSDK("",(retObj)=>{
        //     if (retObj.result == 0 ){
        //         let port = this.getZADunPortByAddr("",8200)
        //         Logger.error("getZADunPortByAddr port " + port)
        //     }
        // })

    }

    /**
     * 原生关闭闪屏页
     */
    hideSplashView() {
        // console.log("hideSplashView",11111)
        this._syncBridge.hideSplashView()
    }

    /**
     * 原生打开闪屏页
     */
    showSplashView() {
        this._syncBridge.showSplashView()
    }

    /**
     * 获取设备信息
     * @param {*} callback 回调函数
     */
    getNativeParams(callback = null) {
      
        let retObj = this._syncBridge.getNativeParams();
        if (retObj) {
            let paramObj = JSON.parse(retObj)
            let sys = Global.Setting.SystemInfo;
            sys.deviceId = paramObj.deviceId;
            if (paramObj.firstInstallStatus) {
                let firstInstallStatusNum = Number(retObj.firstInstallStatus)
                if (firstInstallStatusNum === 1) {
                    sys.firstInstallStatus = true
                } else {
                    sys.firstInstallStatus = false
                }
            }
            if (paramObj.code) {
                sys.code = paramObj.code;
            }
            if (paramObj.version) {
                sys.version = paramObj.version
            }
            if (paramObj.device) {
                sys.device = paramObj.device
            }
            if (paramObj.mac) {
                sys.mac = paramObj.mac;
            }
            if(paramObj.build_Version_Release){
                sys.build_Version_Release = paramObj.build_Version_Release
            }
            if(paramObj.build_Version_SDK){
                sys.build_Version_SDK = paramObj.build_Version_SDK
            }
            if(paramObj.build_Model){
                sys.build_Model = paramObj.build_Model
            }
            if(paramObj.build_Brand){
                sys.build_Brand = paramObj.build_Brand
            }
            if(paramObj.start_time){
                try {
                    sys.start_time = JSON.parse(paramObj.start_time)
                } catch (error) {
                    
                }
            }
            if(paramObj.appurl){
                try {
                    sys.appurl = JSON.parse(paramObj.appurl)
                } catch (error) {
                    
                }
            }
            if (paramObj.appChannel) {
                sys.packChannel = paramObj.appChannel
            }
            if (paramObj.appVersion) {
                sys.appVersion = paramObj.appVersion
            }
            if (paramObj.pkgVersion) {
                sys.pkgVersion = paramObj.pkgVersion
            }
            if (paramObj.vendorChannel) {
                sys.vendorChannel = paramObj.vendorChannel
            }
            if (paramObj.gameUrlJsonCfg) {
                sys.gameUrlJsonCfg = paramObj.gameUrlJsonCfg
            }
            if (paramObj.clipboardText) {
                sys.clipboardText = paramObj.clipboardText;
            }
            if (paramObj.screenWidth) {
                sys.nativeScreenWidth = paramObj.screenWidth;
            }
            if (paramObj.screenHeight) {
                sys.nativeScreenHeight = paramObj.screenHeight;
            }
            if (paramObj.screenDensity) {
                sys.nativeScreenDensity = paramObj.screenDensity;
            }
            if (paramObj.screenDensityDpi) {
                sys.nativeScreenDensityDpi = paramObj.screenDensityDpi;
            }
            if (paramObj.hostIp) {
                sys.hostIp = paramObj.hostIp;
            }
            if (paramObj.osBuildModel) {
                sys.osBuildModel = paramObj.osBuildModel;
            }
            if (paramObj.osBuildVersionSDK) {
                sys.osBuildVersionSDK = paramObj.osBuildVersionSDK;
            }
            if (paramObj.osBuildVersionRelease) {
                sys.osBuildVersionRelease = paramObj.osBuildVersionRelease;
            }
            if (paramObj.nativeLog) {
                let nativeLogNum = Number(paramObj.nativeLog);
                if (nativeLogNum === 1) {
                    sys.nativeLog = true;
                } else {
                    sys.nativeLog = false;
                }
            }
            if (paramObj.bundleName) {
                sys.bundleName = paramObj.bundleName;
            }
            if (paramObj.openinstallkey) {
                sys.openInstallKey = paramObj.openinstallkey;
            }
            if (paramObj.shareinstallkey) {
                sys.shareInstallKey = paramObj.shareinstallkey;
            }
            if (paramObj.platform) {
                let nativePlatform = paramObj.platform
                sys.nativePlatform = nativePlatform
            }
            if (paramObj.isIphoneX) {
                let iphoneXFlag = paramObj.isIphoneX;
                if (Number(iphoneXFlag) === 1) {
                    sys.isIphoneX = true;
                }
            }
            if (paramObj.appConstUrl) {
                sys.appConstUrl = paramObj.appConstUrl
            }
            if (paramObj.appConstBackupUrl) {
                sys.appConstBackupUrl = paramObj.appConstBackupUrl;
            }
            if (paramObj.appConstBackupUrl1) {
                sys.appConstBackupUrl1 = paramObj.appConstBackupUrl1;
            }
            if (paramObj.appConstUrlArray) {
                let appConstUrlArray = JSON.parse(paramObj.appConstUrlArray);
                if (appConstUrlArray) {
                    sys.appConstUrlArray = Global.UrlUtil.dealFullUrlWithMutiLinesSameHost(appConstUrlArray)
                }
            }
            if (paramObj.appID) {
                sys.appID = paramObj.appID
            }
            if (paramObj.subPlatformID) {
                sys.subPlatformID = paramObj.subPlatformID
            }
            if (paramObj.appName) {
                sys.appName = paramObj.appName;
            }
            if (paramObj.zipModel) {
                let zipModel = paramObj.zipModel;
                if (Number(zipModel) === 1) {
                    sys.zipModel = true;
                }
            }
            if (paramObj.wxKey) {
                sys.wxKey = paramObj.wxKey;
            }
            if (paramObj.jpushKey) {
                sys.jpushKey = paramObj.jpushKey;
            }
            if (paramObj.appSign) {
                sys.appSign = paramObj.appSign;
            }
            //生产厂商
            if (Helper.isAndroid()) {
                if (paramObj.deviceBrand) {
                    sys.deviceBrand = paramObj.deviceBrand;
                }
                let storageUid = Global.Setting.storage.get(StorageKey.Uid);
                let storageSvrId = Global.Setting.storage.get(StorageKey.ServerDeviceId);
                if (storageSvrId) {
                    sys.server_id = storageSvrId;
                }
                //老玩家
                if (storageUid && (storageSvrId == null || storageSvrId == "" || storageSvrId == 0)) {
                    sys.server_id = paramObj.deviceId;
                }
            } else if (Helper.isIos()) {
                sys.deviceBrand = "Apple";
            }
        }    
        if (callback) {
            callback()
        }
    }

    getNativeDataInfo() {
        return this._syncBridge.getNativeDataInfo()
    }

    openAppBrowser(url) {
        this._syncBridge.openAppBrowser(url)
    }

    exitApp() {
        this._syncBridge.exitApp()
    }

    clearNativeRes() {
        this._syncBridge.clearNativeRes()
    }

    localStorageClear() {
        this._syncBridge.localStorageClear();
    }

    getTextFromClipboard() {
        return this._syncBridge.getTextFromClipboard()
    }

    //粘贴文本到剪切板
    copyTextToClipboard(txt) {
        let funcParam = {};
        funcParam["txt"] = txt;
        this._syncBridge.copyTextToClipboard(JSON.stringify(funcParam))
    }

    checkWXInstall() {
        let ret = this._syncBridge.checkWXInstall()
        if (ret == null || ret == undefined) {
            ret = -1;
        }
        let retObj = {};
        retObj["result"] = ret;
        retObj["funcParam"] = "";
        return retObj;
    }

    checkAliPayInstalled() {
        let ret = this._syncBridge.checkAliPayInstalled()
        if (ret == null || ret == undefined) {
            ret = -1;
        }
        let retObj = {};
        retObj["result"] = ret;
        retObj["funcParam"] = "";
        return retObj;
    }

    //设置闹钟: 支持平台Android
    setAlarmClock(title,hour,minute){
        this._syncBridge.setAlarmClock(title,hour,minute)
    }

    //取消闹钟: 支持平台Android
    cancelAlarmClock(title){
        this._syncBridge.cancelAlarmClock(title)
    }

    //启动一个本地通知: 支持平台Android/IOS
    addLocalNotification(title,content,time){
        this._syncBridge.addLocalNotification(title,content,time)
    }

    //取消一个本地通知: 支持平台Android/IOS
    cancelLocalNotification(time){
        this._syncBridge.cancelLocalNotification(time)
    }



    /**************************************************************异步获取参数************************************************/

    /***
     * 启动一个日历提醒：支持Android/IOS
     * @param title: 标题
     * @param content: 内容
     * @param startTime: 开始时间，Android单位ms IOS单位s 
     * @param endTime: 结束时间，Android单位ms IOS单位s
     * @param remind_minutes: 提前提醒的时间，单位分钟
     * @param callback: 回调
     * 
     * *****/
    addCalendarNotification(title,content,startTime,endTime,remind_minutes,callback){
        Logger.error("========================addCalendarNotification");
        if (title == null || content == null || startTime == null || endTime == null || remind_minutes == null){
            Logger.error("========================addCalendarNotification param error");
            return;
        }
        let funcParam = {};
        funcParam["title"] = title;
        funcParam["content"] = content;
        funcParam["startTime"] = startTime;
        funcParam["endTime"] = endTime;
        funcParam["remind_minutes"] = remind_minutes;
        this.nativeCallAsync("addCalendarNotification", funcParam, (retObj) => {
            if (callback) {
                callback(retObj);
                callback = null;
            }
        })
    }

    /***
     * 取消一个日历提醒：支持Android/IOS
     * @param title: 标题
     * @param content: 内容
     * @param startTime: 开始时间，Android单位ms IOS单位s
     * @param callback: 回调
     * 
     * *****/
    cancelCalendarNotification(title,content,startTime,endTime,callback){
        Logger.error("========================cancelCalendarNotification");
        if (title == null || content == null || startTime == null ){
            Logger.error("========================cancelCalendarNotification param error");
            return;
        }
        let funcParam = {};
        funcParam["title"] = title;
        funcParam["content"] = content;
        funcParam["startTime"] = startTime;
        funcParam["endTime"] = endTime;
        this.nativeCallAsync("cancelCalendarNotification", funcParam, (retObj) => {
            if (callback) {
                callback(retObj);
                callback = null;
            }
        })
    }

    //获取本地渠道信息
    getLocalInstallInfo(callback) {
        Logger.error("========================getLocalInstallInfo");
        this.nativeCallAsync("getLocalInstallInfo", null, (retObj) => {
            if (callback) {
                callback(retObj);
                callback = null;
            }
        })
    }

    /**
     * 初始化openinstall
     * @param {*} callback 
     */
    getOpenInstallData(callback = null) {
        this.nativeCallAsync("getOpenInstallData", null, (retObj) => {
            if (retObj.result == 0) {
                let content = retObj.funcParam;
                if (callback) {
                    callback(content);
                    callback = null;
                }
            } else {
                Logger.error("getOpenInstallData失败");
                if (callback) {
                    callback(null);
                    callback = null;
                }
            }
        })
    }

    /**
     * 初始化shareInstall
     * @param {*} callback 
     */
    getShareInstallData(callback = null) {
        this.nativeCallAsync("getShareInstallData", null, (retObj) => {
            if (retObj.result == 0) {
                let content = retObj.funcParam;
                if (callback) {
                    callback(content);
                    callback = null;
                }
            } else {
                if (callback) {
                    callback(null);
                    callback = null;
                }
            }
        })
    }

    //iOS 专用 获取info.plist 对应的key 的值
    getInfoPlistParam(key, callback = null) {
        let funcParam = {};
        funcParam["key"] = key;
        this.nativeCallAsync("getInfoPlistParam", funcParam, (retObj) => {
            if (callback) {
                callback(retObj);
                callback = null;
            }
        })
    }

    //原生端解密
    decryptData(encryptData) {
        if (Helper.isWeb()) {
            return null;
        }
        let retData = this._syncBridge.decryptData(encryptData);
        if (retData) {
            let retObj = {};
            retObj["result"] = 0;
            retObj["funcParam"] = retData;
            return retObj;
        }
    }

    /**
     * 设置白名单域名,不进行域名校验
     * @param {*} hosts 字符串数组
     */
    setWhiteHosts(hosts) {
        let funcParam = {};
        funcParam["hosts"] = hosts;
        let retObj = this.nativeCallSync("setWhiteHosts", funcParam);
        return retObj;
    }

    //获取loginSign
    getLoginSign(sign_key, deviceId, callback = null) {
        let retData = this._syncBridge.getLoginSign(sign_key, deviceId);
        if (retData) {
            let retObj = {};
            retObj["result"] = 0;
            retObj["funcParam"] = retData;
            return retObj;
        }
    }

    //本地开关控制
    nativeLog(isOpenLog) {
        let funcParam = {};
        let openLogTag = 1;
        if (isOpenLog) {
            openLogTag = 1;
        } else {
            openLogTag = 0;
        }
        funcParam["openlog"] = openLogTag;
        Logger.error("nativeLog========openLogTag ", +openLogTag);
        this.nativeCallSync("nativeLog", funcParam);
    }

    /**
     * 旧DNS原生方法
     * @param {*} urls 
     * @param {*} callback 
     */
    startRequest(urls, callback = null) {
        if (urls == null && urls.length == 0) {
            return;
        }
        let urlsStr = urls.join(";");
        let internalHttpDNSUrl = "edge.wshttpdns.com"
        let foreignHttpDNSUrl = "220.242.54.8";
        let map = {};
        map["httpDns"] = internalHttpDNSUrl
        map["domainUrl"] = urlsStr;
        this.nativeCallAsync("startRequest", map, (retObj) => {
            if (retObj.result == 0) {
                //content 为 1 正常，content 为0表示网宿服务器异常
                let content = retObj.funcParam;
                Logger.error("startRequest funcParam = " + content);
                this.requestAgain(foreignHttpDNSUrl, urlsStr);
                if (callback) {
                    callback(content);
                }
            }
        })
    }

    //添加再次请求httpDNS
    requestAgain(httpDNSUrl, domainUrl, callback = null) {
        Logger.error("requestAgain httpDNSUrl = " + httpDNSUrl + " domainUrl = " + domainUrl)
        let param = {
            httpDns: httpDNSUrl,
            domainUrl: domainUrl
        }
        this.nativeCallAsync("requestAgain", param, (retObj) => {
            if (retObj.result == 0) {
                let funcParam = retObj.funcParam;
                //content 为 1 正常，content 为0表示网宿服务器异常
                Logger.error("requestAgain funcParam = " + funcParam)
                if (callback) {
                    callback(funcParam);
                }
            }
        })
    }

    //设置http 请求的header属性 map
    setRequestProperty(propertys) {
        this._syncBridge.setRequestProperty(propertys)
    }

    /**
     * 阿里云httpDNS初始化
     * @param {*} accountID 账号id 
     * @param {*} callback 回调函数
     */
    initAlicloudHttpDns(accountID, callback = null) {
        let param = {
            accountID: accountID,
        }
        Logger.error("call initAlicloudHttpDns :", JSON.stringify(param))
        this.nativeCallAsync("initAlicloudHttpDns", param, (retObj) => {
            if (callback) {
                callback(retObj);
            }
        })
    }

    /**
     * 阿里云httpDNS 将app使用到的域名预设进来，以便于HTTPDNS 进行预解析
     * @param {*} preResolveHosts 预处理域名数组转json
     * @param {*} callback 回调函数
     */
    setPreResolveHosts(preResolveHosts, callback = null) {
        let param = {
            preResolveHosts: preResolveHosts,
        }
        Logger.error("call setPreResolveHosts :", JSON.stringify(param))
        this.nativeCallAsync("setPreResolveHosts", param, (retObj) => {
            if (callback) {
                callback(retObj);
            }
        })
    }

    /**
     * 阿里云httpDNS 异步解析接口，首先查询缓存，若存在则返回结果列表，若不存在返回空列表并且进行异步域名解析更新缓存
     * @param {*} host 域名名称
     * @param {*} callback 该域名下的IP数组 json字符串
     */
    getIpsByHostAsync(host, callback = null) {
        let param = {
            host: host,
        }
        Logger.error("call getIpsByHostAsync :", JSON.stringify(param))
        this.nativeCallAsync("getIpsByHostAsync", param, (retObj) => {
            if (callback) {
                callback(retObj);
            }
        })
    }

    /****************** Yun_Dun ************************/
    /**
     * 异步初始化云盾
     * @param {*} accessKey 密钥
     * @param {*} uuid uid
     * @param {*} callback  回调函数 
     */
    initYunDunSDK(accessKey, uuid, callback = null) {
        let param = {
            accessKey: accessKey,
            uuid: uuid
        }
        this.nativeCallAsync("initYunDunSDK", param, (retObj) => {
            if (callback) {
                callback(retObj);
            }
        })
    }

    /**
     * 获取YunDun初始化结果,同步调用
     */
    getYunDunInitRet() {
        if (Helper.isIos() || Helper.isAndroid()) {
            return this._syncBridge.getYunDunInitRet();
        } else {
            return -1;
        }
    }

    /**
     * 获取YunDun接口
     * @param {*} host  域名 
     * @param {*} port  端口
     */
    getYunDunServerIPAndPort(host, port) {
        let portNum = Number(port);
        if (Helper.isIos() || Helper.isAndroid()) {
            return this._syncBridge.getYunDunServerIPAndPort(host, portNum);
        } else {
            return null;
        }
    }
    /****************** Yun_Dun结束 ********************/

    /****************** ZA_Dun *************************/
    /**
     * 初始化ZA盾
     * @param {*} key ZA盾key
     * @param {*} callback 回调函数
     */
    initZADunSDK(key, callback = null) {
        let param = {
            key: key
        };
        this.nativeCallAsync("initZADunSDK", param, (retObj) => {
            if (callback) {
                callback(retObj);
            }
        })
    }

    getZADunInitRet() {
        if (Helper.isIos() || Helper.isAndroid()) {
            return this._syncBridge.getZADunInitRet();
        }
        return -1;
    }

    getZADunPortByAddr(addr, port) {
        let portNum = Number(port);
        if (Helper.isIos() || Helper.isAndroid()) {
            return this._syncBridge.getZADunPortByAddr(addr, portNum);
        }
        return 0
    }
    /****************** ZA_Dun 结束*************************/
    /****************** Ali_Dun 开始************************/
    /**
     * 异步初始化阿里盾
     * @param {*} appkey 
     * @param {*} token 
     * @param {*} callback 
     */
    initAliDunSDK(appkey, token, callback = null) {
        let param = {
            appkey: appkey,
            token: token
        }
        this.nativeCallAsync("initAliDunSDK", param, (retObj) => {
            if (callback) {
                callback(retObj);
            }
        })
    }

    /**
     * Ali_Dun初始化结果，异步调用
     */
    getAliDunInitRet() {
        if (Helper.isIos() || Helper.isAndroid()) {
            return this._syncBridge.getAliDunInitRet();
        } else {
            return -1
        }
    }

    /**
     * 获取AliDun盾接口
     * @param {*} hostInfo 
     * @param {*} port 
     */
    getAliDunPort(hostInfo, port) {
        let portStr = port.toString();
        let token = hostInfo.token;
        let groupName = hostInfo.groupName;
        let domainName = hostInfo.domainName;
        if (Helper.isIos() || Helper.isAndroid()) {
            return this._syncBridge.getAliDunServerPort(token, groupName, domainName, portStr);
        } else {
            return 0;
        }
    }
    /****************** Ali_Dun 结束************************/
    /**
     * 判断是否支持哪个盾
     * @param {*} sdkName   盾sdk名字 
     * @param {*} version   当前版本号
     * @param {*} callback  回调函数 
     */
    isSupportSDK(sdkName, version = "", callback = null) {
        if (Helper.isWeb()) {
            return true;
        }
        let value = sdkName;
        if (version) {
            value = value + "_" + version;
        }
        let param = {
            checkValue: value
        }

        let ret = this._syncBridge.isSupportSDK(param)
        let retObj = {};
        retObj["result"] = ret;
        retObj["funcParam"] = "";
        if (callback) {
            callback(retObj)
        }
    }

    /****************** 支付************************/
    //检测支付宝是否安装
    checkAliPayInstalled(callback) {
        let ret = this._syncBridge.checkAliPayInstalled()
        let retObj = {};
        retObj["result"] = ret;
        retObj["funcParam"] = "";
        if (callback) {
            callback(retObj)
        }

    }

    //支付宝订单
    paymentAliPayOrder(orderStr, callback) {
        let funcParam = {};
        funcParam["orderStr"] = orderStr;
        funcParam["packageName"] = Global.Setting.alipayReportPackageName
        this.nativeCallAsync("paymentAliPayOrder", funcParam, (retObj) => {
            if (callback) {
                callback(retObj);
                callback = null;
            }
        })
    }

    //检查微信是否安装
    checkWXInstall(callback) {
        let ret = this._syncBridge.checkWXInstall()
        let retObj = {};
        retObj["result"] = ret;
        retObj["funcParam"] = "";
        if (callback) {
            callback(retObj)
        }
    }

    //微信订单
    paymentWXPayOrder(orderStr, callback) {
        let funcParam = {};
        funcParam["orderStr"] = orderStr;
        this.nativeCallAsync("paymentWXPayOrder", funcParam, (retObj) => {
            if (callback) {
                callback(retObj);
                callback = null;
            }
        })
    }
    //支付宝h5转Native
    aliPayInterceptorWithUrl(payUrl, callback) {
        let funcParam = {};
        funcParam["payUrl"] = payUrl;
        this.nativeCallAsync("payInterceptorWithUrl", funcParam, (retObj) => {
            if (callback) {
                callback(retObj);
                callback = null;
            }
        })
    }

    //关闭支付宝支付h5 webview页面
    hideAliPayWebView() {
        this._syncBridge.hideAliPayWebView()
    }

    /****************** 震动************************/
    /**
     * 手机的震动 
     * @param milliseconds 震动的时长，单位为毫秒,默认为400毫秒
     */
    phoneVibrates(milliseconds = 400) {
        let params = {
            "milliseconds": milliseconds
        }
        this.nativeCallAsync("phoneVibrates", params);
    }

    /**
     * 取消震动 
     */
    phoneVibratesCancel() {
        this.nativeCallAsync("vibratesCancel", {});
    }

    /**
     * 原生storage存储Get
     */
    localStorageGetItem(key) {
        return this._syncBridge.localStorageGetItem(key);
    }

    /**
     * 原生storage存储Set
     */
    localStorageSetItem(key, value) {
        this._syncBridge.localStorageSetItem(key, value);
    }

    /**
     * 原生storage删除key
     * @param {*} key 
     */
    localStorageRemoveItem(key) {
        this._syncBridge.localStorageRemoveItem(key);
    }
}