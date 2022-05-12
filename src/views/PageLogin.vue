<template>
    <div class="login">
        <PageHeader title="登录" :backFn="() => $router.push('/')"></PageHeader>
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
        <div class="item remind" @click="yes = !yes">
            <span class="yes">
                <img v-show="yes" src="@/assets/image/page/loginr/yes@2x.png">
            </span>
            <label>{{$t('记住用户名和密码')}}</label>
        </div>
        <div class="item btn">
            <span  @click="login">{{$t('登录')}}</span>
        </div>
        <div class="item toRegister">
            <span>{{$t('没有账号?')}}</span><a @click="gotoPage('register')">{{$t('立即注册')}}</a>
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
        <!-- <div class="item gift_ct">
            <div>
                <img src="@/assets/image/page/loginr/gift@2x.png">
            </div>
            <p>{{$t('- 新用户三重好礼 -')}}</p>
            <p>{{$t('立即开通0.5%流水返利')}}</p> 
            <p>{{$t('立即开通最高1%的代理佣金返利')}}</p>
            <p>{{$t('实时查看投注返奖记录')}}</p>
        </div> -->
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
import {i18n} from '@/assets/lang'
import helper from '@/utils/helper'
import PageHeader from '@/components/PageHeader.vue'

export default {
    components:{
       PageHeader
   },
    setup() {
        const state = reactive({
            userName: '',
            password: '',
            yes: true,
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


        const store = useStore()
        const router = useRouter()
        const login = () => {
            store.dispatch('user/userLogin', 
                {account: state.userName, pwd: state.password}).then(() => {
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
            login,
            gotoPage,
            openCustomerLink,
            logoUrl
        }
    },
}
</script>
<style lang="less" scoped>
.login{
    color: #fff;padding-top: 0;padding-bottom: 56px;
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
    .remind{
        display: flex;align-items:center;
        .yes{
            background-color: #F7AA13;border-radius: 50%;
            width: 30px;height: 30px;display: inline-block;display: flex;align-items: center;justify-content: center;margin-right: 25px;
        }
        img{width: 20px;height: 13px;}
        label{
            font-size: 25px;opacity: .8;color: #FFFFFF;
        }
    }
    .btn{
        span{
            height: 82px;border-radius: 79px;display: block;
            font-size: 30px;color: #fff;text-align: center;line-height: 82px;
            background: linear-gradient(90deg, #E0B65B, #CE9C3D);
            box-shadow: 0px 17px 40px 0px rgba(206, 156, 61, 0.22);
            border-radius: 40px;
        }
    }
    .toRegister{
        text-align: center;margin-bottom: 122px;
        span{font-size: 25px;color:#fff;}
        a{font-size: 25px;color: #D2A143;text-decoration: none;}
    }
    .constract{
        display: flex;justify-content: space-between;align-items:center;width: 100%;
        // position: absolute;left:0;bottom: 42px;
        margin-top: 64px;
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
    .gift_ct{
        text-align: center;margin-bottom:0;
        img{width: 129px;height: 145px;margin-bottom: 28px;}
        p{
            font-size: 24px;color:#fff;opacity: .75;margin-bottom: 16px;
            &:nth-child(1){
                font-size: 30px;margin-bottom: 32px;
            }
            &:nth-last-child(1){margin-bottom: 0;}
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
        .page-header{margin-bottom: 64px;}
        // .left-arrow{display: none;}
    }
}
</style>