<template>
    <div class="promote">
        <PageHeader title="推广赚钱"></PageHeader>
        <div class="promote_banner_ct">
            <img :src="require(`@/assets/image/page/promote/${lang}/promote_banner@2x.png`)">
        </div>
        <div class="data_info">
            <div class="total">
                <p class="num">{{(info.commi/1000000 || 0).toFixed(2)}}</p>
                <p class="name">{{$t('总佣金')}}</p>
            </div>
            <div class="second">
                <div class="row">
                    <div class="item">
                        <p class="num">{{ (info.settle_commi/1000000 || 0).toFixed(2) }}</p>
                        <p class="name">{{$t('已结算')}}</p>
                    </div>
                    <div class="item">
                        <p class="num">{{ (info.un_settle_commi/1000000 || 0).toFixed(2) }}</p>
                        <p class="name">{{$t('未结算')}}</p>
                    </div>
                </div>
                <div class="row">
                    <div class="item">
                        <p class="num">{{ (info.level_one || 0) }}</p>
                        <p class="name">{{$t('一级人脉')}}</p>
                    </div>
                    <div class="item">
                        <p class="num">{{ (info.level_two || 0) }}</p>
                        <p class="name">{{$t('二级人脉')}}</p>
                    </div>
                </div>
            </div>
            <div class="third">
                <div class="row">
                    <div class="item">
                        <p class="num">{{ (info.level_one_bet/1000000 || 0).toFixed(2) }}</p>
                        <p class="name">{{$t('一级总投注')}}</p>
                    </div>
                    <div class="item">
                        <p class="num">{{ (info.level_one_rate/100 || 0).toFixed(1) }}%</p>
                        <p class="name">{{$t('比例')}}</p>
                    </div>
                    <div class="item">
                        <p class="num">{{ (info.level_one_commi/1000000 || 0).toFixed(2) }}</p>
                        <p class="name">{{$t('一级总返佣')}}</p>
                    </div>
                </div>
                <div class="row">
                    <div class="item">
                        <p class="num">{{ (info.level_two_bet/1000000 || 0).toFixed(2) }}</p>
                        <p class="name">{{$t('二级总投注')}}</p>
                    </div>
                    <div class="item">
                        <p class="num">{{ (info.level_two_rate/100 || 0).toFixed(1) }}%</p>
                        <p class="name">{{$t('比例')}}</p>
                    </div>
                    <div class="item">
                        <p class="num">{{ (info.level_two_commi/1000000 || 0).toFixed(2) }}</p>
                        <p class="name">{{$t('二级总返佣')}}</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="share_ct">
            <div class="img_ct">
                <img :src="require(`@/assets/image/page/promote/${lang}/share_text@2x.png`)">
            </div>
            <!-- <div class="item_ct">
                <div class="item">
                    <img src="@/assets/image/page/promote/copy_link@2x.png">
                    <p>复制链接</p>
                </div>
                <div class="item">
                    <img src="@/assets/image/page/promote/qrcode@2x.png">
                    <p>二维码</p>
                </div>
                <div class="item">
                    <img src="@/assets/image/page/promote/wechat.png">
                    <p>微信分享</p>
                </div>
                <div class="item">
                    <img src="@/assets/image/page/promote/qq@2x.png">
                    <p>QQ分享</p>
                </div>
            </div> -->
            <div class="qrcode_ct">
                <div class="qr">
                    <qrcode-vue :value="urlStr" size="120"></qrcode-vue>
                </div>
                <div class="btn" @click="download">{{$t('保存二维码')}}</div>
            </div>
            <div class="url_ct">
                <div class="txt">
                    <p>{{$t('复制链接分享好友')}}</p>
                    <div>{{urlStr}}</div>
                </div>
                <textarea id="copy" style="opacity:0;position:absolute;left:200px;top:200px;width:10px;height:10px;pointer-events: none;"></textarea>
                <div class="btn" @click="copyHandle(urlStr)">{{$t('复制链接')}}</div>
            </div>
        </div>
        <div class="wallet_ct">
            <div class="img_ct">
                <img :src="require(`@/assets/image/page/promote/${lang}/wallet_text@2x.png`)">
            </div>
            <div class="min_settle">{{$t('* 最低结算金额：minSettle USDT *', {'minSettle': info.cmmmi_min_point})}}</div>
            <div class="info">
                <div class="num">{{address || '6852********4587'}}</div>
                <div class="btn" @click="doSettle">{{$t('结算')}}</div>
            </div>
            
        </div>
        <div class="guide_ct">
            <div class="img_ct">
                <img :src="require(`@/assets/image/page/promote/${lang}/guide_text@2x.png`)">
            </div>
            <div>
                <p>{{$t('1.佣金结算发放时间:每日的00: 00: 00系统自动派发(发放前一日)')}}</p>
                <p>{{$t('2.“未结算”的佣金，可以通过点击【结算】直接结算到钱包')}}</p>
                <p>{{$t('3.佣金计算方式')}}</p>
                <p>{{ $t('一级返佣--级用户的总投注*0.8%', {rate: (info.level_one_rate/100 || 0).toFixed(1)}  ) }}</p>
                <p>{{ $t('二级返佣=二级用户的总投注*0.2%', {rate: (info.level_two_rate/100 || 0).toFixed(1)} ) }}</p>
            </div>
        </div>
    </div>
