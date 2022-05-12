import Helper from "../helper";
import StorageKey from "../const/StorageKey";
import { Logger } from "../debug/Logger";
import Global from "../Global";
import ServerRoutes from "../net/route/ServerRoutes";
import { ServerType } from "./Setting";

export default class Urls{
    testDataUrls = [
        "http://ava_node2.ncjimmy.com/c",
        "https://6umbmlpg7koqog.azurefd.net/c",
        "http://go-cdn-we04.sygsdq.com/c",
    ]

    releaseDataUrls = [
        "https://data01.yzszqb.com/c"
    ]

    get dataUrls(){
        if(Helper.isRelease()){
            return this.releaseDataUrls;
        }else{
            return this.testDataUrls;
        }
    }

    //下载地址
    downLoadUrl = "";
    //邀请地址
    inviteUrl = "";
    //强更地址
    forceUpateUrl;
    //global服务器列表
    _globalRoutes = null;
    //大厅服务器列表
    _hallRoutes = null;
    //在线客服
    onlineService = "";

    parse(serverCfg){
        //邀请地址
        if(serverCfg.invite_url){
            this.inviteUrl = Global.Toolkit.DealWithUrl(serverCfg.invite_url);
        }
        if(serverCfg.routes || serverCfg.entrance){
            this.setRoutes(serverCfg)
        }
    }

    //过滤线路
    setRoutes(serverCfg){
        let tempRoutes = [];
        let entrance = serverCfg.entrance;
        let routes = serverCfg.routes;
        let VIPLevel = Global.Setting.storage.get(StorageKey.VIPLevel);
        let selfVipLevel = VIPLevel ? VIPLevel : 0;
        if(entrance && entrance.length > 0){
            for(let i = 0; i < entrance.length; i++){
                let route = entrance[i];
                if(route){
                    let routeVip = route.vip;
                    let vip = routeVip ? routeVip : 0;
                    if(selfVipLevel >= vip){
                        tempRoutes[tempRoutes.length] = route;
                        Logger.error("push route " + JSON.stringify(route))
                    }else{
                        Logger.error("--------selfVipLevel < vip ")
                    }
                }else{
                    Logger.error("--------route------length = 0 ")
                }
            }
            let sortFunc = (a,b) =>{
                let a_vip = a.vip?a.vip:0;
                let b_vip = b.vip?b.vip:0;
                return b_vip - a_vip;
            }
            tempRoutes.sort(sortFunc)
        }else{
            Logger.error("--------entrance------length = 0 ")
        }

        let lroutes = Global.Setting.storage.getObject(StorageKey.LoginRoutes);
        if(lroutes && lroutes.length > 0){
            //预解析
            let loginServerRoutes = new ServerRoutes();
            loginServerRoutes.parse(lroutes);
            if(loginServerRoutes.getRouteLen() > 0){
                Logger.error("loginServerRoutes set lroutes")
                tempRoutes = lroutes;
                if(routes && routes.length > 0){
                    Logger.error("lroutes concat routes")
                    tempRoutes = lroutes.concat(routes);
                }
            }else{
                Logger.error("loginServerRoutes len = 0")
            }
        }
        //如果过滤后线路为空，就继续用原来的
        if(tempRoutes.length == 0){
            tempRoutes = routes;
        }
        if(tempRoutes){
            this._globalRoutes = new ServerRoutes();
            this._globalRoutes.parse(tempRoutes);
            //防止登录之后收到serverroutes 导致url丢失
            if(this._hallRoutes == null){
                this._hallRoutes = new ServerRoutes();
                this._hallRoutes.parseWs(tempRoutes);
            }
        }
    }

    get globalRoutes(){
        let g_routes = this._globalRoutes;
        if(!g_routes){
            //桶过data获取
            let content = Global.Setting.storage.get(StorageKey.AppConfigContent);
            if(content == null || content == ""){
                Logger.error("get globalRoutes error ----- " )
                return
            }
            let localCfg = this.safeDecode(content);
            if(localCfg == null){
                Logger.error("get globalRoutes safeDecode localCfg error----- " )
                return
            }
            this.setRoutes(localCfg);
            g_routes = this._globalRoutes;
        }
        return g_routes;
    }
    set globalRoutes(routes){
        if(routes){
            this._globalRoutes = routes;
        }
    }

    //登录线路排序
    sortLoginRoutes(){
        if (this.globalRoutes){
            this.globalRoutes.sortRoutes()
        }
    }

    //大厅线路进行排序
    sortHallRoutes(index){
        if (this._hallRoutes){
            if (index != null || index != undefined){
                Logger.error("sortHallRoutes index = " + index)
                this._hallRoutes.sortRoutesByIndex(index)
            }else {
                this._hallRoutes.sortRoutes()
            }
            
        }
    }

    safeDecode(cfg){
        let serverCfg = null;
        try {
            let decodeMsg = Global.AESUtil.decodeMsg(cfg);
            serverCfg = JSON.parse(decodeMsg);
            //routes 为空 验证不通过
            if(serverCfg.routes == null || !serverCfg.routes.length || serverCfg.routes.length == 0){
                serverCfg = null;
                Logger.error("data routes is null ");
            }
        } catch (error) {
            Logger.error("load app error", cfg);
            serverCfg = null;
        }
        return serverCfg;
    }

    get hallRoutes(){
        let h_routes = this._hallRoutes
        if(!h_routes){
            Logger.error("hallRoutes error")
        }
        return h_routes
    }

    set hallRoutes(routes){
        if (routes){
            this._hallRoutes = routes
        }
    }

    get hallUrlSuffix() {
        let urlParam = Global.Toolkit.getUrlCommonParam()
        let paramPrefix = Global.UrlUtil.getUrlParamCommonPrefex();
        let hallUrlSuffix = "/mini/" + paramPrefix + "%s?_func=%s&" + urlParam
        return hallUrlSuffix
    }

    get noTokenUrlSuffix(){
        let urlParam = Global.Toolkit.getLoginCommonParam()
        let paramPrefix = Global.UrlUtil.getUrlParamCommonPrefex();
        let hallUrlSuffix = "/mini/" + paramPrefix + "%s?_func=%s&" + urlParam
        return hallUrlSuffix
    }

    getDataNameWithServerType(serverType){
        let dataName = "";
        switch(serverType){
            case ServerType.DEVELOP:
                dataName = "develop";
                break;
            case ServerType.INTEST:
                dataName = "1011_intest";
                break;
            case ServerType.RELEASE:
                dataName = window.envInfo.appid;
                break;
        }
        return dataName;
    }


}