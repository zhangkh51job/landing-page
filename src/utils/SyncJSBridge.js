// import { Logger } from "../debug/Logger";
import Helper from "./helper";
// import Global from "../Global"
/****
 * 同步获取参数类
 * ****/
export default class SyncJSBridge{
    _jsBridge = null;

    setup(){
        // Logger.log("SyncJSBridge  初始化")
    }

    /**
     * 初始化
     * @param {*} null 
     * @returns null
     */
    onInit(){
        if (Helper.isIos()) {
            this._excuteIosFunc("onInit")
        }else if(Helper.isAndroid()){
            if (!this._checkNativeObject()){
                return;
            }
            if (this._jsBridge && this._jsBridge.onInit){
                this._jsBridge.onInit();
            }
        }
        
    }

    /**
     * 获取原生基础数据
     * @param {*} null 
     * @returns json string  
     */
    getNativeParams(){
        if (Helper.isIos()) {
            return this._excuteIosFunc("getNativeParams")
        }else if(Helper.isAndroid()){
            if (!this._checkNativeObject()){
                return;
            }
            
            if (this._jsBridge && this._jsBridge.getNativeParams){
                let parms = this._jsBridge.getNativeParams();
                return parms;
            }
        }
        
    }

    /**
     * 获取加密数据
     * @param {*} sign_key 
     * @param {*} deviceId
     * @returns 加密数据 
     */
    getLoginSign(sign_key,deviceId){
        if (Helper.isIos()) {
            let params = {"sign_key":sign_key,"deviceId":deviceId}
            return this._excuteIosFunc("getLoginSign",JSON.stringify(params))
        }else if(Helper.isAndroid()){
            if (!this._checkNativeObject()){
                return;
            }
            if(this._jsBridge && this._jsBridge.getLoginSign){
                let retData = this._jsBridge.getLoginSign(sign_key,deviceId);
                return retData;
            }
        }
        
    }


    /**
     * 隐藏闪屏页
     */
    hideSplashView(){
     
        if (Helper.isIos()) {
            this._excuteIosFunc("hideSplashView")
            // Global.ReportTool.reportAppOpen()
        }else if(Helper.isAndroid()){
       
            if (!this._checkNativeObject()) return;
            if(this._jsBridge && this._jsBridge.hideSplashView){
                this._jsBridge.hideSplashView()
                // Global.ReportTool.reportAppOpen()
            }
        }
        
    }

    /**
     * 显示闪屏页
     */
    showSplashView(){
        if (Helper.isIos()) {
            this._excuteIosFunc("showSplashView")
        }else if(Helper.isAndroid()){
            if (!this._checkNativeObject()){
                return;
            }
            if(this._jsBridge && this._jsBridge.showSplashView){
                this._jsBridge.showSplashView()
            }
        }
        
    }

    /**
     * 获取原生解密后的data信息
     */
    getNativeDataInfo(){
        if (Helper.isIos()) {
            return this._excuteIosFunc("getNativeDataInfo")
        }else if(Helper.isAndroid()){
            if (!this._checkNativeObject()){
                return;
            }
            if(this._jsBridge && this._jsBridge.getNativeDataInfo){
                return this._jsBridge.getNativeDataInfo()
            }
        }
        
    }

    /**
     * 解密信息
     * @param {*} encryptData 
     * @returns decryptData 
     */
    decryptData(encryptData){
        if (Helper.isIos()) {
            let params = {"encryptData":encryptData}
            return this._excuteIosFunc("decryptData",JSON.stringify(params))
        }else if(Helper.isAndroid()){
            if (!this._checkNativeObject()){
                return;
            }
            if(this._jsBridge && this._jsBridge.decryptData){
                return this._jsBridge.decryptData(encryptData)
            }
        }
        
    }