</template>
<script>
import PageHeader from "@/components/PageHeader.vue"
import store from '@/vuex'
import { ref } from '@vue/reactivity'
import { computed } from '@vue/runtime-core'
import { i18n} from '@/assets/lang'
import QrcodeVue from 'qrcode.vue'
import {getQrcodeUrl, photoDom} from '@/utils/index'
import { Toast } from 'vant'
import { useI18n } from "vue-i18n"

export default {
    components:{
        PageHeader,
        QrcodeVue
    },
    setup() {
        const info = ref({})
        const lang = ref(i18n.global.locale)

        // const url = getQrcodeUrl()
        // const urlStr = ref(url)
        const urlStr = computed(() => getQrcodeUrl(store.state.user.userInfo))


        const getData = () => {
            store.dispatch('record/commiInfo').then(res => {
                info.value = res
            })
        }
        getData()

        const doSettle = () => {
            store.dispatch('record/doSettle').then(() => {
                // if(res){
                    getData()
                    Toast.success(t('申请成功'))
                // }
            })
        }

        const { t } = useI18n()
        const copyHandle = (urlStr)=>{
            const NumClip=document.querySelector('#copy');
            NumClip.value = urlStr
            // const NumClip = document.createElement('input');
            // NumClip.style="position:absolute;left:9999px;top:-9999px;"
            const NValue=NumClip.value //= val;
            const valueLength = NValue.length;
            console.log(valueLength)
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

        const address = computed(() => {
            const addr = store.state.user.userInfo.address || ''
            const f = addr.slice(0, 4)
            const e = addr.slice(addr.length-4, addr.length)
            return f + '****' + e
        })

        const download = () => {
            const dom = document.querySelector('.qr')
            photoDom(dom, () => {
                Toast.success(t('下载成功'))
            });
        }
        
        return {
            info,
            lang,
            doSettle,
            address,
            urlStr,
            copyHandle,
            download
        }
    },
}
</script>
<style lang="less" scoped>
.promote{
    padding-bottom: 96px;background-color: #000;
    >div{margin-bottom: 30px;background-color: #1F1F1F;}
    .promote_banner_ct{
        img{width: 100%;height: auto;;}
    }
    .data_info{
        margin-left: 20px;margin-right: 20px;border-radius: 17px;
        >div{
            border-bottom: 1px solid #3b3328;
        }
        .total{
            display: flex;align-items: center;justify-content: center;
            flex-direction: column;height: 152px;
            .num{
                    color: #DCAD5C;font-size: 42px;font-weight: bold;
                }
                .name{
                    color: #99968E;font-size: 30px;text-align: center;
                }
        }
        .row{
            display: flex;border-bottom: 1px solid #3b3328;
            .item{
                border-right: 1px solid #3b3328;height: 176px;
                display: flex;align-items:center;justify-content:center;flex-direction:column;
                &:nth-last-child(1){border-right: transparent;}
                .num{
                    color: #DCAD5C;font-size: 42px;font-weight: bold;
                }
                .name{
                    color: #99968E;font-size: 30px;text-align: center;
                }
            }
        }
        .second .item{width: 50%;}
        .third {
            border-bottom: transparent;
            .row{&:nth-last-child(1){border-bottom: transparent;}}
            .item{width: 33.33%;}
        }
    }
    .share_ct{
        padding-top:53px;padding-bottom: 77px;border-radius: 17px;
        .img_ct{
            text-align: center;margin-bottom: 65px;
            img{
                height: 41px;
            }
        }
        .item_ct{
            padding: 0 40px;display: flex;align-items: center;justify-content: space-between;
            img{
                width: 103px;height: 103px;margin-bottom: 30px;
            }
            .item{
                display: flex;flex-direction: column;align-items: center;justify-content: center;
                p{
                    color: #99968E;font-size: 30px;text-align: center;
                }
            }
        }
        .qrcode_ct{
            text-align:center;
            .qr{
                display: inline-block;padding:10px;background-color: #fff;margin-bottom: 28px;
            }
            .btn{
                width: 242px;height: 64px;background: linear-gradient(90deg, #E0B65B, #CE9C3D);border-radius: 40px;
                font-size: 24px;color:#fff;text-align: center;margin: 0 auto 54px auto;
                display:flex;align-items: center;justify-content: center;line-height: 1;
            }
        }
        .url_ct{
            margin: 0 18px;background-color: #151516;border-radius: 63px;height: 126px;
            display: flex;align-items: center;justify-content: space-between;position: relative;
            .txt{
                margin-left: 47px;    line-height: 1.6;
                p,div{font-size: 24px;color: #DADADA;}
            }
            .btn{
                margin-right: 10px;width: 206px;height: 106px;text-align: center;font-size: 28px;
                background: linear-gradient(90deg, #E0B65B, #CE9C3D);border-radius: 53px;color:#fff;
                display:flex;align-items: center;justify-content: center;line-height: 1;
            }
        }
    }
    .wallet_ct{
        border-radius: 17px;padding-top: 50px;padding-bottom: 58px;
        .img_ct{
            text-align: center;margin-bottom: 24px;
            img{height: auto;width: auto;}
        }
        .min_settle{
            margin-bottom:40px;color: #787878;font-size: 24px;text-align: center;
        }
        .info{
            padding: 0 30px;display: flex;align-items: center;
            .num{
                width: 383px;height: 79px;background: rgba(0, 0, 0, .32);border-radius: 40px;
                font-size: 23px;color: #fff;letter-spacing: 6px;padding: 0 45px;
                display: flex;align-items: center;justify-content: space-between;
            }
            .btn{
                width: 200px;height: 79px;background: linear-gradient(90deg, #E0B65B, #CE9C3D);border-radius: 40px;
                font-size: 30px;color: #fff;text-align: center;line-height: 79px;margin-left: 52px;
            }
        }
    }
    .guide_ct{
        padding: 52px 40px;
        .img_ct{
            text-align: center;margin-bottom: 48px;
            img{
                height: 40px;width: auto;
            }
        }
        p{
            color: #D4D4D4;font-size: 28px;line-height: 2;
        }
    }
    :deep{
        .page-header{margin-bottom: 0;}
        .left-arrow{display: none;}
    }
}

</style>