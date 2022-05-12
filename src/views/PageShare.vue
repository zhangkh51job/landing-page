<template>
    <div class="share" :class="'share_'+lang">
        <div class="btns">
            <i class="left-arrow" @click="clickHandle"></i>
            <span class="share_btn" @click="download"></span>
        </div>
        <img :src="require(`@/assets/image/page/share/${lang}/share.jpg`)">
        <div class="qr_ct"  @click="copyHandle()">
            <!-- <div class="urlStr">{{urlStr}}</div> -->
            <!-- <qrcode-vue 
                level="H"
                :value="urlStr" 
                size="180"></qrcode-vue> -->
            <vue-qr margin=0 :logoSrc="src2" :text="urlStr" :size="180"></vue-qr>
        </div>
        <textarea id="copy" style="opacity:0;position:absolute;left:200px;top:200px;width:10px;height:10px;"></textarea>
    </div>
</template>
<script>
// import QrcodeVue from 'qrcode.vue'
import {  reactive, ref, toRefs } from '@vue/reactivity'
import router from '@/router'
import {i18n} from '@/assets/lang'
import {getQrcodeUrl, photoDom} from '@/utils/index'
import { Toast } from 'vant'
import { useI18n } from "vue-i18n"
import store from '@/vuex'
import { computed } from '@vue/runtime-core'
import vueQr from 'vue-qr/src/packages/vue-qr.vue'


export default {
    components: {  vueQr },
    mixins:[],
    setup() {
        // const url = getQrcodeUrl()
        // const urlStr = ref(url)
        const urlStr = computed(() => {
            return getQrcodeUrl(store.state.user.userInfo)
        })
        const state = reactive({
            src2: ''
        })
        const lang =     ref(i18n.global.locale)
        const clickHandle = () => {
            router.go(-1)
        }

        try{
            state.src2 = (window.favicon != '{{.favicon}}') && require(window.favicon)
        }catch(e){
            state.src2 = ''
        }

        const { t } = useI18n()
        const copyHandle = ()=>{
            const NumClip=document.querySelector('#copy');
            NumClip.value = urlStr.value
            // const NumClip = document.createElement('input');
            // NumClip.style="position:absolute;left:9999px;top:-9999px;"
            const NValue=NumClip.value //= val;
            const valueLength = NValue.length;
            selectText(NumClip, 0, valueLength);
            if(document.execCommand('copy', false, null)){
                document.execCommand('copy', false, null)// 执行浏览器复制命令
                console.log("已复制,赶紧分享给朋友吧");
            }else{
                console.log("不兼容");
            }
            Toast.success(t('复制成功'))
        }
        // input自带的select()方法在苹果端无法进行选择，所以需要自己去写一个类似的方法
        // 选择文本。createTextRange(setSelectionRange)是input方法
        const selectText = function (textbox, startIndex, stopIndex) {
            if(textbox.createTextRange) {//ie
                const range = textbox.createTextRange();
                range.collapse(true);
                range.moveStart('character', startIndex);//起始光标
                range.moveEnd('character', stopIndex - startIndex);//结束光标
                range.select();//不兼容苹果
            }else{//firefox/chrome
                textbox.setSelectionRange(startIndex, stopIndex);
                textbox.focus();
            }
        }

        const download = () => {
            const dom = document.querySelector('.share')
            dom.querySelector('.btns').style.display = 'none'
            photoDom(dom , () => {
                dom.querySelector('.btns').style.display = 'block'
                Toast.success(t('下载成功'))
            })
        }


        return {
            ...toRefs(state),
            lang,
            urlStr,
            clickHandle,
            copyHandle,
            download
        }

    },
}
</script>
<style lang="less" scoped>
.share{
    position: relative;
    min-height: 100vh;
    width: 750px;
    > img{
        width: 100%;height: auto;
    }
    .left-arrow{
        position: absolute;display: inline-block;
        width: 23px;height: 40px;left: 32px;top: 44px;transform: translateY(-50%);
        background: url('@/assets/image/page/footer/left_arrow@2x.png') center center no-repeat; background-size: contain;
    }
    .share_btn{
        position: absolute;display: inline-block;
        width: 63px;height: 59px;right: 32px;top: 44px;transform: translateY(-50%);
        background: url('@/assets/image/page/share/share_btn.png') center center no-repeat; background-size: contain;
    }
    .qr_ct{
        position: absolute;
        top: 728px;left: 162px;
        width: 428px;height: 410px;
        display: flex;align-items: center;justify-content: center;
        background-color: rgba(220, 173, 92, .6);
        border-radius: 14px;
    }

    :deep{
        .qr_ct canvas{
            width: 100%;height: 100%;
        }
    }
}
.share_cn{
     background: url('@/assets/image/page/share/cn/share.jpg') left top repeat;background-size: 100% 100%;
}
.share_cn_tw{
     background: url('@/assets/image/page/share/cn_tw/share.jpg') left top repeat;background-size: 100% 100%;
}
.share_en{
     background: url('@/assets/image/page/share/en/share.jpg') left top repeat;background-size: 100% 100%;
}
</style>