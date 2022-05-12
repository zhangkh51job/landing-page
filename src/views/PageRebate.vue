<template>
    <div class="rebate">
        <PageHeader title="流水返现"></PageHeader>
        <div class="rebate_ct">
            <img src="@/assets/image/page/promote/liushui@2x.png">
        </div>
        <div class="data_info">
            <div class="row">
                <div class="item">
                    <p class="num">{{ (info.commi/1000000 || 0).toFixed(2) }}</p>
                    <p class="name">{{$t('历史总返水')}}</p>
                </div>
                <div class="item">
                    <p class="num">{{ (info.bet/1000000 || 0).toFixed(2) }}</p>
                    <p class="name">{{$t('历史总投注')}}</p>
                </div>
            </div>
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
        </div>
        <div class="wallet_ct">
            <div class="img_ct">
                <img :src="require(`@/assets/image/page/promote/${lang}/wallet_text@2x.png`)">
            </div>
            <div class="min_settle">{{$t('* 最低结算金额：minSettle USDT *', {'minSettle': info.cmmmi_min_point})}}</div>
            <div class="info">
                <div class="num">{{ address }}</div>
                <div class="btn" @click="do_settle_flow">{{$t('结算')}}</div>
            </div>
        </div>
        <div class="guide_ct">
            <div class="img_ct">
                <img :src="require(`@/assets/image/page/promote/${lang}/guide_text@2x.png`)">
            </div>
            <div>
                <p>{{$t('1.返水结算发放时间:每日的00: 00:00系统自动派发(发放前一日)')}}</p>
                <p>{{$t('2.未结算”的返水,可以通过点击【结算】直接结算到钱包')}}</p>
                <p>{{$t('3.返水计算方式-返水=用户的总投注*0.5%')}}</p>
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
import {Toast} from 'vant'
import { useI18n } from "vue-i18n"

export default {
    components:{
        PageHeader
    },
    setup() {
        const info = ref({})
        const lang = ref(i18n.global.locale)

        const getData = () => {
            store.dispatch('record/flowInfo').then(res => {
                info.value = res
            })
        }
        getData()

        const { t } = useI18n()
        const do_settle_flow = () => {
            store.dispatch('record/do_settle_flow').then(() => {
                // if(res){
                    getData()
                    Toast.success(t('申请成功'))
                // }
            })
        }

        const address = computed(() => {
            const addr = store.state.user.userInfo.address || ''
            const f = addr.slice(0, 4)
            const e = addr.slice(addr.length-4, addr.length)
            return f + '****' + e
        })


        return {
            info,
            lang,
            address,
            do_settle_flow
        }
    },
}
</script>
<style lang="less" scoped>
.rebate{
    padding-bottom: 110px;background-color: #000;
    >div{margin-bottom: 30px;background-color: #1F1F1F;}
    .rebate_ct{
        img{width: 100%;height: auto;;}
    }
    .data_info{
        margin-left: 20px;margin-right: 20px;
        .row{
            display: flex;height: 176px;align-items:center;
            &:nth-child(1){
                border-bottom: 1px solid #3b3328;
            }
            .item{
                height:100%;width: 50%;display:flex;align-items:center;justify-content:center;flex-direction:column;
                &:nth-child(1){
                    border-right: 1px solid #3b3328;
                }
            }
            .num{
                color: #DCAD5C;font-size: 42px;margin-bottom: 8px;font-weight: bold;
                    
            }
            .name{
                color: #99968E;font-size: 30px;text-align: center;
            }
        }
    }
    .wallet_ct{
        border-radius: 17px;padding-top: 50px;padding-bottom: 58px;margin-left: 20px;margin-right: 20px;
        .img_ct{
            text-align: center;margin-bottom: 24px;
            img{/*height: 41px;*/width: auto;}
        }
        .min_settle{
            margin-bottom:40px;color: #787878;font-size: 24px;text-align: center;
        }
        .info{
            padding: 0 30px;display: flex;align-items: center;
            .num{
                width: 383px;height: 79px;background: rgba(0, 0, 0, .32);border-radius: 40px;
                font-size: 23px;color: #fff;letter-spacing: 6px;padding: 0 45px;
                display: flex;align-items: center;justify-content: center;flex-grow: 1;text-align: center;
            }
            .btn{
                width: 200px;height: 79px;background: linear-gradient(90deg, #E0B65B, #CE9C3D);border-radius: 40px;
                font-size: 30px;color: #fff;text-align: center;line-height: 79px;margin-left: 52px;
            }
        }
    }
    .guide_ct{
        padding: 52px 40px 83px;margin-left: 20px;margin-right: 20px;
        .img_ct{
            text-align: center;margin-bottom: 48px;
            img{
                height: auto;width: auto;
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