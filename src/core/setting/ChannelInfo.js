import Global from "../Global";

export default class ChannelInfo{
    static OpenInstallChannelKey = "OpenInstallChannelKey";
    static ShareInstallChannelKey = "ShareInstallChannelKey";
    static PlayerChannelKey = "PlayerChannelKey";
    static PlayerInviteCodeKey = "PlayerInviteCodeKey";
    static InviteIdKey = "InviteIdKey";
    static ClipboardChannelKey = "ClipboardChannelKey";
    static infoChannelKey = "ClipboardChannelKey";
    static ServerAppInfoContentKey = "ServerAppInfoContentKey";

    //appconfig中的channelId
    configChannel;

    //openinstall 传来的channelid
    _openInstallChannel;
    get openInstallChannel(){
        return this._openInstallChannel;
    }
    set openInstallChannel(value){
        if(value == 0){
            return
        }
        this._openInstallChannel = value;
        Global.Setting.storage.set(ChannelInfo.OpenInstallChannelKey,value);
    }

    //shareinstall 传来的channelid
    _shareInstallChannel;
    get shareInstallChannel(){
        return this._shareInstallChannel;
    }
    set shareInstallChannel(value){
        if(value == 0){
            return;
        }
        this._shareInstallChannel = value;
        Global.Setting.storage.set(ChannelInfo.ShareInstallChannelKey,value);
    }

    //剪贴板中的渠道号
    _clipboardChannel;
    get clipboardChannel(){
        return this._clipboardChannel;
    }
    set clipboardChannel(value){
        this._clipboardChannel = value;
        Global.Setting.storage.set(ChannelInfo.ClipboardChannelKey,value);
    }

    //info.plist中的渠道号
    _infoChannel;
    get infoChannel(){
        return this._infoChannel;
    }
    set infoChannel(value){
        this._infoChannel = value;
        Global.Setting.storage.set(ChannelInfo.infoChannelKey,value);
    }

    //playerdata的实际channelid
    _playerChannel;
    get playerChannel(){
        return this._playerChannel;
    }
    set playerChannel(value){
        this._playerChannel = value;
        Global.Setting.storage.set(ChannelInfo.PlayerChannelKey,value);
    }

    //playerdata的实际channelid
    _playerInviteCode;
    get playerInviteCode(){
        return this._playerInviteCode;
    }
    set playerInviteCode(value){
        this._playerInviteCode = value;
        Global.Setting.storage.set(ChannelInfo.PlayerInviteCodeKey,value);
    }

    //邀请人id
    _inviteId = 0;
    get inviteId(){
        return this._inviteId;
    }
    set inviteId(value){
        if(value == 0){
            return;
        }
        this._inviteId = value;
        Global.Setting.storage.set(ChannelInfo.InviteIdKey,value);
    }
    //渠道号获取类型 1 openinstall 2 剪贴板  4 请求服务器获取渠道信息 5 shareiinstall
    sourceType;
    //openinstall 返回数据
    openInstallContent;
    //shareinstall 返回数据
    shareInstallContent;
    //剪贴板验证数据
    clipboardContent;

    //downloadAppInfo缓存
    _serverAppInfoContent;
    get serverAppInfoContent(){
        return this._serverAppInfoContent;
    }
    set serverAppInfoContent(value){
        this._serverAppInfoContent = value;
        if(value != null){
            Global.Setting.storage.set(ChannelInfo.ServerAppInfoContentKey,JSON.stringify(value));
        }
    }

    //随包的channelid
    packageChannel;

    setup(){
        this._openInstallChannel = Global.Setting.storage.getNumber(ChannelInfo.OpenInstallChannelKey);
        this._shareInstallChannel = Global.Setting.storage.getNumber(ChannelInfo.ShareInstallChannelKey);
        this._playerChannel = Global.Setting.storage.getNumber(ChannelInfo.PlayerChannelKey);
        this._playerInviteCode = Global.Setting.storage.getNumber(ChannelInfo.PlayerInviteCodeKey);
        this._inviteId = Global.Setting.storage.getNumber(ChannelInfo.InviteIdKey);
        let serInfoStr = Global.Setting.storage.get(ChannelInfo.ServerAppInfoContentKey);
        this.parseServerInfo(serInfoStr);
    }

    //优先级 openinstall>shareInstallChannel > plist > 剪贴板 > appInfo > 包渠道号 > 配置表渠道号 
    getRegistChannel(){
        if(this.isChannelViald(this.openInstallChannel)){
            return this.openInstallChannel;
        }
        if(this.isChannelViald(this.shareInstallChannel)){
            return this.shareInstallChannel;
        }
        if(this.isChannelViald(this.infoChannel)){
            return this.infoChannel;
        }
        if(this.isChannelViald(this.clipboardChannel)){
            return this.clipboardChannel;
        }
        if(this.serverAppInfoContent && this.isChannelViald(this.serverAppInfoContent.ch)){
            return this.serverAppInfoContent.ch;
        }
        if(this.isChannelViald(this.playerChannel)){
            return this.playerChannel;
        }
        if(this.isChannelViald(this.packageChannel)){
            return this.packageChannel;
        }
        if(this.isChannelViald(this.configChannel)){
            return this.configChannel;
        }
        return 0;
    }

    getPlayerChannel() {
        return this.playerChannel;
    }

    isChannelViald(value) {
        if (value == null || isNaN(value) || value == 0)
            return false;
        return true;
    }

    getInviteId(){
        //如果有openinstall 渠道号  直接使用openinstall中的邀请码
        if (this.isChannelViald(this.openInstallChannel)){
            return this.inviteId;
        }  
        if (this.isChannelViald(this.shareInstallChannel)){
            return this.inviteId;
        }  
        if (this.isChannelViald(this.inviteId)){
            return this.inviteId;
        }
        if (this.serverAppInfoContent && this.isChannelViald(this.serverAppInfoContent.ic)){
            return this.serverAppInfoContent.ic;
        }   
        if (this.isChannelViald(this.playerInviteCode)){
            return this.playerInviteCode;
        }
        return 0;
    }

    parseServerInfo(content){
        let tab = null;
        try {
            tab = JSON.parse(content);
        } catch (error) {
            return
        }
        this.serverAppInfoContent = tab;
    }
}