export default class ReportKey{
    //获取到nativeparam
    static REPORT_TYPE_OPEN = 1;
    //获取appdata之后 开始热更之前
    static REPORT_TYPE_START_CHECKVERSION = 2;
    //登录成功上报
    static REPORT_TYPE_LOGIN = 3;
    //appconfig 解析错误
    static APPCONFIGPARSEERROR = "RWXT_APPCONFIGPARSEERROR";
    //HTTP 异常上报
    static REPORT_TYPE_HTTP_ERROR = "RWXT_HTTP_ERROR";
    //data 异常上报
    static REPORT_TYPE_DATA_ERROR = "RWXT_DATA_ERROR";
    //login 异常上报
    static REPORT_TYPE_LOGIN_ERROR = "RWXT_LOGIN_ERROR";
    //checkversion 异常上报
    static REPORT_TYPE_CHECKVERSION_ERROR = "RWXT_CHECKVERSION_ERROR";
    //httpDNS 异常上报
    // static REPORT_TYPE_HTTPDNS_ERROR = "HTTPDNS_ERROR";
    //解析json失败上报
    static REPORT_TYPE_JSON_ERROR = "RWXT_JSON_ERROR";
    //测试线路 上报
    static REPORT_TYPE_TEST_ROUTE = "RWXT_TEST_ROUTE";
    //初始化T盾失败
    static REPORT_TYPE_INIT_DUN_ERROR = "RWXT_INIT_DUN_ERROR";
    //上报请求成功和失败的次数  每次启动时上报
    static REPORT_TYPE_REQUEST_RECORD = "RWXT_REQUEST_RECORD";
    //热更失败上报
    static REPORT_TYPE_HOT_UPDATE_ERROR = "RWXT_HOTUPDATE_ERROR";
    //渠道的源
    // static REPORT_TYPE_CHANNEL_SOURCE = "CHANNEL_SOURCE";
    //并发请求上报
    static REPORT_TYPE_PARALLEL_REQ = "RWXT_PARALLEL_REQ";
    //页面Vue 错误上报
    static VUE_PAGE_ERROR = "RWXT_VUE_PAGE_ERROR";
    //全局错误上报
    static WINDOWS_ERROR = "RWXT_WINDOWS_ERROR";
    //app开启时间及次数上报
    static REPORT_TYPE_APP_OPEN = "RWXT_APP_OPENTIME";
    //客户端上报日志
    static DEBUG_LOG = "debug";
    //客户端错误日志
    static ERROR_LOG = "error";
}