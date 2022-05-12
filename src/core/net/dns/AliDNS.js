import { Logger } from "../../debug/Logger";
import Global from "../../Global";
import { DNSInfo } from "./DNSControl";

export default class AliDNS{
    init(cfg){
        Global.NativeEvent.initAlicloudHttpDns(cfg.accountId)
    }

    requestHosts(hosts = [],callback,syncMode){
        //Ali的接口不确定ip是否已经返回
        Global.NativeEvent.setPreResolveHosts(JSON.stringify(hosts), null)
        if(callback){
            callback();
        }
    }

    getHttpDNSInfo(url){
        let host = url.realHost;
        let addressHost = url.addressHost;
        let ip = this.getIp(host);
        if(ip == "" || ip == null || ip == host){
            //如果自定义域名，则host走自定义域名
            if(addressHost != host){
                url.address = host;
                let dnsInfo = new DNSInfo();
                dnsInfo.ip = ip;
                dnsInfo.host = addressHost;
                let headerMap = { "Host": url.addressHost }
                if(url.cerPath){
                    headerMap["CertPath"] = url.cerPath
                }
                dnsInfo.headerMap = headerMap;
                return dnsInfo;
            }
            return null;
        }
        Logger.error("host ip is ", ip)
        url.address = ip;
        let dnsInfo = DNSInfo();
        dnsInfo.ip = ip;
        dnsInfo.host = addressHost;
        let headerMap = { "Host": url.addressHost }
        if (url.cerPath){
            headerMap["CertPath"] = url.cerPath
        }
        dnsInfo.headerMap = headerMap
        return dnsInfo;
    }

    getIp(host){
        let ips = null;
        Global.NativeEvent.getIpsByHostAsync(host,(retObj)=>{
            if(retObj && retObj.funcParam != null && retObj.funcParam != ""){
                try {
                    ips = JSON.parse(retObj.funcParam);
                } catch (error) {
                    Logger.error("NativeEvent getIpsByHostAsync", error);
                }
            }
        })
        Logger.error("return value", JSON.stringify(ips));
        if(ips == null || ips.length == 0){
            return null;
        }
        let randIndex = Math.floor(Math.random() * ips.length);
        Logger.error("ips info" , ips.length,randIndex)
        return ips[randIndex];
    }


    update(time){

    }
}