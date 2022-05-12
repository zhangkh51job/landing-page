export default class EventHandler{
    static _pool = [];
    static _gid = 0;
    caller;
    method;
    args = [];
    once;
    id;

    constructor(caller,method,args,once){
        this.setTo(caller,method,args,once);
    }

    setTo(caller,method,args,once){
        EventHandler._gid++;
        this.id = EventHandler._gid;
        this.caller = caller;
        this.method = method;
        this.args = args;
        this.once = once;
        return this;
    }

    clear(){
        this.caller = null;
        this.args = null;
        this.method = null;
    }

    recover(){
        if(this.id > 0){
            this.id = 0;
            this.clear();
            EventHandler._pool.push(this);
        }
    }

    run(){
        if(this.method == null){
            return null;
        }
        //防止handler被使用后重新复制 避免被回收
        let oldId = this.id;
        let result = this.method.apply(this.caller,this.args);
        oldId === this.id && this.once && this.recover();
        return result;
    }

    runWith(data){
        if(this.method == null){
            return null;
        }
        let oldId = this.id;
        let result;
        if(data == null){
            result = this.method.apply(this.caller,this.args);
        }else if(!this.args && !data.unshift){  //args 为空  data不是数组
            result = this.method.call(this.caller,data);
        }else if(this.args){                    //args不为空
            result = this.method.apply(this.caller,this.args.concat(data));
        }else{                                  //args 为空 data 为数组
            result = this.method.apply(this.caller,data);
        }
        oldId === this.id && this.once && this.recover();
        return result;
    }

    static create(caller,method,args = null,once = true){
        if(this._pool.length){
            return this._pool.pop().setTo(caller,method,args,once);
        }
        return new EventHandler(caller,method,args,once);
    }
}