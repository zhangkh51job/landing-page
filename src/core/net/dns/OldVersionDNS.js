import Global from "../../Global";

export default class OldVersionDNS{
    init(cfg){

    }

    requestHosts(hosts = [],callback,syncMode){
        if((!syncMode && callback) || !Global.Setting.useHttpDNS){
            callback();
            callback = null;
        }
        if(Global.Setting.useHttpDNS){
            Global.NativeEvent.startRequest(hosts,callback);
        }
    }

    getHttpDNSInfo(url){
        return null;
    }

    getIp(host){
        return null;
    }

    update(time){
        
    }
}