    /**
     * 设置头部
     * @param {*} paramJson 
     * @returns  
     */
    setRequestProperty(paramJson){
        if (Helper.isIos()) {
            let params = {"data":paramJson}
            this._excuteIosFunc("setRequestProperty",JSON.stringify(params))
        }else if(Helper.isAndroid()){
            if (!this._checkNativeObject()){
                return;
            }
            if(this._jsBridge && this._jsBridge.setRequestProperty){
                this._jsBridge.setRequestProperty(paramJson)
            }
        }
        
    }

    /**
     * 打开App浏览器
     * @param {*} 
     * @returns  
     */
    openAppBrowser(url){
        if (Helper.isIos()) {
            let params = {"url":url}
            this._excuteIosFunc("openAppBrowser",JSON.stringify(params))
        }else if(Helper.isAndroid()){
            if (!this._checkNativeObject()){
                return;
            }
            if(this._jsBridge && this._jsBridge.openAppBrowser){
                this._jsBridge.openAppBrowser(url)
            }
        }
        
    }


    /**
     * 强制退出游戏
     * @param {*} 
     * @returns  
     */
    exitApp(){
        if (Helper.isIos()) {
            this._excuteIosFunc("exitApp")
        }else if(Helper.isAndroid()){
            if (!this._checkNativeObject()){
                return;
            }
            if(this._jsBridge && this._jsBridge.exitApp){
                this._jsBridge.exitApp()
            }
        }
        
    }

    /**
     * 清除本地热更资源
     * @param {*} 
     * @returns  
     */
    clearNativeRes(){
        if (Helper.isIos()) {
            this._excuteIosFunc("clearNativeRes")
        }else if(Helper.isAndroid()){
            if (!this._checkNativeObject()){
                return;
            }
            if(this._jsBridge && this._jsBridge.clearNativeRes){
                this._jsBridge.clearNativeRes()
            }
        }
        
    }

    /**
     * 关闭支付宝支付h5 webview页面
     * @param {*} 
     * @returns  
     */
    hideAliPayWebView(){
        if (Helper.isIos()) {
            this._excuteIosFunc("hideAliPayWebView")
        }else if(Helper.isAndroid()){
            if (!this._checkNativeObject()){
                return;
            }
            if(this._jsBridge && this._jsBridge.hideAliPayWebView){
                this._jsBridge.hideAliPayWebView()
            }
        }
        
    }

    
    /**
     * 获取粘贴板信息
     * @param {*} 
     * @returns  
     */
    getTextFromClipboard(){
        if (Helper.isIos()) {
            return this._excuteIosFunc("getTextFromClipboard")
        }else if(Helper.isAndroid()){
            if (!this._checkNativeObject()){
                return;
            }
            if(this._jsBridge && this._jsBridge.getTextFromClipboard){
                return this._jsBridge.getTextFromClipboard()
            }
        }
        
    }


    /**
     * 复制信息到粘贴板
     * @param {*} 
     * @returns  
     */
    copyTextToClipboard(jsonStr){
        if (Helper.isIos()) {
            let params = {"txt":jsonStr}
            this._excuteIosFunc("copyTextToClipboard",JSON.stringify(params))
        }else if(Helper.isAndroid()){
            if (!this._checkNativeObject()){
                return;
            }
            if(this._jsBridge && this._jsBridge.copyTextToClipboard){
                this._jsBridge.copyTextToClipboard(jsonStr)
            }
        }
        
    }


    /**
     * 检测微信是否安装
     * @param {*} 
     * @returns  
     */
    checkWXInstall(){
        if (Helper.isIos()) {
            let ret = this._excuteIosFunc("checkWXInstall")
            if (ret != null && ret != undefined){
                ret = Number(ret)
                return ret;
            }
        }else if(Helper.isAndroid()){
            if (!this._checkNativeObject()){
                return;
            }
            if(this._jsBridge && this._jsBridge.checkWXInstall){
                return this._jsBridge.checkWXInstall()
            }
        } 
    }

