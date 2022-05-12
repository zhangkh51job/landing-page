<template>
    <footer class="zzz">
        <div class="item" :class="{active: currTab == i}" v-for="(item, i) in tabs" :key="i" @click="gotoPage(item, i)">
            <i :class="{[item.icon]: true, 'animate__animated animate__rubberBand': currTab == i}"></i>
            <p>{{$t(item.name)}}</p>
        </div>
    </footer>
</template>
<script>
import { reactive, toRefs } from '@vue/reactivity'
import { useRouter, useRoute } from 'vue-router'
import {  watch, toRaw } from '@vue/runtime-core'
// import { Toast } from 'vant'
// import { useI18n } from "vue-i18n";

export default {
    setup() {
        const state = reactive({
            tabs: [
                {icon: 'home', name: '主页', path: '/homeView'},
                {icon: 'discount', name: '优惠', path: '/pageDiscount'},
                {icon: 'dollar', name: '推广', path: '/promote'},
                {icon: 'rebate', name: '返水', path: '/rebate'},
                {icon: 'mine', name: '我的', path: '/pageMine'},
            ],
            currTab: 0
        })

        const router = useRouter()
        // const { t } = useI18n();
        const gotoPage = (item, i) => {
            // if( i == 3 || i == 2){
            //     Toast.fail(t('敬请期待'))
            //     return
            // }
            state.currTab = i
            router.push(item.path)
            console.log(router)
        }

        const route = useRoute()
        console.log(toRaw(route))
        const getCurrPath = (val) => {
            console.log('getCurrPath', val.fullPath, location.hash)
            for(let i = 0;i< state.tabs.length;i++){
                if(location.hash.indexOf( state.tabs[i].path ) >= 0){
                    state.currTab = i
                    break
                }
            }
        }
        watch(route, (val) => {
           getCurrPath(val)
        },{immediate:true, deep: true})

        // onBeforeMount(() => watchFunc())
        

        return {
            ...toRefs(state),
            gotoPage
        }
    },
}
</script>
<style lang="less" scoped>
footer{
    display: flex;
    align-items: center;
    justify-content: space-around;padding: 0 20px;background-color: #333;
    position:fixed;bottom: 0;width: 100%;height: 118px;z-index: 99;max-width:1000px;left:50%;transform: translateX(-50%);
    .item{
        display: flex;flex-direction:column;align-items:center;width:128px;
        i{
            display: inline-block;width: 40px;height: 40px;margin-bottom: 6px;opacity: 1 !important;
        }
        p{color: #fff;font-size: 18px;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;width: 100%;text-align: center;}
        .home{
            background: url('@/assets/image/page/footer/main@2x.png') center center no-repeat; background-size: contain;
        }
        .customer{
            background: url('@/assets/image/page/footer/customer@2x.png') center center no-repeat; background-size: contain;
        }
        .dollar{
            background: url('@/assets/image/page/footer/dollar@2x.png') center center no-repeat; background-size: contain;
        }
        .rebate{
            background: url('@/assets/image/page/footer/rebate@2x.png') center center no-repeat; background-size: contain;
        }
        .mine{
            background: url('@/assets/image/page/footer/mine@2x.png') center center no-repeat; background-size: contain;
        }
        .discount{
            // width: 48px;height: 40px;
            background: url('@/assets/image/page/footer/discount@3x.png') center center no-repeat; background-size: contain;
        }
    }
    .active{
            .home{
                background-image: url('@/assets/image/page/footer/main_active@2x.png');
            }
            .customer{
                background-image: url('@/assets/image/page/footer/customer_active@2x.png');
            }
            .dollar{
                background-image: url('@/assets/image/page/footer/dollar_active@2x.png');
            }
            .rebate{
                background-image: url('@/assets/image/page/footer/rebate_active@2x.png');
            }
            .mine{
                background-image: url('@/assets/image/page/footer/mine_active@2x.png');
            }
            .discount{
                background-image: url('@/assets/image/page/footer/discount_active@3x.png');
            }
            p{color: #DCAD5C;}
        }

}
</style>