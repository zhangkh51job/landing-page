<template>
    <div class="customer">
        <PageHeader title="客服"></PageHeader>
        <div class="welcome">
            <div class="top">
                <img src="@/assets/image/page/mine/head.png">
                <div>
                    <h2>{{$t('欢迎来到客服中心')}}</h2>
                    <p>{{$t('24小时随时为你服务')}}</p>
                </div>
            </div>
            <div class="line"></div>
            <p class="bottom">
                {{$t('如遇到问题需要需要帮助，请联系线上客服')}}
            </p>
        </div>
        <!-- <div class="constract_btn" @click="openCustomerLink(customerLink)">
            <i></i>{{$t('联系客服')}}
        </div> -->
        <ul>
            <li>
                <div class="left">
                    <i class="contract"></i>
                    <div>
                        <p>{{$t('客服')}}</p>
                        <!-- <p>{{item.number}}</p> -->
                    </div>
                </div>
                <div class="consult" @click="openCustomerLink(customerLink)">{{$t('咨询')}}</div>
            </li>
            <li v-for="(item, i) in constractList" :key="i"  v-show="item.link">
                <div class="left">
                    <i :class="item.icon"></i>
                    <div>
                        <p>{{item.icon}}</p>
                        <p>{{item.number}}</p>
                    </div>
                </div>
                <div class="consult" @click="openCustomerLink(item.link)">{{$t('咨询')}}</div>
            </li>
        </ul>
    </div>
</template>
<script>
import { reactive, toRefs } from '@vue/reactivity'
import PageHeader from '@/components/PageHeader.vue'
import helper from '@/utils/helper'

export default {
   components:{
       PageHeader
   },
    setup() {
        const state = reactive({
            constractList: [
                {icon: 'qq',           link: window['QQLink']},
                {icon: 'wechat',       link: window['wechatLink']},
                {icon: 'telegram',      link: window['telegramLink']},
                {icon: 'whatsapp',      link: window['whatsappLink']},
                {icon: 'line',      link: window['lineLink']},
            ],
            customerLink: window['customerLink']
        })

        const openCustomerLink = (val) => {
            // window.open(val, '_blank')
            helper.toOutLink(val, val == state.customerLink)
        }

        return {
            ...toRefs(state),
            openCustomerLink,
        }
    },
}
</script>
<style lang="less" scoped>
.customer{
    padding: 0 0px 32px;background-color: #0F0E0F;
    .welcome{
        min-width: 686px;height: 306px;
        background: linear-gradient(90deg, #FDFDFD 0%, #EDD28D 100%);
        border-radius: 24px;;padding: 56px 64px 0 64px;margin: 0 32px 48px;
        .top{
            display: flex;margin-bottom: 32px;align-items:center;
            img{
                width: 108px;
                height: 108px;background-color: #EDD28D;border-radius: 50%;margin-right: 24px;
            }
            h2{
                font-size: 32px;margin-bottom: 18px;font-weight: 500;color: #000000;
            }
            p{
              font-size: 22px;color: #938D7B;
            }
        }
        .line{width: 558px;height: 2px;background: #0F0E0F;border-radius: 1px;opacity: 0.29;}
        .bottom{
            font-size: 24px;color: #494740;text-align: center;height: 98px;display: flex;align-items: center;justify-content: center;
            line-height: 1;
        }
    }
    .constract_btn{
        min-width: 538px;height: 88px;margin:0 32px 80px;font-size: 28px;color:#000;font-weight: bold;
        background: linear-gradient(180deg, #A86800 0%, #EFCA72 100%);border-radius: 44px;padding: 0 20px;
        display: flex;align-items: center;justify-content: center;
        i{
            display: inline-block;width: 32px;height: 34px;margin-right: 10px;
            background: url('@/assets/image/page/mine/man@2x.png') left center no-repeat;background-size: contain;
        }
    }
    ul{
        min-width: 686px;padding: 40px;
        background: #FFFFFF;
        border-radius: 24px;margin: 0 32px;
        li{
            list-style: none;margin-bottom: 40px;display: flex;
            justify-content: space-between;    align-items: center;
            .left{
                display: flex;align-items:center;
                i{
                    display:inline-block;width: 80px;height: 80px;margin-right: 16px;
                }
                .qq{
                    background: url('@/assets/image/_qq@2x.png') center center no-repeat; background-size: contain;
                }
                .wechat{
                    background: url('@/assets/image/_wx@2x.png') center center no-repeat; background-size: contain;
                }
                .telegram{
                    background: url('@/assets/image/_telegram@2x.png') center center no-repeat; background-size: contain;
                }
                .whatsapp{
                    background: url('@/assets/image/_whats@2x.png') center center no-repeat; background-size: contain;
                }
                .line{
                    background: url('@/assets/image/lineLink@2x.png') center center no-repeat; background-size: contain;
                }
                .contract{
                    background: url('@/assets/image/_contract.png') center center no-repeat; background-size: contain;
                }
                p{
                    &:nth-child(1){
                        font-size: 26px;color: #000;font-weight: bold;margin-bottom: 8px;
                    }
                    &:nth-child(2){
                        font-size: 24px;color: #999999;
                    }
                }
            }
            .consult{
                width: 140px;height: 52px;background: #0B0B0B;border-radius: 33px;
                color: #FFCB61;text-align: center;font-size: 24px;
                // line-height: 52px;
                display: flex;align-items: center;justify-content: center;line-height: 0.9;
            }
            &:nth-last-child(1){margin-bottom: 0;}
        }
    }
    :deep{
        .page-header{margin-bottom: 32px;}
        // .left-arrow{display: none;}
    }
}
</style>