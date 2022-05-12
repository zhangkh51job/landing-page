import StorageKey from "../const/StorageKey";
import { Logger } from "../debug/Logger";
import Global from "../Global";
import Helper from "../helper";
import md5 from 'js-md5'
export default class ChannelUtil{
    channelHasReport = false;
    channelReportParam = {
        "pasteboard": -1,
        "openinstall": -1,
        "shareinstall": -1,
        "supersign": -1
    }

    reportChannelSource(){
        if(Helper.isAndroid()){
            this.channelReportParam.supersign = 0;
        }
        // Global.ReportTool.ReportPublicClientLog(ReportKey.REPORT_TYPE_CHANNEL_SOURCE,this.channelReportParam);
        this.channelHasReport = true;
        Global.Setting.storage.setBool(Global.Setting.sendShareInstallReportFlag,true);
    }

    startSchemeForReport(){
        //已经上报过安装渠道
        Logger.error("----------------this.channelHasReport:"+this.channelHasReport);
        if(this.channelHasReport){
            return;
        } 
        let sendShareInstallReportFlag = Global.Setting.storage.getBool(Global.Setting.sendShareInstallReportFlag);
        if(sendShareInstallReportFlag === true){    //已经上报过安装渠道
            Logger.log("Setting.sendShareInstallReportFlag is true");
            return;
        }else{
            Logger.log("Setting.sendShareInstallReportFlag is false");
        }

        let shareinstall = this.channelReportParam.shareinstall;
        if(shareinstall == -1){
            this.channelReportParam.shareinstall = 0;
        }
        this.reportChannelSource();
    }

    //--------------------share install 相关---------------------------------
    initShareinstall(){
        Global.NativeEvent.getShareInstallData(this.initShareInstallData.bind(this));
    }

    //解析shareinstall 和 剪贴板
    initShareInstallData(content){
        let tempContent = Global.Setting.ChannelInfo.shareInstallContent;
        if(tempContent != null && tempContent != ""){
            return;
        }else{
            Global.Setting.ChannelInfo.shareInstallContent = content;
        }
        //检验shareInstall
        //支持content是string 或者是table
        if(content != null && content != ""){
            let tab = null;
            if(typeof (content) == "string"){
                try {
                    tab = JSON.parse(content);
                } catch (error) {
                    this.checkCliptextAndAppInfo();
                    return;
                }
            }else{
                tab = content;
                try {
                    let shareInstall = JSON.stringify(tab);
                    Logger.log("share install tab : ", shareInstall);
                } catch (error) {
                    Logger.log("share install tab parse error");
                }
            }

            let hasShareinstallData = false;
            if(tab.cid && !isNaN(Number(tab.cid))){
                hasShareinstallData = true;
                Global.Setting.ChannelInfo.shareInstallChannel = Number(tab.cid)
            }

            if(tab.cid && !isNaN(Number(tab.ch))){
                hasShareinstallData = true;
                Global.Setting.ChannelInfo.shareInstallChannel = Number(tab.cid);
            }

            if(tab.ic && !isNaN(Number(tab.ic))){
                hasShareinstallData = true;
                if(Global.Setting.ChannelInfo.inviteId == 0){
                    Global.Setting.ChannelInfo.inviteId = Number(tab.ic);
                }
            }
        if(hasShareinstallData){
                this.channelReportParam.shareInstallChannel = 1;
                Global.Setting.ChannelInfo.sourceType = 5;
            }else{  //当shareinstall 返回空表时  检查剪贴板
                this.checkCliptextAndAppInfo();
            }
        }else{
            this.checkCliptextAndAppInfo();
        }
        this.dealShareInstall();
    }

    dealShareInstall(){
        let flag = Global.Setting.storage.getBool(StorageKey.PostShareInstallFlag);
        if(flag){
            return;
        }
        let param = {};
        param.appid = Global.Setting.appId;
        param.edition = "";
        param.app = Global.Setting.SystemInfo.vendorChannel;
        param.pack = Global.Setting.ChannelInfo.getRegistChannel();
        param.uid = Number(Global.Setting.storage.get(StorageKey.Uid)) || 0;
        param.app_source = Global.Setting.SystemInfo.appConstUrl;
        param.device = Global.Toolkit.genDeviceInfo();
    }

    //--------------------open install 相关---------------------------------
    initOpeninstall(){
        if(this.isCliptextVaild()){
            this.channelReportParam.pasteboard = 1;
            Global.Setting.ChannelInfo.clipboardContent = Global.Setting.SystemInfo.clipboardText;
        }else{
            this.channelReportParam.pasteboard = 0;
        }
        Global.NativeEvent.getOpenInstallData(this.initOpenInstallData.bind(this));
        this.channelReportParam.supersign = 0;
        if(Helper.isIos()){
            this.channelReportParam.supersign = 0;
            Global.NativeEvent.getInfoPlistParam("ChannelInfo",(info) => {
                Global.Setting.SystemInfo.ChannelInfo = info.funcParam;
                this.decodeChannelInfo();
                this.channelReportParam.supersign = 1;
            })
        }
    }

