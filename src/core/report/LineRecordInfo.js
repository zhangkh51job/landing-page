export default class LineRecordInfo{
    addrHost = "";
    host = "";
    addr = "";
    port = 0;
    lo_type = 0;
    totalHBTime = 0;
    totalHBCount = 0;
    maxHBTime = 0;
    sCount = 0;
    fCount = 0;
    errCodeMap = {};

    static create(serverUrl){
        if(serverUrl == null){
            return;
        }
        let recordInfo = new LineRecordInfo();
        recordInfo.addrHost = serverUrl.addressHost;
        recordInfo.host = serverUrl.realHost;
        recordInfo.port = serverUrl.port;
        recordInfo.lo_type = serverUrl.lo_type;
        return recordInfo;
    }

    static deleteEmpty(info){
        for(let key in info){
            if(info[key] == 0 && key != "fCount" && key != "sCount"){
                delete info[key];
            }
        }
        if(info.addrHost == info.host){
            delete info.addrHost;
        }
        if(info.addr == info.host){
            delete info.addr;
        }
    }
}