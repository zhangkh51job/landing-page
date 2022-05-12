import { Logger } from "../debug/Logger";
import Global from "../Global";
import Helper  from "../helper";
import md5 from 'js-md5'

export default class UrlUtil{
    _mutiLinesSplit = [",",";","|"];

    domainURI(str_url) {
        if (!str_url) {
            return ""
        }
        let domain = str_url.split('/')
        let domainUrl = ''
        if (domain[2]) {
            domainUrl = domain[0] + "//" + domain[2]
        }
        return domainUrl
    }

    getHttpReffer(url) {
        let urlSubStr = this.domainURI(url)
        let newUrl = url.replace(urlSubStr, "");
        let sign = this.getPlatformSign(newUrl)
        return sign;
    }

    getPlatformSign(content,key = ""){
        if(!key){
            key = Global.Setting.signKey;
        }
        let sign = null;
        if(!Helper.isWeb()){
            let retObj = Global.NativeEvent.getLoginSign(key, content);
            if(retObj && retObj.result == 0){
                sign = retObj.funcParam
            }else{
                sign = this.getSign(key,content);
            }
        }else{
            sign = this.getSign(key,content);
        }
        return sign;
    }

    getSign(key,content){
        let msg = md5(content);
        msg = msg.substring(0,msg.length / 2);
        let checkKey = md5(key);
        checkKey = checkKey.substring(checkKey.length / 2);
        let data = md5(msg + checkKey);
        data = data.substring(5,15);
        return data;
    }

    dealServerUrl(serverUrl,port){
        let address = serverUrl.address
        let protocol = serverUrl.protocol
        if (address.indexOf("...") > 0) {
            //强制转ws https 强转http
            if (protocol.startsWith("wss")) {
                protocol = "ws://"
            }
            let hostArray = address.split("...")
            let ipPortUrl = hostArray[0]
            if (ipPortUrl.indexOf(":") > 0) {
                if (protocol.startsWith("https")) {
                    protocol = "http://"
                } else {
                    Logger.error("head not startsWith https ")
                }
            } else {
                Logger.error("ipPortUrl not :")
            }
            serverUrl.protocol = protocol
        }
        if (port != null && port != 0 && port != 80 && port != 443){
            serverUrl.port = port
        }   
    }

    DealWithUrl(url){
        if(typeof (url) != "string" || !url){
            Logger.error("链接格式不对");
            return null;
        }
        return url.replace("\t","").trim();
    }

    //获取url 前缀flag
    getUrlParamCommonPrefex(){
        let appId = this.EncodeAppid(Global.Setting.appId);
        return "_" + appId + "/";
    }

    //获取试玩登录url 前缀flag
    getTryPlayUrlParamCommonPrefex(){
        let appId = this.EncodeAppid(Global.Setting.tryPlay);
        return "_" + appId + "/";
    }

    decimalDict = "fgHijUvWXAbcdEyzKLMnOpqRst"

    //10进制转任意进制
    EncodeAppid(appId){
        let new_num_str = "";
        let remainder = 0;
        let remainder_string = "";
        let nn = 26
        let num = Number(appId);

        do{
            remainder = num % nn;
            if(nn > remainder && remainder >= 0){
                remainder_string = this.decimalDict.substring(remainder,remainder + 1);
            }else{
                remainder_string = remainder.toString();
            }
            new_num_str = remainder_string + new_num_str;
            num = Math.floor(num / nn);
        }while(num != 0)
        
        return new_num_str
    }

    //获取时间字符串
    getTimeEndFixParam(){
        let date = new Date();
        let timeStr = date.getHours().toString() + date.getMinutes().toString() + date.getSeconds().toString() + date.getMilliseconds();
        return timeStr;
    }

