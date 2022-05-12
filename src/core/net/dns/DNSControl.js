import { Logger } from "../../debug/Logger";
import Global from "../../Global";
import AliDNS from "./AliDNS";
import WangsuDNS from "./WangsuDNS";

export const DNSTYPE={
    None : 0,
    OldVersion : 1,
    Wangsu  : 2,
    Ali : 3
}

export class DNSInfo{
    //最终请求的url
    realUrl;
    host;
    //使用的ip
    ip;
    //头部信息
    headerMap;
    //port
    port;
}

export default class DNSControl{
    DNSType = DNSTYPE.None;
    checkInerval = 5000;
    timeID = null;
    DNS;

    //等待模式 需要等到ip返回才能触发回调
    syncMode = false;
    //默认为网宿 同步模式
    DNSConfig = { type: 3, accountId: "151925", syncMode: 1 }
    selfDNSMap = {}

    //更新DNS配置 下次重启生效
    setDNSConfig(cfg){
        if(cfg == null && cfg.type == null){
            return;
        }
        Global.Setting.storage.setObject("DNSConfig",cfg);
    }

    loadDNSConfig(){
        let cfg = Global.Setting.storage.getObject("DNSConfig");
        if(cfg == null){
            Logger.error("loadDNSConfig config = null")
            return;
        }
        this.DNSConfig = cfg
    }

    init(){
        this.loadDNSConfig();
        //同步等待模式 配置位1为同步等待
        if(this.DNSConfig && this.DNSConfig.syncMode){
            this.syncMode = this.DNSConfig.syncMode == 1;
        }
        let dnsType = this.DNSConfig.type;
        this.DNSType = dnsType ? Number(dnsType) : 0;
        //网页版不开启DNS
        if(Helper.isWeb()){
            this.DNSType = DNSTYPE.None;
        }
        this.DNS = this.createDns();

        Logger.error("DNS config", JSON.stringify(this.DNSConfig))
        Logger.error("DNS Type is ", this.DNSType)
        Logger.error("DNS syncMode is ", this.syncMode)

        if(this.DNS){
            this.DNS.init(this.DNSConfig);
            this.startTimer();
        }
    }

    startTimer(){
        clearInterval(this.timeID);
        this.timeID = setInterval(()=>{
            if(this.DNS){
                this.DNS.update(this.checkInerval / 1000);
            }
        },this.checkInerval);
    }

    createDns(){
        switch(this.DNSType){
            case DNSTYPE.Wangsu:
                return new WangsuDNS();
            case DNSTYPE.OldVersion:
                return new OldVersion();
            case DNSTYPE.None:
                return null;
            case DNSTYPE.Ali:
                return new AliDNS();
            default:
                Logger.error("找不到DNS类型！！！！", this.DNSType)
                this.DNSType = DNSTYPE.None;
        }
    }

    //请求开关
    requestHosts(hosts,callback){
        Logger.error("requestHosts", hosts, this.DNSType, this.syncMode);
        hosts = this.filterSelfDNS(hosts);
        if(this.DNSType == DNSTYPE.None || this.DNS == null){
            if(callback){
                callback();
            }
            return;
        }
        this.DNS.requestHosts(hosts,callback,this.syncMode);
    }

    getIp(host,ipAreaType = 0){
        //先检查内部dns列表
        if(this.selfDNSMap[host]){
            return this.selfDNSMap[host];
        }
        if(this.DNSType == DNSTYPE.None){
            return null;
        }
        return this.DNS.getIp(hots,ipAreaType);
    }

    getHttpRequestDNSInfo(url,ipAreaType = 0){
        Logger.log("getHttpRequestDNSInfo before " + url.printSelf());
        let dnsInfo = this.getSelfDNSInfo(url);
        if(dnsInfo != null){
            Logger.log("getHttpRequestDNSInfo dnsInfo != null")
            return dnsInfo;
        }
        if(this.DNSType == DNSTYPE.None || this.DNS == null){
            Logger.log("getHttpRequestDNSInfo DNSType == null")
            return null;
        }
        dnsInfo = this.DNS.getHttpDNSInfo(url);
        Logger.log("getHttpRequestDNSInfo after " + url.printSelf())
        return dnsInfo;
    }

