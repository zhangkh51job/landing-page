import StorageKey from "../const/StorageKey";
import Global from "../Global";
import Helper from "../helper"
export default class SystemInfo {
    _version = ""; //版本号
    _deviceId = ""; //设备号
    _isIphoneX = false; //是否是iphoneX
    _netWorkType = -1; //-1 none 1 wifi 2: 2G 3:3G 4:4G
    _isNetworkAvailable = true;
    _firstInstallStatus = false; //是否是第一次安装
    _ipAddress;
    _isSupportWSS = false; //是否支持WSS协议
    _appVersion = ""; //appNative游戏版本号，供强更使用
    _pkgVersion; //app包版本
    _gameUrlJsonCfg; //App gameUrl json 配置
    _vendorChannel = ""; //渠道id
    _nativeLog = false; //本地打印是否开启
    _bundleName; //原生包名
    _loginSign = ""; //签名
    //原生返回新增字段
    build_Version_Release = "";
    build_Version_SDK = ""
    build_Model = ""
    build_Brand = ""
    start_time = []; //app打开时间+次数
    //版本号
    version = "";
    //设备号
    device = "";
    //推广码
    code = "";
    //mac
    mac = "";
    //appurl
    appurl = null

    wxKey;
    jpushKey;
    appSign;

    nativeScreenWidth = "0";
    nativeScreenHeight = "0";
    nativeScreenDensity = "0";
    nativeScreenDensityDpi = "0";
    clipboardText;
    ChannelInfo;
    hostIp;
    osBuildModel;
    osBuildVersionSDK;
    osBuildVersionRelease;
    inviteSourceType = 0;
    deviceBrand = "";

    nativePlatform;
    //app端渠道
    packChannel = null;
    openInstallKey = "";
    shareInstallKey = "";
    _appConstUrl = "";

    //     "device": "520000000052549",
    //   "build_Version_Release": "6.0.1",
    //   "appversion": 10000,
    //   "starttime": [
    //     1606291219960
    //   ],
    //   "mac": "08:00:27:55:2D:4B",
    //   "version": "1.0.2_10000",
    //   "build_Version_SDK": "23",
    //   "appurl": [
    //     "https://intest2.ncjimmy.com"
    //   ],
    //   "build_Model": "MuMu",
    //   "build_Brand": "Android",
    //   "code": ""

    appConstUrlArray = []; //app data 域名数组(包里面的数组)
    appID = "";
    subPlatformID = ""; //总代id
    appName = ""; //app名称
    zipModel = false; //是否zip方式

    orientationLandscape = true; //横屏
    server_id = ""; //服务器下发的servre_id;

    cerDirFiles = [];

    get deviceId() {
        if (this._deviceId == null || this._deviceId == "") {
            let deviceid = Global.Setting.storage.get(StorageKey.WebDeviceId);
            if (deviceid == null || deviceid == "") {
                deviceid = Global.Toolkit.genDeviceId();
                Global.Setting.storage.set(StorageKey.WebDeviceId, deviceid);
            }
            this._deviceId = deviceid;
        }
        return this._deviceId.trim();
    }
    set deviceId(v) {
        if (v == null || v == "") {
            return
        }
        this._deviceId = v;
    }

    get ipAddress() {
        return this._ipAddress;
    }
    set ipAddress(v) {
        this._ipAddress = v;
    }

    get version() {
        return this._version;
    }
    set version(ver) {
        this._version = ver;
    }

    get isIphoneX() {
        return this._isIphoneX;
    }
    set isIphoneX(v) {
        this._isIphoneX = v;
    }

    get netWorkType() {
        return this._netWorkType;
    }
    set netWorkType(v) {
        this._netWorkType = v;
    }

    get isNetworkAvailable() {
        return this._isNetworkAvailable;
    }
    set isNetworkAvailable(v) {
        this._isNetworkAvailable = v;
    }

    get firstInstallStatus() {
        return this._firstInstallStatus;
    }
    set firstInstallStatus(v) {
        this._firstInstallStatus = v;
    }

    get isSupportWSS() {
        if (Helper.isWeb()) {
            return true;
        } else {
            return this._isSupportWSS;
        }
    }
    set isSupportWSS(flag) {
        this._isSupportWSS = flag;
    }

    get appVersion() {
        // if(Helper.isWeb()){
        //     return "40000";
        // }else{
        return this._appVersion;
        // }
    }
    set appVersion(flag) {
        this._appVersion = flag;
    }

    get pkgVersion() {
        if (Helper.isWeb()) {
            return ""
        } else {
            return this._pkgVersion;
        }
    }
    set pkgVersion(flag) {
        this._pkgVersion = flag;
    }

    get gameUrlJsonCfg() {
        return this._gameUrlJsonCfg;
    }
    set gameUrlJsonCfg(cfg) {
        this._gameUrlJsonCfg = cfg;
    }

    get vendorChannel() {
        if (Helper.isWeb()) {
            return ""
        } else {
            this._vendorChannel;
        }
        return ""
    }
    set vendorChannel(flag) {
        this._vendorChannel = flag;
    }

    get nativeLog() {
        if (Helper.isWeb()) {
            return false;
        } else {
            return this._nativeLog;
        }
    }
    set nativeLog(flag) {
        this._nativeLog = flag;
    }

    get bundleName() {
        if (Helper.isWeb()) {
            return ""
        } else {
            return this._bundleName;
        }
    }
    set bundleName(flag) {
        this._bundleName = flag;
    }

    get loginSign() {
        return this._loginSign;
    }
    set loginSign(flag) {
        this._loginSign = flag;
    }

    get appConstUrl() {
        return this._appConstUrl;
    }
    set appConstUrl(url) {
        this._appConstUrl = url;
    }
}