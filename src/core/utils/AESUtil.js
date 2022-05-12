import Global from "../Global";
import Helper from "../helper";
import CryptoJS from 'crypto-js'

export default class AESUtil{
    testCryptoKey = "yaoxing8901234561234567890123488";
    testCryptoIv = "yaoxing890123488";

    releaseCryptoKey = "U41U5FeIj0uhOKnzgWZ1MBBC6iEUF2DZ";
    releaseCryptoIv = "4Y535fZnkQ57BVoq";

    testRouteCrypKey = "kjhlouyuf20987677869887978987277";
    testRouteCrypIv = "kjhlouyuf2098767";

    releaseRouteCrypKey = "8dw/JfjjoMs0dzVGOX2ntb1iw2k9+JD4";
    releaseRouteCrypIv = "ZGdIobme/Sb4Idwg";

    // cryptoKey = "yaoxing8901234561234567890123488";
    // cryptoIv = "yaoxing890123488";

    // routeCrypKey = "kjhlouyuf20987677869887978987277";
    // routeCrypIv = "kjhlouyuf2098767";

    get cryptoKey(){
        if(Helper.isRelease()){
            return this.releaseCryptoKey;
        }else{
            return this.testCryptoKey;
        }
    }

    get cryptoIv(){
        if(Helper.isRelease()){
            return this.releaseCryptoIv;
        }else{
            return this.testCryptoIv;
        }
    }

    get routeCrypKey(){
        if(Helper.isRelease()){
            return this.releaseRouteCrypKey;
        }else{
            return this.testRouteCrypKey;
        }
    }

    get routeCrypIv(){
        if(Helper.isRelease()){
            return this.releaseRouteCrypIv;
        }else{
            return this.testRouteCrypIv;
        }
    }

    //加密客户端发送的内容
    aesEncrptMsg(msg){
        let encryptMsg = this.aesEncrypt(this.routeCrypKey,this.routeCrypIv,msg);
        return "s:" + encryptMsg;
    }

    decodeMsg(msg){
        let tmp = msg.trim();
        if(!tmp){
            return "";
        }
        if(tmp.charAt(0) == "{"){
            return msg;
        }
        //有出现server 底层被拦截直接返回客户端一个html 页面，导致底层解密失败报错
        if(tmp.indexOf("<html") > 0 || tmp.indexOf(" ") > 0 || tmp.indexOf("\t") > 0 || tmp.indexOf(">") > 0){
            return "";
        }
        let result = Global.NativeEvent.decryptData(msg);
        if(result == null || result.result < 0){
            return this.decodeInternal(msg);
        }else{
            return result.funcParam;
        }
    }

    decodeInternal(msg){
        return this.aesDecrypt(msg);
    }

    aesEncryptWithCommonKey(msg){
        let encryptMsg = this.aesEncrypt(this.cryptoKey,this.cryptoIv,msg);
        return encryptMsg;
    }

    aesEncrypt(cryptoKey,cryptoIv,msg){
        let key = CryptoJS.enc.Utf8.parse(cryptoKey);
        let iv = CryptoJS.enc.Utf8.parse(cryptoIv);
        let encrypt = CryptoJS.AES.encrypt(msg,key,{
            iv:iv,
            mode:CryptoJS.mode.CBC,
            padding:CryptoJS.pad.Pkcs7
        });
        return encrypt.toString();
    }

    aesDcryptWithPKC27(msg){
        let key = CryptoJS.enc.Utf8.parse(this.cryptoKey);
        let iv =CryptoJS.enc.Utf8.parse(this.cryptoIv);
        let decrypted = CryptoJS.AES.decrypt(msg,key,{
            iv:iv,
            mode:CryptoJS.mode.CBC,
            padding:CryptoJS.pad.Pkcs7
        });
        return decrypted.toString(CryptoJS.enc.Utf8);
    }

    aesDecrypt(msg){
        let key = CryptoJS.enc.Utf8.parse(this.cryptoKey);
        let iv = CryptoJS.enc.Utf8.parse(this.cryptoIv);
        let decrypted = CryptoJS.AES.decrypt(msg,key,{
            iv:iv,
            mode:CryptoJS.mode.CBC,
            padding:CryptoJS.pad.NoPadding
        })
        return decrypted.toString(CryptoJS.enc.Utf8);
    }

    aesDecrptHost(host){
        let key = CryptoJS.enc.Utf8.parse(this.routeCrypKey);
        let iv = CryptoJS.enc.Utf8.parse(this.routeCrypIv);
        let decrypted = CryptoJS.AES.decrypt(host,key,{
            iv:iv,
            mode:CryptoJS.mode.CBC,
            padding:CryptoJS.pad.NoPadding
        });
        let decryptedStr = decrypted.toString(CryptoJS.enc.Utf8);
        //有控制字符，替换为空
        decryptedStr = Global.Toolkit.strReplaceCtrChar(decryptedStr);
        return decryptedStr;
    }
}