    //获取时间字符串
    dealHttpSign(serverUrl){
        let url = serverUrl.getUrl()
        let httpSignInfo = { "sign_url": "", "headSign": "", "endSign": "" }
        let sign_url = this.refreshSuffixOperTime(url)
        let s_value = this.getQueryString(sign_url, "s")
        let headSign = ""
        let endSign = ""
        let linkSymbol = sign_url.indexOf('?') > 0 && "&s=" || "?s=";
        if (!s_value) {
            headSign = this.getHttpReffer(sign_url)
            endSign = this.getHttpReffer(sign_url + linkSymbol + headSign)
            sign_url = sign_url + linkSymbol + endSign
        } else {
            let replaceUrl = sign_url.replace("&s=" + s_value, "")
            headSign = this.getHttpReffer(replaceUrl)
            endSign = this.getHttpReffer(replaceUrl + linkSymbol + headSign)
            sign_url = replaceUrl + linkSymbol + endSign
        }
        if (serverUrl.isEncrptUrl) {
            let sign_url_host = Global.Toolkit.getHostFromUrl(sign_url)
            let sign_url_array = sign_url.split(sign_url_host)
            if (sign_url_array && sign_url_array.length > 0) {
                let sign_url_first = sign_url_array[0]
                let sign_url_second = sign_url_array[1]
                let encryptStr = Global.AESUtil.aesEncryptWithCommonKey(sign_url_second)
                sign_url = sign_url_first + sign_url_host + "/" + encryptStr
            }
        }

        httpSignInfo.sign_url = sign_url
        httpSignInfo.headSign = headSign
        httpSignInfo.endSign = endSign
        return httpSignInfo
    }

    getQueryString(suffix,name){
        let reg = new RegExp('(\\?|&)' + name + '=([^&?]*)', 'i');
        let r = suffix.match(reg);
        if (r != null) {
            return unescape(r[2]);
        }
        return null;
    }

    replaceUrlParmVal(url, paramName, replaceValue){
        let urlRet = url;
        if(url.startsWith("/mini/_gds/appface?")){
            // console.error("请求拼接",suffix,times,c_value);
            // console.error(`拼接参数123 == url：${url} == paramName ${paramName} == replaceValue == ${replaceValue}`,);
        }
        if(url){
            let re = eval('/(' + paramName + '=)([^&]*)/gi');
            let nUrl = url.replace(re, paramName + '=' + replaceValue);
            urlRet = nUrl
            if(urlRet.startsWith("/mini/_gds/appface?")){
                // console.error("请求拼接",suffix,times,c_value);
                // console.error(`拼接参数123456 == re : ${re} == nUrl :${nUrl}`);
            }
        }
        return urlRet;
    }

    refreshSuffixOperTime(suffix){
        if(suffix){
            let n_value = this.getQueryString(suffix,"n");
            if(n_value){
                suffix = this.replaceUrlParmVal(suffix,"n",(new Date()).valueOf())
            }
            let m_value = this.getQueryString(suffix,"m");
            if(m_value){
                suffix = this.replaceUrlParmVal(suffix,"m",this.getTimeEndFixParam());
            }
        }
        return suffix;
    }

    refreshSuffixRetryTime(suffix,times){
        if(!suffix){
            return suffix;
        }
        let c_value = this.getQueryString(suffix,"c");
        if(!c_value){
            suffix = suffix +"&c=" + times;
        }else{
            suffix = this.replaceUrlParmVal(suffix,"&c",times);
        }
        return suffix;
    }