    /**
     * 检测支付宝是否安装
     * @param {*} 
     * @returns  
     */
    checkAliPayInstalled(){
        if (Helper.isIos()) {
            let ret = this._excuteIosFunc("checkAliPayInstalled")
            if (ret != null && ret != undefined){
                ret = Number(ret)
                return ret;
            }
        }else if(Helper.isAndroid()){
            if (!this._checkNativeObject()){
                return;
            }
            if(this._jsBridge && this._jsBridge.checkAliPayInstalled){
                return this._jsBridge.checkAliPayInstalled()
            }
        } 
    }

    /**
     * 检测SDK是否支持
     * @param {*} 
     * @returns  
     */
    isSupportSDK(param){
        if (Helper.isIos()) {
            let ret = this._excuteIosFunc("isSupportSDK",JSON.stringify(param))
            if (ret != null && ret != undefined){
                ret = Number(ret)
                return ret;
            }
        }else if(Helper.isAndroid()||Helper.judgeClient()=='Android'){
            if (!this._checkNativeObject()){
                return;
            }
            if(this._jsBridge && this._jsBridge.isSupportSDK){
                return this._jsBridge.isSupportSDK(param)
            }
        } 
    }

    
    /**
     * 启动一个闹钟提醒
     * @title 显示的标题
     * @hour 小时
     * @minute 分钟
     * @returns  
     */
    setAlarmClock(title,hour,minute){
        if (title == null || hour == null || minute == null ){
            // Logger.log("setAlarmClock error")
            return;
        }
        if(Helper.isAndroid()){
            if (!this._checkNativeObject()){
                return;
            }
            if(this._jsBridge && this._jsBridge.setAlarmClock){
                let param = {}
                param['title'] = title
                param['hour'] = hour
                param['minute'] = minute
                let paramJson = JSON.stringify(param)
                return this._jsBridge.setAlarmClock(paramJson)
            }
        } 
    }


    /**
     * 取消一个闹钟提醒
     * @title 显示的标题
     * @returns  
     */
    cancelAlarmClock(title){
        if (title == null){
            // Logger.log("cancelAlarmClock error")
            return
        }
        // if(Helper.isAndroid()||Helper.judgeClient()=='Android'){
        if(Helper.isAndroid()){
            if (!this._checkNativeObject()){
                return;
            }
            if(this._jsBridge && this._jsBridge.cancelAlarmClock){
                let param = {}
                param['title'] = title
                let paramJson = JSON.stringify(param)
                return this._jsBridge.cancelAlarmClock(paramJson)
            }
        } 
    }

    /**
     * 启动一个本地通知
     * @title 显示的标题
     * @content 通知内容
     * @time  通知时间:单位ms
     * @returns  
     */
    addLocalNotification(title,content,time){
        if (title == null || content == null || time == null ){
            // Logger.log("addLocalNotification error")
            return;
        }
        let param = {}
        param['title'] = title
        param['content'] = content
        param['time'] = time
        let paramJson = JSON.stringify(param)
        if(Helper.isAndroid()){
            if (!this._checkNativeObject()){
                return;
            }
            if(this._jsBridge && this._jsBridge.addLocalNotification){
                return this._jsBridge.addLocalNotification(paramJson)
            }
        }else if (Helper.isIos()) {
            let ret = this._excuteIosFunc("addLocalNotification",paramJson)
            if (ret != null && ret != undefined){
                ret = Number(ret)
                return ret;
            }
        } 
    }

    /**
     * 取消一个本地通知
     * @time  通知时间:单位ms
     * @returns  
     */
    cancelLocalNotification(time){
        if (time == null ){
            // Logger.log("cancelLocalNotification error")
            return;
        }
        let param = {}
        param['time'] = time
        let paramJson = JSON.stringify(param)
        if(Helper.isAndroid()){
            if (!this._checkNativeObject()){
                return;
            }
            if(this._jsBridge && this._jsBridge.cancelLocalNotification){
                return this._jsBridge.cancelLocalNotification(paramJson)
            }
        }else if (Helper.isIos()) {
            let ret = this._excuteIosFunc("cancelLocalNotification",paramJson)
            if (ret != null && ret != undefined){
                ret = Number(ret)
                return ret;
            }
        } 
    }


