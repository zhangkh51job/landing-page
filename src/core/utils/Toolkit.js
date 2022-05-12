import Helper from "../helper";
import StorageKey from "../const/StorageKey";
import Global from "../Global";
import { DUNTYPE } from "../net/dun/AppDunControl";

export default class Toolkit{
    getHostFromUrl(url){
        if(url == null || url == ""){
            return url
        }
        let arrs = url.split("//");
        let tempUrl = url;
        if(arrs.length > 1){
            tempUrl = arrs[1];
        }
        arrs = tempUrl.split("/");
        let host = arrs[0];
        if(host.indexOf(":") > -1){
            host = host.split(":")[0];
        }
        return host;
    }

    getPortFromUrl(url){
        if(url == null || url == ""){
            return null
        }
        let arrs = url.split("//");
        let tempUrl = url;
        if(arrs.length > 1){
            tempUrl = arrs[1];
        }
        arrs = tempUrl.split("/");
        let hostUrl = arrs[0];
        let port = null;
        if(hostUrl.indexOf(":") > -1){
            port = hostUrl.split(":")[1];
        }
        if(port && Number(port)){
            return Number(port);
        }
        return null;
    }

    genDeviceId(){
        function S4(){
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }
        function guid(){
            return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
        }
        return guid();
    }

    genDeviceInfo(tryPlay = false){
        let device = {};
        device.device_id = "[" + Global.Setting.SystemInfo.deviceId + "]";
        device.os_type = Global.Toolkit.getOsType();
        device.app_version = Global.Setting.SystemInfo.appVersion;
        device.phone_model = Global.Setting.SystemInfo.osBuildModel;
        device.sign = Global.Setting.SystemInfo.loginSign;
        device.dataUrl = Global.Setting.curDataUrl;
        device.phone_device_brand = Global.Setting.SystemInfo.deviceBrand;
        device.wx_key = Global.Setting.SystemInfo.wxKey; 
        var nativeScreenWidth = Global.Setting.SystemInfo.nativeScreenWidth;
        var nativeScreenHeight = Global.Setting.SystemInfo.nativeScreenHeight;
        //屏幕宽度（像素）
        device.w = Number(nativeScreenWidth<nativeScreenHeight?nativeScreenWidth:nativeScreenHeight)||0;
        // 屏幕高度（像素）
        device.h = Number(nativeScreenWidth>nativeScreenHeight?nativeScreenWidth:nativeScreenHeight)||0;
        if (Helper.isAndroid() && (Global.Toolkit.versionCompare(Helper.sysInfo().osVersion, "9") >= 0)) {
            device.need_sid = 1
        }
        device.server_id = Global.Setting.SystemInfo.server_id;
        if(tryPlay){
            device.need_sid = 1;
        }
        return device;
    }

    genRegInfo() {
        let regInfo = {};
        regInfo.packInfo = Global.Setting.ChannelInfo;   //渠道信息
        regInfo.bundleName = Global.Setting.SystemInfo.bundleName;  //包名
        regInfo.appVersion = Global.Setting.SystemInfo.appVersion;  //版本号
        regInfo.openInstallKey = Global.Setting.SystemInfo.openInstallKey;  //openinstall key
        regInfo.shareInstallKey = Global.Setting.SystemInfo.shareInstallKey;  //shareinstall key 
        regInfo.firstOpenTime = this.getFirstOpenTime();  //第一次打开时间
        regInfo.osType = this.getOsType();              //系统类型
        return JSON.stringify(regInfo);
    }

    getFirstOpenTime() {
        let time = Global.Setting.storage.get("FirstOpenTime");
        if (time == null || time == "") {
            time = Date.now().toString();
            Global.Setting.storage.set("FirstOpenTime", time);
        }
        return time;
    }

    getOsType(){
        if(Helper.isWeb()){
            return 1;
        }
        if(Helper.isAndroid()){
            return 2;
        }
        if(Helper.isIos()){
            return 3;
        }
        return 1;
    }

    isInteger(obj) {
        return parseInt(obj, 10) === obj
    }

    //比对版本
    versionCompare(versionA,versionB){
        var vA = versionA.split('.');
        var vB = versionB.split('.');
        for (var i = 0; i < vA.length; ++i) {
            var a = parseInt(vA[i]);
            var b = parseInt(vB[i] || "0");
            if (a === b) { continue; }
            else { return a - b; }
        }
        if (vB.length > vA.length) { return -1; }
        else { return 0; }
    }

