<template>
    <div class="register">
        <div class="item img_ct">
            <!-- <img class="welcome" :src="require(`@/assets/image/page/loginr/${lang}/welcome@2x.png`)"> -->
            <div><img class="welcome" :src="logoUrl"></div>
            <div><img class="welcome_text" src="@/assets/image/welcome@2x.png"></div>
        </div>
        <div class="item account">
            <i></i>
            <input type="text" v-model="userName" :placeholder="$t('请输入您的用户名')">
        </div>
        <div class="item password">
            <i></i>
            <input type="password" v-model="password" :placeholder="$t('请输入您的密码')">
        </div>
        <div class="item password">
            <i></i>
            <input type="password" v-model="rePassword" :placeholder="$t('请再此确认您的密码')">
        </div>
        <div class="item addr">
            <i></i>
            <input type="text" v-model="trcAddress" :placeholder="$t('请输入TRC20地址')">
        </div>
        <div class="item btn">
            <span @click="registe">{{$t('注册')}}</span>
        </div>
        <div class="item toLogin">
            <span>{{$t('已有账号？')}}</span><a @click="gotoPage('login')">{{$t('立即登录')}}</a>
        </div>
        <div class="item constract">
            <span class="left" @click="gotoPage('')">
                <i></i><label>{{$t('先去逛逛')}}</label>
            </span>
            <span class="line"></span>
            <span class="right" @click="panelShow = true">
                <i></i><label>{{$t('联系我们')}}</label>
            </span>
        </div>
        <van-popup v-model:show="panelShow">
            <div class="panel_ct">
				<div class="p_title">
					{{$t('联系我们')}}<i class="close" @click="panelShow = false"></i>
				</div>
				<div class="content">
					<div class="item qq" v-if="QQLink">
						<div class="left">
							<img src="@/assets/image/_qq@2x.png">
							<div>
								<div class="name">QQ</div>
								<div class="value">{{QQNumber}}</div>
							</div>
						</div>
						<div class="consult" @click="openCustomerLink(QQLink)">{{$t('咨询')}}</div>
					</div>
					<div class="item wx" v-if="wechatLink">
						<div class="left">
							<img src="@/assets/image/_wx@2x.png">
							<div>
								<div class="name">{{$t('微信')}}</div>
								<div class="value">{{wechatNumber}}</div>
							</div>
						</div>
						<div class="consult" @click="openCustomerLink(wechatLink)">{{$t('咨询')}}</div>
					</div>
					<div class="item teg" v-if="telegramLink">
						<div class="left">
							<img src="@/assets/image/_telegram@2x.png">
							<div>
								<div class="name">telegram</div>
								<div class="value">{{telegramNumber}}</div>
							</div>
						</div>
						<div class="consult" @click="openCustomerLink(telegramLink)">{{$t('咨询')}}</div>
					</div>
					<div class="item whats" v-if="whatsappLink">
						<div class="left">
							<img src="@/assets/image/_whats@2x.png">
							<div>
								<div class="name">WhatsApp</div>
								<div class="value">{{whatsappNumber}}</div>
							</div>
						</div>
						<div class="consult" @click="openCustomerLink(whatsappLink)">{{$t('咨询')}}</div>
					</div>
                    <div class="item whats" v-if="lineLink">
						<div class="left">
							<img src="@/assets/image/lineLink@2x.png">
							<div>
								<div class="name">line</div>
								<div class="value">{{lineLinkaaa}}</div>
							</div>
						</div>
						<div class="consult" @click="openCustomerLink(lineLink)">{{$t('咨询')}}</div>
					</div>
				</div>
			</div>
        </van-popup>
    </div>
</template>
<script>
import { reactive, toRefs, computed } from '@vue/reactivity'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import {Toast} from 'vant'
import {i18n} from '@/assets/lang'
import { useI18n } from "vue-i18n"
import {parseParam} from '@/utils/index'
import helper from '@/utils/helper'

