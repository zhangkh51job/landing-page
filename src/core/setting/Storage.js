import Helper from "../helper";
import StorageKey from "../const/StorageKey";
import {
    Logger
} from "../debug/Logger";
import Global from "../Global";
import CryptoJS from 'crypto-js'
import md5 from 'js-md5'
const keyEnc = "B8UoOZ3VY5MSFZUw";
const keyIv = "PJ5JViB1mumM7mJ1";

export default class Storage {
    //默认为string格式存储  包括数字
    set(key, value) {
        if (value == null) {
            value = ""
        }
        if (value && typeof (value) == "string") {
            value = this.getEncString(value);
        }
        let newKey = this.getFinalKey(key);
        localStorage.setItem(newKey, value);
        if (!Helper.isWeb()) {
            Global.NativeEvent.localStorageSetItem(newKey, value);
        }
    }
    clearLocal() {
        let localKeyList = ["token", "tryDay", "dialogTip", "codeTime"]
        localKeyList.forEach(item => {
            this.removeKey(item)
        })
    }

    setAppInfo(value) {
        if (!Helper.isWeb()) {
            let key = "appInfo"
            if (typeof (value) == "string") {
                try {
                    value = this.getDecString(value)
                } catch (error) {
                    value = JSON.stringify({
                        HOME_URL: [],
                        APP_URL: [],
                        HOME_URL_PATH: ""
                    });
                }
            }
            Global.NativeEvent.localStorageSetItem(key, value);
        }
    }

    getToken() {
        return this.get("token")
    }

    setObject(key, value) {
        if (value == null) {
            return;
        }
        let content = "";
        try {
            content = JSON.stringify(value);
            this.set(key, content);
        } catch (error) {
            // Logger.error("Storage.setObject 出错", e && e.message)
            return;
        }
    }

    setBool(key, value) {
        let content = value ? "1" : "0"
        this.set(key, content);
    }

    get(key) {
        let newKey = this.getFinalKey(key);
        let value = localStorage.getItem(newKey);
        if (value == null && !Helper.isWeb()) {
            value = Global.NativeEvent.localStorageGetItem(newKey);
        }
        value = value || ""
        if (value == null) {
            value = "";
        }
        if (value && typeof (value) == "string") {
            value = this.getDecString(value);
        }
        return value;
    }

    getNumber(key, defalut = 0) {
        let content = this.get(key);
        if (content == "") {
            return defalut;
        }
        let value = Number(content);
        if (!isNaN(value)) {
            return value;
        } else {
            return defalut;
        }
    }

    getObject(key) {
        let content = this.get(key);
        if (content == "") {
            return null;
        }
        let obj = null;
        try {
            obj = JSON.parse(content);
        } catch (error) {
            Logger.error("Storage.getObject 出错", error && error.message)
        }
        return obj;
    }

    getBool(key) {
        let content = this.get(key);
        return content == "1";
    }

    removeKey(key) {
        let newKey = this.getFinalKey(key);
        localStorage.removeItem(newKey);
        if (!Helper.isWeb()) {
            Global.NativeEvent.localStorageRemoveItem(newKey);
        }
    }

    //对key做加工
    getFinalKey(key) {
        let keys = window.envInfo.appid + "_" + key
        return md5(keys);
    }

    //获取config_key
    loadConfig() {
        let cfgStr = Global.Setting.storage.get(StorageKey.CONFIG_KEY);
        if (cfgStr != null && cfgStr) {
            try {
                let cfg = JSON.parse(cfgStr);
                return cfg;
            } catch (error) {
                Logger.error("解析config失败");
                return null;
            }
        }
        return null;
    }
    getEncString(val) {
        let keys = CryptoJS.enc.Utf8.parse(keyEnc);
        let iv = CryptoJS.enc.Utf8.parse(keyIv);
        let keyEncString = CryptoJS.enc.Utf8.parse(val);
        let keyEncrypted = CryptoJS.AES.encrypt(keyEncString, keys, {
            iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.ZeroPadding
        });
        return keyEncrypted.toString();
    }
    getDecString(val) {
        try {
            let keys = CryptoJS.enc.Utf8.parse(keyEnc);
            let iv = CryptoJS.enc.Utf8.parse(keyIv);
            let keyEncrypted = CryptoJS.AES.decrypt(val, keys, {
                iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.ZeroPadding
            });
            let result = keyEncrypted.toString(CryptoJS.enc.Utf8);
            return result
        } catch (error) {
            return val
        }
    }
}