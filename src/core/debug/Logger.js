export const LogLevel = {
    None : 0,
    Log : 0x01,
    Warn : 0x02,
    Net : 0x04,
    Error : 0x08,
    All : 0xff,
}

export class Logger{
    static logLevel = LogLevel.All;
    static logEnable = false;
    
    static logObj(obj,...args){
        let logger = console.log;
        if(this.logEnable && this.logLevel & LogLevel.Log){
            logger.call(this,this.getLogContent(args),obj)
        }
    }

    static log(...args){
        let logger = console.log;
        if(this.logEnable && this.logLevel & LogLevel.Log){
            logger.call(this,this.getLogContent(args))
        }
    }

    static warn(...args){
        let logger = console.warn;
        if(this.logEnable && this.logLevel & LogLevel.Warn){
            logger.call(this,this.getLogContent(args));
        }
    }

    static net(...args){
        let logger = console.log;
        if(this.logEnable && this.logLevel & LogLevel.Net){
            logger.call(this,this.getLogContent(args));
        }
    }

    static error(...args){
        let logger = console.error;
        if(this.logEnable && this.logLevel & LogLevel.Error){
            logger.call(this,this.getLogContent(args));
        }
    }

    static getLogContent(args=[]){
        for(let i = args.length - 1;i >= 0;i--){
            if(typeof(args[i]) != "string" && typeof(args[i] != "number")){
                args.splice(i,1);
            }
        }
        let content = this.getDateStr() + args.join("\t,");
        return content;
    }

    static getDateStr(){
        let d = new Date();
        let str = d.getHours().toString();
        let timeStr = "";
        timeStr += (str.length == 1 ? "0"+str : str) + ":";
        str = d.getMinutes().toString();
        timeStr += (str.length == 1 ? "0"+str : str) + ":";
        str = d.getSeconds().toString();
        timeStr += (str.length == 1 ? "0"+str : str) + ":";
        str = d.getMilliseconds().toString();
        if( str.length == 1 ) str = "00"+str;
        if( str.length == 2 ) str = "0"+str;
        timeStr += str;
        
        timeStr = "[" + timeStr +"]";
        return timeStr;
    }
}