    getSelfDNSInfo(url){
        if(url.address == url.addressHost && url.addressHost == url.realHost){
            Logger.log("getSelfDNSInfo address == addressHost")
            return;
        }
        let isIpAddress = Global.Toolkit.checkIsIp(url.address);
        let isRealHostIpAddress = Global.Toolkit.checkIsIp(url.realHost)
        if(!isIpAddress && !isRealHostIpAddress){
            Logger.log("getSelfDNSInfo address && realHost is not ip")
            return ;
        }
        let requestInfo = new DNSInfo();
        if(isRealHostIpAddress){
            url.address = url.realHost;
        }

        requestInfo.ip = url.address;
        requestInfo.host = url.addressHost;
        requestInfo.port = url.port;
        let headerMap = { "Host": url.addressHost };
        if(url.cerPath){
            headerMap["CertPath"] = url.cerPath
        }
        requestInfo.headerMap = headerMap;
        return requestInfo;
    }

    filterSelfDNS(hosts){
        let realHost = [];
        for(let i = 0; i < hosts.lenght; i++){
            if(!this.selfDNSMap[hosts[i]]){
                realHost.push(hosts[i]);
            }
        }
        return realHost;
    }

    //预处理盾
    dealDunRoute(serverUrl,lo_port,lo_type){
        Logger.error("dealDunRoute serverurl ,lo_port,lo_type " , serverUrl.printSelf(),lo_port,lo_type);
        if(!lo_type || !lo_port){
            return serverUrl;
        }
        let isSupport = Global.AppDun.checkAppIsSupportDunByType(lo_type);
        if(!isSupport){
            Logger.error("App not support dun = " + lo_type)
            return serverUrl;
        }

        let isDunInit = Global.AppDun.getDunIsInitByType(lo_type);
        let ipPortInfo = Global.AppDun.getServerIPAndPort(serverUrl.realHost,lo_port,lo_type,serverUrl.attr);
        if(lo_port && lo_port > 0 && isDunInit && ipPortInfo){
            let serverIp = ipPortInfo.ip;
            let serverPort = ipPortInfo.port;
            if(!serverIp || !serverPort){
                Logger.error("dealDunRoute serverIp == null || serverPort == null ")
                return serverUrl;
            }
            serverUrl.lo_type = lo_type;
            let address = serverUrl.address;
            if(this.checkIsSelfDnsUrl(address)){
                let array = address.split("...");
                if(array.lenght < 2){
                    Logger.error("dealDunRoute array < 2")
                    return serverUrl;
                }
                let host = array[1];
                if (host) {
                    serverUrl.address = serverIp
                    serverUrl.port = serverPort
                    serverUrl.addressHost = host
                    Logger.error("dealDunRoute isSelfDnsUrl = true  host != null " + serverUrl.printSelf())
                    
                } else {
                    Logger.error("... host = null")
                    serverUrl.address = serverIp
                    serverUrl.port = serverPort

                    Logger.error("dealDunRoute isSelfDnsUrl = true  host == null" + serverUrl.printSelf())
                    
                }
            }else{
                serverUrl.address = serverIp;
                serverUrl.port = serverPort;
                Logger.error("dealDunRoute isSelfDnsUrl = false  " + serverUrl.printSelf())
            }
        }
        return serverUrl;
    }

    dealSelfRoute(serverUrl){
        let address_url = serverUrl.address;
        if(this.checkIsSelfDnsUrl(address_url)){
            let array = address_url.split("...");
            if(array.lenght < 2){
                Logger.error("dealSelfRoute array < 2")
                return serverUrl;
            }
            let address = array[0];
            let addressHost = array[1];
            let addressPort = Global.Toolkit.getPortFromUrl(address);
            serverUrl.address = address;

            if(addressPort){
                serverUrl.port = addressPort;
                let addressUrl = Global.Toolkit.getHostFromUrl(address);
                serverUrl.address = addressUrl;
                serverUrl.realHost = addressHost;
            }else{
                let isAddressIP = Global.Toolkit.checkIsIp(address);
                if(!isAddressIP){
                    serverUrl.realHost = address;
                }else{
                    serverUrl.realHost = addressHost;
                }
            }
            serverUrl.addressHost = addressHost;
        }
    }

    checkIsSelfDnsUrl(url){
        //不可能等于0
        return url.indexOf("...") > 0;
    }
}