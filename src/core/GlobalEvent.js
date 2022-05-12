export default class GlobalEvent{
    //重新登录页面
    static OVER_TIME_RELOGIN = "OVER_TIME_RELOGIN";
    //显示网络请求界面
    static SHOW_NET_WAITING = "SHOW_NET_WAITING";
    //关闭网络请求界面
    static HIDE_NET_WAITING = "HIDE_NET_WAITING";
    //强行关闭网络请求界面
    static FORCE_HIDE_WAITING = "FORCE_HIDE_WAITING";
    //接口报错信息提示 Toast
    static HTTPERRORTOAST = "HTTPERRORTOAST";
    //玩家信息更新
    static PERSONALINFOUPDATE = "PERSONALINFOUPDATE";
    //线路拉取完成 
    static GETDATACONFIGOVER = "GETDATACONFIGOVER";
    //vip发生改变
    static CHANGEVIP = "CHANGEVIP"
    //大厅onopen打开
    static ON_HALL_OPEN = "ON_HALL_OPEN";
    //刷新大厅心跳网络延时
    static RefreshHallNetCost = "RefreshHallNetCost";
    //刷新游戏心跳网络延时
    static RefreshGameNetCost = "RefreshGameNetCost";
    //普通跑马灯
    static MARQUEESCROLL_COMMON = "MARQUEESCROLL_COMMON";
    //vip返利跑马灯
    static MARQUEESCROLL_VIP = "MARQUEESCROLL_VIP";
    //领取佣金跑马灯
    static MARQUEESCROLL_COMMI = "MARQUEESCROLL_COMMI";
    //游戏开奖信息拉去
    static GAME_GET_MESSAGE = "GAME_GET_MESSAGE";
    //游戏观察投注
    static GAME_GET_BET = "GAME_GET_BET";
    //试玩返回login页面
    static TRY_PLAY_GOLOGIN = "TRY_PLAY_GOLOGIN";
    //邮件小红点
    static HAS_NEW_MAIL = "HAS_NEW_MAIL";
    //断网情况下登录失败重登事件
    static NET_ERROR_RELOGIN = "NET_ERROR_RELOGIN";
}