export default {
    setup() {
        const state = reactive({
            userName: '',
            password: '',
            rePassword: '',
            trcAddress: '',
            superior: '',
            generalCode: 0,
            panelShow: false,
            lang: i18n.global.locale,

            QQNumber: window.QQNumber,
            wechatNumber: window.wechatNumber,
            telegramNumber: window.telegramNumber,
            whatsappNumber: window.whatsappNumber,

            QQLink:         window.QQLink,
            wechatLink:     window.wechatLink,
            telegramLink:   window.telegramLink,
            whatsappLink:   window.whatsappLink,
            lineLink:   window.lineLink,
            // logoUrl: window.logo_url,
        })

        const registeCheck = () => {
            if(!state.userName){
                Toast.fail('用户名不能为空')
                return false
            }
            if(!state.password){
                Toast.fail('密码不能为空')
                return false
            }
            if(!state.trcAddress){
                Toast.fail('TRC地址不能为空')
                return false
            }
            if(state.password != state.rePassword){
                Toast.fail('密码与重复密码不一致')
                return false
            }
            return true
        }

        

        const store = useStore()
        const router = useRouter()
        const paramObj = parseParam()
         const { t } = useI18n()
        const registe = () => {
            const pass = registeCheck()
            if(!pass) return
            store.dispatch('user/userRegister', 
                {
                    account: state.userName, 
                    pwd: state.password,
                    address: state.trcAddress,
                    pid: Number(paramObj['ic']),
                    general_id:  Number(window.general_id),// || '' //Number(paramObj['id']),
                    // pack_no:    Number(paramObj['ch']) || 0, 
                    pack_no:    Number(window.pack_no) || 0, 
                }).then(() => {
                    Toast.success(t('注册成功!'))
                    router.push('/')
            })
        }

        const logoUrl = computed(() => {
            return store.state.activity.logo_url || window.logo_url
        })

        const openCustomerLink = (val) => {
            // window.open(val, '_blank')
            helper.toOutLink(val)
        }


        const gotoPage = (type) => {
            router.push('/'+type)
        }


        return {
            ...toRefs(state),
            registe,
            gotoPage,
            openCustomerLink,
            logoUrl
        }
    },
}
</script>
<style lang="less" scoped>
.register{
    color: #fff;padding-top: 64px;padding-bottom: 75px;
    display: flex;flex-direction: column;min-height: 100vh;
    > .item{
        padding:0 72px;
        margin-bottom: 50px;
        input{
            padding-left: 45px;
            font-size: 25px;
            width: 557px;
            height: 76px;
            border: 1px solid #FFFFFF;
            opacity: 0.8;
            border-radius: 6px;color: #FFFFFF;background-color: rgba(0,0,0,0);
            flex-grow: 1;
        }
        i{
            display: inline-block;width: 28px;height: 32px;margin-right: 24px;
        }
        button{
            width: 60%;
        }
    }
    .img_ct{
        margin-bottom: 88px;
        // img{max-width: 306px;max-height: 155px;}
        .welcome{max-width: 459px;max-height: 232.5px;margin-bottom: 32px;}
        .welcome_text{max-width: 306px;}
    }
    .account{
        display: flex;align-items:center;
        i{background: url('@/assets/image/page/loginr/acc@2x.png') left top no-repeat;background-size: contain;}
    }
    .password{
        display: flex;align-items:center;
        i{background: url('@/assets/image/page/loginr/pwd@2x.png') left top no-repeat;background-size: contain;}
    }
    .addr{
        display: flex;align-items:center;margin-bottom: 130px;
        i{background: url('@/assets/image/page/loginr/addr@2x.png') left top no-repeat;background-size: contain;width: 34px;height: 34px;}
    }
    .btn{
        margin-bottom: 76px;
        span{
            height: 82px;border-radius: 79px;display: block;
            font-size: 30px;color: #fff;text-align: center;line-height: 82px;
            background: linear-gradient(90deg, #E0B65B, #CE9C3D);
            box-shadow: 0px 17px 40px 0px rgba(206, 156, 61, 0.22);
            border-radius: 40px;
        }
    }
    .toLogin{
        text-align: center;margin-bottom: 137px;
        span{font-size: 25px;color:#fff;}
        a{font-size: 25px;color: #D2A143;text-decoration: none;}
    }
    .constract{
        display: flex;justify-content: space-between;align-items:center;margin-bottom: 0;
        .line{
            width: 1px;height: 40px;background: #F7AA13;opacity: 0.61;
        }
        .left {
            display: flex;align-items:center;
            i{
                width: 39px;height: 29px;display: inline-block;margin-right: 19px;
                background: url('@/assets/image/page/loginr/constract@2x.png') center center no-repeat;background-size: contain;
            }
        }
        .right {
            display: flex;align-items:center;
            i{
            width: 32px;height: 32px;display: inline-block;margin-right: 22px;
            background: url('@/assets/image/page/loginr/find@2x.png') center center no-repeat;background-size: contain;
            }
        }
        label{
            font-size: 25px;opacity: .6;
        }
    }

    .panel_ct{
        padding: 40px 40px 0px;
        .p_title{
            position: relative;color:#141414;text-align: center;margin-bottom: 58px;
        }
        .close{
            display: inline-block;width: 30px;height: 30px;background: url("@/assets/image/_close@2x.png") left top no-repeat;background-size: contain;
            position: absolute;top: 0;right: 0;
        }
        .left{
            display: flex;align-items: center;
        }
        .item{
            margin-bottom: 40px;display: flex;align-items: center;justify-content: space-between;
        }
        img{
            margin-right: 16px;width: 80px;height: 80px;
        }
        .name{
            color: #000000;font-size: 28px;margin-bottom: 8px;
        }
        .value{
            color: #999999;font-size: 24px;
        }
        .consult{
            width: 160px;height: 65px;color:#FFCB61;background-color: #0B0B0B;border-radius: 33px;
            font-size: 28px;display: flex;align-items: center;justify-content: center;
        }
    }
    :deep{
        .van-popup{
            width: 80%;
        }
    }
}
</style>