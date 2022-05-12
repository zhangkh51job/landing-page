import { Logger, LogLevel } from "./debug/Logger";
import HttpProxy from "./net/http/HttpProxy";
import NativeEvent from "./native/NativeEvent"
import SyncJSBridge from "./native/SyncJSBridge"
import Setting, { ServerType } from "./setting/Setting"
import Toolkit from "./utils/Toolkit"
import UrlUtil from "./utils/UrlUtil";
import AppDunControl from "./net/dun/AppDunControl";
import AESUtil from "./utils/AESUtil";
import ChannelUtil from "./utils/ChannelUtil";
import DNSControl from "./net/dns/DNSControl";
import EventDispatcher from "./event/EventDispatcher";
// import HallServer from "./apis/hall/HallServer";
// import PlayerData from "./data/PlayerData";
import Helper from "./helper";
import ReportTool from "./report/ReportTool";

var REGEXP_NUM_OR_STR = /(%d)|(%s)/;
var REGEXP_STR = /%s/;

export default class Global{
    static Event = new EventDispatcher();
    static Http = new HttpProxy();
    // static HallServer = new HallServer();
    static Setting = new Setting();
    static DNS = new DNSControl();

    static NativeEvent = new NativeEvent();
    static SyncJSBridge = new SyncJSBridge();

    // static PlayerData = new PlayerData();
    static AppDun = new AppDunControl();
    static AESUtil = new AESUtil();
    static ChannelUtil = new ChannelUtil();
    static UrlUtil = new UrlUtil();
    static Toolkit = new Toolkit();

    static ReportTool = new ReportTool();

    static setup(){
        Global.NativeEvent.setup();
        Logger.logLevel = LogLevel.All;
        Logger.logEnable = Helper.isDevelopment() || Helper.isIntest();
        Global.Setting.setup();
        Global.ReportTool.init();
        if(Helper.isRelease()){
            Global.Setting.ServerType = ServerType.RELEASE;
        }
        // Global.HallServer.setup();
    }
    /**
     * 全局拼接字符串方法
     * @param  {...any} args 参数/例如（11%s,2）=> 112
     */
    static formatStr(...args){
        var argLen = args.length;
        if (argLen === 0) {
            return '';
        }
        var msg = args[0];
        if (argLen === 1) {
            return '' + msg;
        }

        var hasSubstitution = typeof msg === 'string' && REGEXP_NUM_OR_STR.test(msg);
        if (hasSubstitution) {
            for (let i = 1; i < argLen; ++i) {
                var arg = args[i];
                var regExpToTest = typeof arg === 'number' ? REGEXP_NUM_OR_STR : REGEXP_STR;
                if (regExpToTest.test(msg))
                    msg = msg.replace(regExpToTest, arg);
                else
                    msg += ' ' + arg;
            }
        }
        else {
            for (let i = 1; i < argLen; ++i) {
                msg += ' ' + args[i];
            }
        }
        return msg;
    }
}