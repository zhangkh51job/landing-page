<template>
    <div class="commissionRecord">
        <PageHeader :title="$route.query.type==2?'流水返现':'佣金结算'"></PageHeader>
        <ul>
            <li class="head">
                <span>{{$t('申请时间')}}</span>
                <span>{{$t('结算金额')}}</span>
                <span>{{$t('结算状态')}}</span>
            </li>
            <li v-for="(item, i) in rebateList" :key="i">
                <div class="top">
                    <span>{{timeHandle(item.ctime)}}</span>
                    <span>{{item.commi/1000000}}</span>
                    <!-- 
                        status 状态枚举
                        UserCommitStatusNormal  = 0 // 未处理
                        UserCommitStatusProcess = 1 // 处理中
                        UserCommitStatusSuccess = 2 // 结算成功
                        UserCommitStatusFail    = 3 // 结算失败
                     -->
                    <span :style="{color:item.type == 1?'#11D97C':'#f00' }">
                        {{ $t(item.status == 0?'未处理' : item.status == 1?'处理中':item.status == 2?'结算成功':item.status == 3?'结算失败':'--') }}
                    </span>
                </div>
                <div class="bottom"></div>
            </li>
        </ul>
        <div v-if="rebateList.length == 0 && finished" class="nodata">
            <img src="@/assets/image/no_data@2x.png">
            <p>{{$t('暂无数据')}}</p>
        </div>
    </div>
</template>
<script>
import { reactive, toRefs } from '@vue/reactivity'
import { onMounted, onUnmounted } from '@vue/runtime-core'
import store from '@/vuex'
import { useRoute } from 'vue-router'
import PageHeader from "@/components/PageHeader.vue"
import {timeHandle} from '@/utils'

export default {
    components:{
        PageHeader
    },
    setup() {
        const state = reactive({
            rebateList: [
                // {ctime: '00:15:14', bet: 7632.56, hit: 0, status: 1},
            ],

            listParam: {
                page: 1,
                limit: 20
            },
            total: 1,
            loading: false,
            finished: false,
        })

        onMounted(()=>{
            window.addEventListener('scroll', loadMore)
            onLoad()
        })

        onUnmounted(() => {
            window.removeEventListener('scroll', loadMore)
        })

        const loadMore = () => {
            const scrollH = document.documentElement.scrollHeight
            const scrollTop = document.documentElement.scrollTop
            const clientH = document.documentElement.clientHeight
            if(scrollTop + clientH + 5 > scrollH){
                onLoad()
            }
        }

        const route = useRoute()
        const onLoad = () => {
            console.log('loading more')
            if(state.loading) return 
            if(state.finished) return
            state.loading = true

            store.dispatch(`record/${route.query.type==2?'flow_list':'commiRecord'}`, state.listParam).then(res => {
                Array.prototype.push.apply(state.rebateList, res.list || [])
                state.loading = false
                state.total = res.total
                if(state.rebateList.length >= state.total){
                    state.finished = true
                }else{
                    state.listParam.page++
                }
            })
        }

        return {
            ...toRefs(state),
            timeHandle
        }
    },
}
</script>
<style lang="less" scoped>
.commissionRecord{
    .head{
        background-color: #917B4C;font-weight: bold;height: 88px;flex-direction: row;align-items: center;
    }
    li{
        font-size: 24px;display: flex;flex-direction:column;
        .top{
            display: flex;height: 88px;align-items: center;
        }
        span{
            width: 33.33%;text-align: center;color:#DADADA;
        }
        .bottom{
            height: 1px;background: #FFFFFF;opacity: 0.2;
        }
    }
    .nodata{
        text-align: center;padding-top: 267px;
        img{
            width: 135px;height: 166px;margin-bottom: 40px;
        }
        p{color: #DADADA;font-size: 24px;}
    }
}
</style>