    //解析openinstall 和 剪貼板
    initOpenInstallData(content){
        let tempContent = Global.Setting.ChannelInfo.openInstallContent;
        this.channelReportParam.openinstall = 0;
        if(tempContent != null && tempContent != ""){
            return "";
        }else{
            Global.Setting.ChannelInfo.openInstallContent = content;
        }
        //检验openInstall
        //支持content是string 或者是table
        if(content != null && content != ""){
            let tab = null;
            if(typeof (content) == "string"){
                try {
                    tab = JSON.parse(content);
                    Logger.log("open install string : ", content);
                } catch (error) {
                    Logger.error("load openInstall error", content);
                    this.checkCliptextAndAppInfo();
                    return;
                }
            }else{
                tab = content;
                try {
                    let openInstall = JSON.stringify(tab);
                    Logger.log("open install tab : ", openInstall);
                } catch (error) {
                    Logger.log("open install tab parse error");
                }
            }

            let hasOpeninstallData = false;
            Logger.log("initOpenInstallData hasOpeninstallData setting");
            if(tab.cid && !isNaN(Number(tab.cid))){
                hasOpeninstallData = true;
                Global.Setting.ChannelInfo.openInstallContent = Number(tab.cid);
            }
            if(tab.ch && !isNaN(Number(tab.ch))){
                hasOpeninstallData = true;
                Global.Setting.ChannelInfo.openInstallContent = Number(tab.ch);
            }
            if(tab.ic && !isNaN(Number(tab.ic))){
                hasOpeninstallData = true;
                Global.Setting.ChannelInfo.inviteId = Number(tab.ic);
            }
            if(hasOpeninstallData){
                this.channelReportParam.openinstall = 1;
                Global.Setting.ChannelInfo.sourceType = 1;
            }else{
                //当openinstall 返回空表时  检查剪贴板
                this.checkCliptextAndAppInfo();
            }

        }else{
            this.checkCliptextAndAppInfo();
        }
        this.dealOpenInstall()
    }

    dealOpenInstall(){
        let flag = Global.Setting.storage.getBool(StorageKey.PostShareInstallFlag);
        if(flag){
            return;
        }
        let param = {};
        param.appid = Global.Setting.appId;
        param.edition = "" 
        param.app = Global.Setting.SystemInfo.vendorChannel;
        param.pack = Global.Setting.ChannelInfo.getRegistChannel();
        param.uid = Number(Global.Setting.storage.get(StorageKey.Uid)) || 0;
        param.app_source = Global.Setting.SystemInfo.appConstUrl;
        param.device = Global.Toolkit.genDeviceInfo();
    }

    isCliptextVaild(){
        let clipContent = Global.Setting.SystemInfo.clipboardText;
        if(!clipContent){
            return false;
        }
        let subStr = clipContent.split("|");
        if(subStr.length < 4){
            return false;
        }else if(subStr.length > 10){
            return false
        }
        let md5Str = subStr[subStr.length - 1];
        //判断最后一位是都是md5
        let md5ContentIdnex = clipContent.lastIndexOf("|");
        let md5Content = clipContent.lastIndexOf(0,md5ContentIdnex);
        if(md5(md5Content.toString()) == md5Str){
            return true;
        }
        return false;
    }

    isChannelStrVaild(chanStr){
        if(chanStr == null || chanStr == "" || isNaN(Number(chanStr))){
            return false;
        }
        let value = Number(chanStr);
        if(!Global.Toolkit.isInteger(value)){
            return false;
        }
        if(value < 0 || value > 10000000000){
            return false;
        }
        return true;
    }

    isShareinstallVaild(){
        let shareinstallContent = Global.Setting.ChannelInfo.shareInstallContent;
        if(!shareinstallContent){
            return false;
        }
        if(shareinstallContent.length < 1){
            return false;
        }
        return true;
    }

    //校验
    decodeCliptext(){
        let clipContent = Global.Setting.SystemInfo.clipboardText;
        if(clipContent == null || clipContent == ""){
            return false;
        }
        if(!this.isCliptextVaild()){
            return false;
        }
        let subStr = clipContent.split("|");
        if(subStr.length < 4){
            Logger.error("剪贴板解析失败", clipContent);
            return false;
        }
        // let packNo = subStr[0];
        // if(this.isChannelStrVaild(ic)){
        //     Global.Setting.ChannelInfo.inviteId = Number(ic);
        // }
        Global.Setting.ChannelInfo.clipboardContent = clipContent;
        Global.Setting.ChannelInfo.sourceType = 2;
        return true;
    }

    //校验
    decodeChannelInfo(){
        let clipContent = Global.Setting.SystemInfo.ChannelInfo;
        if(clipContent == null || clipContent == ""){
            return false;
        }
        let subStr = clipContent.split("|");
        if(subStr.length < 4){
            Logger.error("infoPlist", clipContent);
            return false;
        }
        let packNo = subStr[0];
        if(this.isChannelStrVaild(packNo)){
            Global.Setting.ChannelInfo.infoChannel = Number(packNo);
        }
        let ic = subStr[1];
        if(this.isChannelStrVaild(ic)){
            Global.Setting.ChannelInfo.inviteId = Number(ic);
        }
        Global.Setting.ChannelInfo.clipboardContent = clipContent;
        Global.Setting.ChannelInfo.sourceType = 2;
        return true
    }
}