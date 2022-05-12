<template>
    <div class="page-mine">
        <div class="head">
            <img src="@/assets/image/page/mine/head2.png">
        </div>
        <div class="account">
            <p>{{$t('账号')}}:{{ userInfo.account }}</p>
            <span class="split"></span>
            <p>ID:{{ userInfo.uid }}</p>
        </div>
        <div class="address">
            <h2>{{$t('TRC地址')}}</h2>
            <div class="addr_ct">{{ userInfo.address }}</div>
        </div>
        <ul class="animate__animated animate__lightSpeedInLeft">
            <li v-for="(item,i) in mineList" :key="i" @click="gotoPath(item, i)" :class="[i == 2? 'isTwo': '']">
                <div>
                    <i :class="item.icon"></i>
                    <label>{{$t(item.name)}}</label>
                </div>
                <span class="right_arrow"></span>
            </li>
        </ul>
    </div>
</template>
<script>
import { reactive, toRefs, computed } from '@vue/reactivity'
import { useRouter } from 'vue-router'
import store from '@/vuex'
import { Dialog } from 'vant'
import {requestTwoMoblieConfig} from '@/net/index'
import { useI18n } from "vue-i18n";

export default {
    name: 'PageMine',
    setup() {
        const state = reactive({
            mineList: [
                {icon: 'bet_record', name: '投注记录', path: '/betRecord'},
                {icon: 'rebate_record', name: '返水结算记录', path: '/commissionRecord?type=2'},
                {icon: 'commision_record', name: '佣金结算记录', path: '/commissionRecord?type=1'},
                // {icon: 'constract', name: '联系客服', path: '/pageCustomer'},
                {icon: 'download', name: '下载APP', path: ''},
                {icon: 'share', name: '分享好友', path: '/share'},
                {icon: 'logoout', name: '退出登录', path: '/'},
            ],
            // trc_addr: 'aaa',
            // account: 'XXXXX',
            // ID: '2888888',
            userInfo: store.state.user.userInfo,
            ios_key: window.ios_key,
        })

        const general_id = computed(() => {
            return store.state.user.userInfo.general_id || window.general_id
        })

        const { t } = useI18n()
        const download = () => {
            if(!localStorage.getItem('token')){
                router.push('/login')
                return
            }
            const isIOS = window.navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
            if(isIOS) {
                requestTwoMoblieConfig('https://webclip.bnd6.com/', state.ios_key, general_id.value)
            }else {
                const url = window['downloadAndroid']
                const newWindow = window.open('', '_blank')
                setTimeout(() => {
                    newWindow.location.href = url
                }, 100)
            }
        }


        const router = useRouter()
        const gotoPath = (item, i) => {
            // if(i < 3){
            //     return Toast.fail(t('敬請期待'))
            // }else 
            if( i == 3){
                download()
                return
            }
            else if(i == 5){
                return Dialog.confirm({
                    title: t('提示'),
                    message:
                        t('确定退出登录？'),
                    })
                .then(() => {
                    // on confirm
                    localStorage.removeItem('token')
                    router.push('/')
                })
                .catch(() => {
                    // on cancel
                });
            }
            router.push(item.path)
        }


        // const store = useStore()
        // const login = () => {
        //     store.dispatch('user/userLogin', 
        //         {Account: state.userName, Pwd: state.password}).then(() => {
        //         router.push('/')
        //     })
        // }

        return {
            ...toRefs(state),
            gotoPath
        }
    },
}
</script>
<style lang="less" scoped>
.page-mine{
    background: url('@/assets/image/page/mine/bg@2x.png') left top no-repeat;background-size: 100% auto;
    background-color: #0F0E0F;min-height: 100vh;padding-bottom: 128px;
    .head{
        padding-top: 43px;margin-bottom: 30px;text-align: center;
        img{
            width: 156px;height: 156px;border-radius: 50%;background-color: #ff0000;
        }
    }
    .account{
        display: flex;justify-content: center;align-items: center;margin-bottom: 38px;
        .split{
            display: inline-block;width: 2px;height: 28px;background-color: #FFFFFF;
            margin: 0 26px;
        }
        p{font-size: 28px;color: #fff;}
    }
    .address{
        width: 686px;
        height: 196px;
        background: #FFFBF0;
        border-radius: 16px;margin: 0 auto 20px auto;
        display: flex;flex-direction: column;
        justify-content: center;align-items: center;
        h2{
            color: #0F0E0F;font-size: 28px;margin-bottom: 24px;width: 100%;padding-left:52px; 
        }
        .addr_ct{
            width: 582px;
            height: 80px;
            background: #0F0E0F;color: #FFFFFF;font-size: 24px;
            border-radius: 41px;text-align: center;line-height: 80px;text-align: left;padding: 0 48px;
        }
    }
    ul{
        opacity: 1 !important;
        li{
            background-color: #191819;padding-left: 36px;padding-right: 55px;
            list-style: none;display: flex;align-items: center;justify-content: space-between;height: 104px;
            i{
                display: inline-block;width: 44px;height: 44px;vertical-align: middle;margin-right: 22px;
            }
            label{color: #DCAD5C;font-size: 28px;vertical-align: middle;}
            .bet_record{
                background: url('@/assets/image/page/mine/camera@2x.png') left center no-repeat;background-size: contain;
            }
            .rebate_record{
                width: 40px;height: 40px;
                background: url('@/assets/image/page/footer/rebate_active@2x.png') left center no-repeat;background-size: contain;
            }
            .commision_record{
                background: url('@/assets/image/page/footer/dollar_active@2x.png') left center no-repeat;background-size: contain;
            }
            .constract{
                background: url('@/assets/image/page/footer/customer_active@2x.png') left center no-repeat;background-size: contain;
            }
            .download{
                width: 44px;height: 46px;
                background: url('@/assets/image/page/mine/download@2x.png') left center no-repeat;background-size: contain;
            }
            .share{
                background: url('@/assets/image/page/mine/share@2x.png') left center no-repeat;background-size: contain;
            }
            .right_arrow{
                display: inline-block;width: 21px;height: 30px;
                 background: url('@/assets/image/page/mine/right_arrow@2x.png') left center no-repeat;background-size: contain;
            }
            .logoout{
                width: 40px;height: 34px;
                background: url('@/assets/image/page/mine/logoout@2x.png') left center no-repeat;background-size: contain;
            }
        }
        .isTwo{
            margin-bottom: 20px;
        }
    }
}
</style>