<template>
    <div class="pageDiscount">
        <PageHeader title="优惠"></PageHeader>
        <ul v-if="discountList.length">
            <li v-for="(item, i) in discountList" :key="i" @click="checkDetail(item)">
                <div class="name">
                    {{item.title}}
                    <span class="new" v-if="item.alert == 2">{{$t('新增')}}</span>
                    <span class="hot" v-if="item.alert == 1">{{$t('热门')}}</span>
                </div>
                <div class="img_ct">
                    <img :src="item.logo">
                </div>
                <div class="info">
                    <span>
                        {{$t('活动时间:')}}
                        <template v-if="item.start && item.end">
                            {{timeHandle(item.start, false, true)}} {{$t('至')}} {{timeHandle(item.end, false, true)}}
                        </template>
                        <template v-else>
                            {{$t('长期有效')}}
                        </template>
                    </span>
                    <span >{{$t('查看详情')}}>></span>
                </div>
            </li>
        </ul>
        <div class="nodata" v-if="discountList.length == 0 && finished">
            <div>
                <img src="@/assets/image/no_data2@2x.png">
                <p>{{$t('暂无优惠活动')}}</p>
            </div>
        </div>
    </div>
</template>
<script>
import { reactive, toRefs } from '@vue/reactivity'
import {timeHandle} from '@/utils'
import PageHeader from '@/components/PageHeader.vue'
import router from '@/router'
import { onMounted } from '@vue/runtime-core'
import {i18n} from '@/assets/lang'
import store from '@/vuex'

export default {
    components:{
        PageHeader
    },
    setup() {
        const state = reactive({
            discountList: [],
            listParam: {
                page: 1,
                limit: 20
            },
            total: 1,
            loading: false,
            finished: false,
        })

        // const simulate = () => {
        //     for(let i = 0;i< 10;i++){
        //         state.discountList.push({
        //             title: '迎新礼包',
        //             logo: '',
        //             details: '',
        //             start: new Date().getTime(),
        //             end: new Date().getTime(),
        //         })
        //     }
        // }
        // simulate()

        onMounted(() => {
            window.addEventListener('scroll', loadMore)
            onLoad()
        })

        const loadMore = () => {
            const scrollH = document.documentElement.scrollHeight
            const scrollTop = document.documentElement.scrollTop
            const clientH = document.documentElement.clientHeight
            if(scrollTop + clientH + 5 > scrollH){
                onLoad()
            }
        }

        const langMap = {
            'cn': 0, 'cn_tw': 1, 'en': 2, 'ko': 3, 'ja': 4, 'th': 5, 'vi': 6
        }
        const onLoad = () => {
            console.log('loading more')
            if(state.loading) return 
            if(state.finished) return
            state.loading = true

            store.dispatch('activity/getActivity', {lang: langMap[i18n.global.locale] } ).then(res => {
                // state.total = res.total

                Array.prototype.push.apply(state.discountList, res.list || [])

                state.loading = false
                // if(state.discountList.length >= state.total){
                    state.finished = true
                // }else{
                //     state.listParam.page++
                // }
            })
        }

        const checkDetail = (item) => {
            router.push({
                path: '/pageDiscountDetail',
                query: {
                    // item: {
                        ...item
                    // }
                }
            })
        }

        return {
            ...toRefs(state),
            timeHandle,
            checkDetail
        }
    },
}
</script>
<style lang="less" scoped>
.pageDiscount{
    background-color: #0F0E0F;padding-bottom: 144px;
    >ul{
        li{
            list-style: none;background-color: #222122;margin-bottom: 24px;
            .name{
                padding-left: 30px;height: 80px;line-height: 80px;color: #E0B55A;font-size: 28px;
                >span{
                    padding: 0 10px;height: 34px;min-width: 76px;
                    background-color: #00AC2B;border-radius: 4px;color: #FFFFFF;font-size: 24px;margin-right: 10px;
                }
                .new{
                    margin-left: 28px;
                }
                .hot{
                    background-color: #FF4300;
                }
            }
            .img_ct{
                margin: 0 28px;
                img{
                    width: 100%;
                    height: 260px;background-color: #D8D8D8;
                }
            }
            .info{
                height: 70px;line-height: 70px;padding: 0 30px;display: flex;align-items: center;justify-content: space-between;
                span{color: #838383;font-size: 24px;}
            }
        }
    }
    .nodata{
        padding-top: 377px;text-align: center;
        img{margin-bottom: 18px;width: 128px;}
        p{color: #666666;font-size: 28px;}
    }

    :deep{
        .left-arrow{display: none;}
    }
}
</style>