    //替换空字符串
    strReplaceCtrChar(str){
        // if(str){
        //     return str.replace(/[\x00-\x1f]+/g, '');
        // }
        return str;
    }

    //获取url 参数
    getUrlCommonParam() {
        let timeStr = this.getTimeEndFixParam();
        let param = "uid=" + Number(localStorage.getItem(StorageKey.Uid))+ "&token=" + localStorage.getItem(StorageKey.Token) + "&appver=" + Global.Setting.SystemInfo.appVersion + "&os=" + Global.Toolkit.getOsType() + "&m=" + timeStr;
        return param;
    }

    //获取登录前和登录中通用参数
    getLoginCommonParam(){
        let uid = Number(Global.Setting.storage.get(StorageKey.Uid)) || 0;
        let timeStr = this.getTimeEndFixParam();
        let param = "uid=" + uid  + "&appver=" + Global.Setting.SystemInfo.appVersion + "&os=" + Global.Toolkit.getOsType() + "&n=" + (new Date()).valueOf() + "&m=" + timeStr ;
        return param;
    }

    //获取时间字符串
    getTimeEndFixParam() {
        let date = new Date()
        let timeStr = date.getHours().toString() + date.getMinutes().toString() + date.getSeconds().toString() + date.getMilliseconds()
        return timeStr
    }

    //去掉首尾两端的空格(^\s*)|(\s*$)
    functionSw(str){ 
        return str.replace(/(^\s*)|(\s*$)/g, "");
    }


   

    substrEndWithElli(str, byteLen, notAppend = false) {
        str = Global.Toolkit.removeEmoji(str)
        let count = this.getTotalBytes(str),
            len = byteLen;
        if (str == '' || count <= byteLen)
            return str;
        let result = '';
        for (let i = 0; i < str.length; i++) {
            let s = str.charAt(i);
            len -= this.getByte(s);
            if (len < 0)
                break;
            result += s;
        }
        if (notAppend) {
            return result;
        }
        else {
            return result + "..";
        }
    }

    getByte(str = '') {
        let nByte = 0;
        console.log(str)
        // if (str.match(/[^\x00-\xff]/ig) != null) {
        //     nByte = 2;
        // } else {
        //     nByte = 1;
        // }
        return nByte;
    }

    getTotalBytes(str = '') {
        let byteValLen = 0;
        for (var i = 0; i < str.length; i++) {
            let nByte = this.getByte(str[i]);
            byteValLen += nByte;
        }
        return byteValLen;
    }

    removeEmoji(content) {
        return content.replace(/(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g, "?");
    }
    
    //判断是都是IP
    checkIsIp(ipAddress){
        if(ipAddress){
            let re = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
            if (re.test(ipAddress)) {
                return true;
            }
        }
        return false;
    }

    genLoadingAppInfo(){
        let packId = Global.Setting.SystemInfo.packChannel || 0;
        let appVer = Global.Setting.SystemInfo.appVersion;
        //游戏大厅版本号
        let hallVer = window.envInfo && window.envInfo.version ? window.envInfo.version : "0";
        let isYunDunInit = Global.AppDun.getDunIsInitByType(DUNTYPE.YUN_DUN);
        let isZADunInit = Global.AppDun.getDunIsInitByType(DUNTYPE.ZA_DUN);
        let isAliDunInit = Global.AppDun.getDunIsInitByType(DUNTYPE.Ali_DUN);
        let verStr = packId + "•" + appVer + "•" + hallVer;
        if (isYunDunInit) {
            verStr = verStr + "•Y"
        }
        if (isZADunInit) {
            verStr = verStr + "•Z"
        }
        if (isAliDunInit){
            verStr = verStr + "•A"
        }
        return verStr;
    }

    genAppInfo(){
        let loadingAppInfo = this.genLoadingAppInfo();
        let appId = Global.Setting.getNativeAppid();
        let channelPack = Global.Setting.ChannelInfo.configChannel || 0;
        return loadingAppInfo + "_" + appId + "•" + channelPack;
    }

    //从[0-max)中选 随机一个整数
    getRoundInteger(to, from = 0) {
        return Math.floor(from + Math.random() * (to - from));
    }
}