    /**
     * 异步调用
     * @param {*} paramJson 
     * @returns  
     */
    asyncCall(paramJson){
        if (Helper.isIos()) {
            if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.asyncCall && window.webkit.messageHandlers.asyncCall.postMessage){
                window.webkit.messageHandlers.asyncCall.postMessage(paramJson)
            }
            
        }else if(Helper.isAndroid()){
            if (!this._checkNativeObject()){
                return;
            }
            if(this._jsBridge && this._jsBridge.asyncCall){
                return this._jsBridge.asyncCall(paramJson)
            }
        }
        
    }

    /***************************本地存储**********************************/
    
    /**
     * 设置存储 key -value
     * @param {*} key  
     * @param {*} value 
     * @returns  
     */
    localStorageSetItem(key ,value){
        if (key == null || key == undefined){
            // Logger.error("localStorageSetItem key == null")
            return 
        }
        if (value == null || value == undefined){
            // Logger.error("localStorageSetItem value == null")
            return 
        }
        

        if (Helper.isIos()) {
            let params = {"key":key,"value":value}
            this._excuteIosFunc("localStorageSetItem",JSON.stringify(params))
        }else if(Helper.isAndroid()){
            if (!this._checkNativeObject()){
                return;
            }
            if(this._jsBridge && this._jsBridge.localStorageSetItem){
                this._jsBridge.localStorageSetItem(key,value)
            }
        }

    }

    /**
     * 获取本地存储 key
     * @param {*} key  
     * @returns  value
     */
    localStorageGetItem(key){
        if (key == null || key == undefined){
            // Logger.error("localStorageGetItem key == null")
            return;
        }
        try {
            if (Helper.isIos()) {
                let params = {"key":key}
                return this._excuteIosFunc("localStorageGetItem",JSON.stringify(params))
            }else if(Helper.isAndroid()){
                if (!this._checkNativeObject()){
                    return;
                }
                if(this._jsBridge && this._jsBridge.localStorageGetItem){
                    return this._jsBridge.localStorageGetItem(key)
                }
            }
        } catch (error) {
            // Logger.error(`SyncJSBridge === ${error}`);
        }

    }

    /**
     * 删除key本地存储
     * @param {*} key  
     * @returns  
     */
    localStorageRemoveItem(key){
        if (key == null || key == undefined){
            // Logger.error("localStorageRemoveItem key == null")
            return;
        }
        if (Helper.isIos()) {
            let params = {"key":key}
            this._excuteIosFunc("localStorageRemoveItem",JSON.stringify(params))
        }else if(Helper.isAndroid()){
            if (!this._checkNativeObject()){
                return;
            }
            if(this._jsBridge && this._jsBridge.localStorageRemoveItem){
                this._jsBridge.localStorageRemoveItem(key)
            }
        }

    }

    /**
     * 清除本地存储
     * @param {*}   
     * @returns  
     */
    localStorageClear(){
        if (Helper.isIos()) {
            this._excuteIosFunc("localStorageClear")
        }else if(Helper.isAndroid()){
            if (!this._checkNativeObject()){
                return;
            }
            if(this._jsBridge && this._jsBridge.localStorageClear){
                this._jsBridge.localStorageClear()
            }
        }

    }


     /***************************ZADun**********************************/
     getZADunInitRet(){
        let ret = -1;
        if (Helper.isIos()) {
            let ret = this._excuteIosFunc("getZADunInitRet")
            if (ret != null && ret != undefined){
                ret = Number(ret)
                return ret;
            }
        }else if(Helper.isAndroid()){
            if (!this._checkNativeObject()){
                return ret;
            }
            if(this._jsBridge && this._jsBridge.getZADunInitRet){
                ret = this._jsBridge.getZADunInitRet()
                if (ret != null && ret != undefined){
                    return ret;
                }
            }
        }
        
        return ret;
     }

     getZADunPortByAddr(addr, port){
        let ret = 0;
        if (Helper.isIos()) {
            let params = {"addr":addr,"port":port}
            let ret = this._excuteIosFunc("getZADunPortByAddr",JSON.stringify(params))
            if (ret != null && ret != undefined){
                ret = Number(ret)
                return ret;
            }
        }else if(Helper.isAndroid()){
            if (!this._checkNativeObject()){
                return ret;
            }
            if(this._jsBridge && this._jsBridge.getZADunPortByAddr){
                ret = this._jsBridge.getZADunPortByAddr(addr,port)
                if (ret != null && ret != undefined){
                    return ret;
                }
            }
        }
        
        return ret;
     }


     /***************************AliDun**********************************/
     
     getAliDunInitRet(){
        let ret = -1;
        if (Helper.isIos()) {
            let ret = this._excuteIosFunc("getAliDunInitRet")
            if (ret != null && ret != undefined){
                ret = Number(ret)
                return ret;
            }
        }else if(Helper.isAndroid()){
            if (!this._checkNativeObject()){
                return ret;
            }
            if(this._jsBridge && this._jsBridge.getAliDunInitRet){
                ret = this._jsBridge.getAliDunInitRet()
                if (ret != null && ret != undefined){
                    return ret;
                }
            }
        }

        
        return ret;
     }


     getAliDunServerPort(token,groupName,domainName,port){
        let ret = 0;
        if (Helper.isIos()) {
            let params = {"token":token,"groupName":groupName,"domainName":domainName,"port":port}
            let ret = this._excuteIosFunc("getAliDunServerPort",JSON.stringify(params))
            if (ret != null && ret != undefined){
                return ret;
            }
        }else if(Helper.isAndroid()){
            if (!this._checkNativeObject()){
                return ret;
            }
            if(this._jsBridge && this._jsBridge.getAliDunServerPort){
                ret = this._jsBridge.getAliDunServerPort(token,groupName,domainName,port)
                if (ret != null && ret != undefined){
                    return ret;
                }
            }
        }
        
        return ret;
     }


     /***************************YunDun**********************************/

     getYunDunInitRet(){
        let ret = -1;
        if (Helper.isIos()) {
            let ret = this._excuteIosFunc("getYunDunInitRet")
            if (ret != null && ret != undefined){
                ret = Number(ret)
                return ret;
            }
        }else if(Helper.isAndroid()){
            if (!this._checkNativeObject()){
                return ret;
            }
            if(this._jsBridge && this._jsBridge.getYunDunInitRet){
                ret = this._jsBridge.getYunDunInitRet()
                if (ret != null && ret != undefined){
                    return ret;
                }
            }
        }

        return ret;
     }


     getYunDunServerIPAndPort(domainName,port){
        let ret = 0;
        if (Helper.isIos()) {
            let params = {"domainName":"","port":port}
            let ret = this._excuteIosFunc("getYunDunServerIPAndPort",JSON.stringify(params))
            if (ret != null && ret != undefined){
                return ret;
            }
        }else if(Helper.isAndroid()){
            if (!this._checkNativeObject()){
                return ret;
            }
            if(this._jsBridge && this._jsBridge.getYunDunServerIPAndPort){
                ret = this._jsBridge.getYunDunServerIPAndPort("",port)
                if (ret != null && ret != undefined){
                    return ret;
                }
            }
        }

        return ret;
     }

    /***************************private**********************************/
    _checkNativeObject(){
        return !!this._getNativeObject();
    }

    _getNativeObject(){
        if(!this._jsBridge){
            this._jsBridge = window.jsbridge || null;
        }
        return this._jsBridge;
    }


    _excuteIosFunc(funcName,params){
        if (!prompt || !funcName) return; 
        if (params == null || params == undefined){
            params = ""
        }
        var type = "JSbridge";
        var payload = {"type": type, "funcName": funcName, "params": params};
        var res = prompt(JSON.stringify(payload));
        return res;
    }
}