    //设置线路是都需要证书
    setRouteUrlCer(serverUrl){
        let cerDirFiles = Global.Setting.SystemInfo.cerDirFiles
        if(cerDirFiles && cerDirFiles.length > 0){
            let isHasCerFile = false;
            for(let i = 0; i < cerDirFiles.length; i++){
                let fileFullName = cerDirFiles[i];
                if(fileFullName && (fileFullName.indexOf(".cer") > -1) || fileFullName.indexOf(".crt") > -1){
                    let tempArray = fileFullName.split("/");
                    let lastFileName = tempArray[tempArray.length - 1];
                    let fileName = lastFileName.replace(".cer","");
                    let addressHost = serverUrl.addressHost.toLowerCase();
                    if(fileName){
                        if(addressHost.indexOf(fileName.toLowerCase()) > -1){
                            Logger.log("cer file name = " + fileName)
                            Logger.log("cer fileFullName  = " + fileFullName)
                            serverUrl.cerName = fileFullName;
                            serverUrl.cerPath = fileFullName;
                            isHasCerFile = true;
                            break;
                        }else{
                            Logger.log("addressHost " + addressHost + " not contain cer host " + fileName)
                        }
                    }
                }
            }
            //没有改域名的cer文件
            Logger.log("isHasCerFile = " + isHasCerFile)
        }else{
            Logger.log("cerDirFiles has no file")
        }
    }

    //检查是否是多条地址同一个host
    checkIsMutiLinesSameHost(host){
        let ret = false;
        if(!host){
            return
        }
        for(let i = 0;i<this._mutiLinesSplit.length;i++){
            let splitStr = this._mutiLinesSplit[i];
            if(host.indexOf(splitStr) > 0){
                ret = true;
                break;
            }
        }
        return ret;
    }

    //获取同host多条线路集合
    getMutiLinesSameHost(host){
        let lines = null;
        if(!host){
            return;
        }
        for(let i = 0;i < this._mutiLinesSplit.length;i++){
            let splitStr = this._mutiLinesSplit[i];
            if(host.indexOf(splitStr) > 0){
                lines = host.split(splitStr);
                break;
            }
        }
        return lines;
    }

    //处理url全部下发方式多线路同host问题
    dealFullUrlWithMutiLinesSameHost(urls){
        let mutiLineMap = new Object();
        if(urls && urls.length > 0){
            for(let i = 0;i < urls.length; i++){
                let url = urls[i]
                let protocol = '';
                let address = '';
                let port = 0;
                let suffix = ''
                if(url.startsWith("https")){
                    protocol = "https"
                }else if(url.startsWith("http")){
                    protocol = "http"
                }else if(url.startsWith("wss")){
                    protocol = "wss"
                }else if(url.startsWith("ws")){
                    protocol = "ws"
                }
                let arrs = url.split("//");
                let tempUrl = url;
                if(arrs.length > 1){
                    tempUrl = arrs[1];
                }

                arrs = tempUrl.split("/");
                let host = arrs[0];
                if(host.indexOf(":") > -1){
                    address = host.split(":")[0];
                    let port = host.split(":")[1];
                    if(port && Number(port)){
                        port = Number(port);
                    }
                }else{
                    address = host
                }
                if(arrs.length > 1){
                    for(let i = 1;i<arrs.length;i++){
                        suffix = suffix + "/" + arrs[i]
                    }
                }
                if(address && address.indexOf("...") > 0){
                    let address_array = address.split("...");
                    if(address_array && address_array.length > 0){
                        let address_real = address_array[0];
                        let address_host = address_array[1];
                        if(this.checkIsMutiLinesSameHost(address_real)){
                            let mutiLines = this.getMutiLinesSameHost(address_real);
                            if(mutiLines && mutiLines.length > 0){
                                let curLines = [];
                                for(let i = 0;i < mutiLines.length;i++){
                                    let lineHost = mutiLines[i];
                                    let linePort = port ? ":" + port : "";
                                    let lineUrl = protocol + "://" + lineHost + "..." + address_host + linePort +suffix;
                                    curLines.push(lineUrl);
                                }
                                mutiLineMap[url] = curLines;
                            }
                        }
                    }
                }
            }
            for(let key in mutiLineMap){
                let value = mutiLineMap[key];
                let key_index = -1;
                for(let i = 0;i< urls.length;i++){
                    let url_value = urls[i];
                    if(url_value == key){
                        key_index = i;
                    }
                }
                if(key_index > -1){
                    urls.splice(key_index,1);
                    urls = value.concat(urls)
                }
            }
        }
        return urls;
    }
}