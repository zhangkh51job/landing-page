import EventHandler from "./EventHandler";

export default class EventDispatcher {
    constructor(){

    }
    
    _eventMap = {};

    /**
     * 判断是否有该注册事件
     * @param {*} type 事件名称
     */
    hasListener(type){
        let listener = this._eventMap && this._eventMap[type];
        return listener != null;
    }

    /**
     * 注册事件
     * @param {*} type      事件名称
     * @param {*} caller    事件作用域
     * @param {*} method    回调函数
     * @param {*} args      参数
     */
    on(type,caller,method,args){
        return this._createListener(type,caller,method,args,false);
    }

    /**
     * 注册一次性事件
     * @param {*} type      事件名称 
     * @param {*} caller    事件作用域
     * @param {*} method    回调函数
     * @param {*} args      参数
     */
    once(type,caller,method,args){
        return this._createListener(type,caller,method,args,true);
    }

    /**
     * 从 EventDispatcher 对象中删除侦听器。
     * @param {*} type      事件名
     * @param {*} caller    事件作用域
     * @param {*} method    回调函数
     * @param {*} onceOnly  （可选）如果值为 true ,则只移除通过 once 方法添加的侦听器。
     */
    off(type,caller,method,onceOnly = false){
        if(this._eventMap == null || this._eventMap[type] == null){
            return this;
        }
        let listener = this._eventMap[type];
        //单个handler
        if(listener.run){
            if((caller == null || listener.caller == caller) && (method == null || listener.method == method) && (!onceOnly || listener.once)){
                delete(this._eventMap[type]);
                listener.recover()
            }
        }else{
            let count = 0;
            let n = listener.length;
            for(let i = 0; i < n; i++){
                let item = listener[i];
                if(!item){
                    count ++;
                    continue;
                }
                if(item && (!caller || item.caller === caller) && (method == null || item.method === method) && (!onceOnly || item.once)){
                    count ++;
                    listener[i] = null;
                    item.recover();
                }
                //如果全部移除，则删除索引
                if(count === n) delete this._eventMap[type];
            }
        }
        return this;
    }

    /**
     * 销毁所有事件
     * @param {*} type   
     */
    offAll(type){
        let events = this._eventMap;
        if(!events){
            return this;
        }
        if(type){
            this.recoverHandlers(events[type]);
            delete events[type];
        }else{
            for(let name in events){
                this.recoverHandlers(events[name]);
            }
        }
    }

    offAllByCaller(caller){
        if(caller && this._eventMap){
            for(var name in this._eventMap){
                this.off(name,caller,null);
            }
        }
        return this;
    }

    /**
     * 派发事件。
     * @param {*} type 事件类型。
     * @param  {...any} data （可选）回调数据。<b>注意：</b>如果是需要传递多个参数 p1,p2,p3,...可以使用数组结构如：[p1,p2,p3,...] ；如果需要回调单个参数 p ，且 p 是一个数组，则需要使用结构如：[p]，其他的单个参数 p ，可以直接传入参数 p。
     * @return 此事件类型是否有侦听者，如果有侦听者则值为 true，否则值为 false。
     */
    event(type,...data){
        if(!this._eventMap || !this._eventMap[type]){
            return false;
        }
        let listeners = this._eventMap[type];
        if(listeners.run){
            if(listeners.once){
                delete this._eventMap[type];
            }
            data != null ? listeners.runWith(data) : listeners.run();
        }else{
            for(let i = 0,n = listeners.lengt; i < n; i++){
                let listener = listeners[i];
                if(listener){
                    (data != null) ? listener.runWith(data) : listener.run();
                }
                if(!listener || listener.once){
                    listeners.splice(i,1);
                    i--;
                    n--;
                }
            }
            if(listeners.length === 0 && this._eventMap){
                delete this._eventMap[type];
            }
        }
        return true;
    }

    recoverHandlers(arr){
        if(!arr){
            return;
        }
        if(arr.run){
            arr.recover();
        }else{
            for(let i = arr.length - 1; i > -1; i--){
                if(arr[i]){
                    arr[i].recover();
                    arr[i] = null;
                }
            }
        }
    }

    _createListener(type,caller,method,args,once,offBefore = false){
        offBefore && this.off(type,caller,method,once);

        let handler = EventHandler.create(caller || this,method,args,once);
        if(!this._eventMap[type]){
            this._eventMap[type] = handler;
        }else{
            if(!this._eventMap[type].run){
                this._eventMap[type].push(handler);
            }else{
                this._eventMap[type] = [this._eventMap[type],handler];
            }
        }
        return this;
    }
}