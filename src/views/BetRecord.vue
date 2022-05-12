<template>
    <div class="betRecord">
        <PageHeader title="投注记录">
            <template #right>
                <span class="mapBtn" @click="$router.push('/betMap')">{{$t('路单图')}}</span>
            </template>
        </PageHeader>
        <!-- <ul>
            <li class="head">
                <span>{{$t('时间')}}</span>
                <span>{{$t('投注')}}</span>
                <span>{{$t('返奖')}}</span>
                <span>{{$t('中奖状态')}}</span>
            </li>
        </ul> -->
        <!-- status枚举
                        HashGameRewardTypeNormal       = 0 // 未计算
                        HashGameRewardTypeWin          = 1 // 玩家赢
                        HashGameRewardTypeLose         = 2 // 玩家输
                        HashGameRewardTypeInvalid      = 3 // 无效转账
                        HashGameRewardTypeReturn       = 4 // 金额退还
                        HashGameRewardTypeInvalidSmall = 5 // 转账金额小于限制
                        HashGameRewardTypeInvalidBig   = 6 // 转账金额大于于限制
                        HashGameRewardTypeRecharge     = 7 // 充值 -->
        <div class="list_ct">
            <ul>
                <li v-for="(item, i) in rebateList" :key="i">
                    <div class="top">
                        <div class="name"><i></i>
                            <label>{{item.gid && $t(getGameName(item.gid))}}</label>
                        </div>
                        <div>
                            <span>Block Hash： </span>
                            <span>{{item.simple_hash}}</span>
                        </div>
                        <div class="bet">
                            <span>
                                {{$t('投注')}}：{{item.bet/1000000}}
                            </span>
                            <span :style="{color:item.status == 1?'#11D97C':item.status == 2?'#D91111':'#DADADA' }">
                                {{$t('返奖')}}：{{item.hit/1000000}}
                            </span>
                        </div>
                        <div class="result">
                            <span>{{$t('结果')}}：</span>
                            <span :style="{color:item.status == 1?'#11D97C':item.status == 2?'#D91111':'#DADADA' }">
                                {{ $t(item.status == 0?'未计算' :item.status == 1? '中奖':item.status == 2?'未中奖':item.status == 3?
                                '无效转账':item.status == 4?'金额退还': item.status == 5?'转账金额小于限制':item.status == 6?'转账金额大于于限制':item.status == 7?'充值':'--') }}
                            </span>
                            <!-- <span :style="{color:item.status == 1?'#11D97C':item.status == 2?'#D91111':'#DADADA' }"> -->
                                <span v-if="item.gid == 1001" :style="{color:item.status == 1?'#11D97C':item.status == 2?'#D91111':'#DADADA' }">
                                    ( {{$t('玩家')}}:
                                    {{item.banco_type == 0?($t('数字')+' + '+$t('数字')):item.banco_type == 1?($t('字母')+' + '+$t('字母')):item.banco_type == 3?($t('数字')+' + '+$t('字母')): item.banco_type == 4?($t('字母')+' + '+$t('数字')): '' }} 
                                    )
                                </span>
                                <span v-if="item.gid == 1002" :style="{color:item.status == 1?'#11D97C':item.status == 2?'#D91111':'#DADADA' }">
                                    ( 
                                    {{$t('系统')}}:
                                    {{item.banco_type == 0?$t('牛牛'): ($t('牛')+' '+item.banco_type) }} 
                                    {{' | '}}
                                    {{$t('玩家')}}:
                                    {{item.player_type == 0?$t('牛牛'): ($t('牛')+' '+item.player_type) }} 
                                    )
                                </span>
                                <span v-if="item.gid == 1003" :style="{color:item.status == 1?'#11D97C':item.status == 2?'#D91111':'#DADADA' }">
                                    ( 
                                    {{$t('下注')}}:
                                    {{item.bet_type == 0?$t('无效投注'): item.bet_type == 1?$t('大'):item.bet_type == 2?$t('小'):item.bet_type == 3?$t('单'):item.bet_type == 4?$t('双'):'' }} 
                                    {{' | '}}
                                    {{$t('开奖')}}:
                                    {{item.banco_type == 0?$t('无效投注'): item.banco_type == 1?$t('大'):item.banco_type == 2?$t('小'):item.banco_type == 3?$t('单'):item.banco_type == 4?$t('双'):'' }} 
                                    )
                                </span>
                                <span v-if="item.gid == 1004" :style="{color:item.status == 1?'#11D97C':item.status == 2?'#D91111':'#DADADA' }">
                                    ( 
                                    {{$t('下注')}}:
                                    {{ item.bet_type == 0?$t('无效投注'): item.bet_type == 1?$t('庄'):item.bet_type == 2?$t('闲'):item.bet_type == 3?$t('和'):'' }}
                                    {{' | '}}
                                    {{$t('庄')}}:
                                    {{item.banco_type}}{{$t('点')}}
                                    {{' | '}}
                                    {{$t('闲')}}:
                                    {{item.player_type}}{{$t('点')}}
                                    )
                                </span>
                            <!-- </span> -->
                        </div>
                    </div>
                    <div class="bottom">
                        <span>{{$t('投注时间')}}：</span><span>{{timeHandle(item.ctime)}}</span>
                    </div>
                </li>
            </ul>
            <div v-if="rebateList.length == 0 && finished" class="nodata">
                    <img src="@/assets/image/no_data@2x.png">
                    <p>{{$t('暂无数据')}}</p>
            </div>
        </div>
    </div>
</template>
<script>
import { reactive, toRefs } from '@vue/reactivity'
import { onMounted, onUnmounted } from '@vue/runtime-core'
import store from '@/vuex'
import {timeHandle} from '@/utils'
import PageHeader from '@/components/PageHeader.vue'

export default {
    components:{
       PageHeader
   },
    setup() {
        const state = reactive({
            rebateList: [
                // {ctime: new Date().getTime(), bet: 123, hit: 7632.56,  status: 1, gid: 1001,
                //     simple_hash: 'aaa', bet_type: 1, banco_type: 0, player_type: 0},

                // {ctime: new Date().getTime(), bet: 123, hit: 0,        status: 0, gid: 1002,
                //     simple_hash: 'aaa', bet_type: 9, banco_type: 2, player_type: 2},

                // {ctime: new Date().getTime(), bet: 123, hit: 0,        status: 0, gid: 1003,
                //     simple_hash: 'aaa', bet_type: 2, banco_type: '', player_type: ''},

                // {ctime: new Date().getTime(), bet: 123, hit: 0,        status: 0, gid: 1004,
                //     simple_hash: 'aaa', bet_type: 3, banco_type: 12, player_type: 24}
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

        const nameMap = {1001: '幸运哈希', 1002: '哈希牛牛', 1003: '哈希数字', 1004: '哈希百家乐'}
        const getGameName = (gid) => {
            return nameMap[gid] 
        }

        const loadMore = () => {
            const scrollH = document.documentElement.scrollHeight
            const scrollTop = document.documentElement.scrollTop
            const clientH = document.documentElement.clientHeight
            if(scrollTop + clientH + 5 > scrollH){
                onLoad()
            }
        }

        const onLoad = () => {
            console.log('loading more')
            if(state.loading) return 
            if(state.finished) return
            state.loading = true

            store.dispatch('record/rebetRecord', state.listParam).then(res => {
                state.total = res.total
                // state.rebateList = res.list || []
                Array.prototype.push.apply(state.rebateList, res.list || [])
                state.loading = false
                if(state.rebateList.length >= state.total){
                    state.finished = true
                }else{
                    state.listParam.page++
                }
            })
        }

        return {
            ...toRefs(state),
            onLoad,
            timeHandle,
            getGameName
        }
    },
}
</script>
<style lang="less" scoped>
.betRecord{
    background-color: #0F0E0F;padding: 0px 0 24px;
    .head{
        background-color: #917B4C;font-weight: bold;height: 88px;flex-direction: row;align-items: center;
        display: flex;
        span{
            width: 20%;text-align: center;color:#DADADA;font-size: 24px;
            &:nth-child(1), &:nth-child(4){
                width: 30%;
            }
        }
    }
    .mapBtn{
        display: inline-block;background-color: #3F49FF;border-radius: 8px;height: 42px;padding: 0 25px;
        color: #FFFFFF;font-size: 24px;font-weight: bold;margin-right: 30px;white-space: nowrap;
        display:flex;align-items: center;cursor: pointer;position: absolute;right: 0rem;
    }
   
    .list_ct{
        overflow-y: scroll;padding-top: 24px;
        ul{
            margin: 0 24px;
            li{
                background-color: #1A1A1A;margin-bottom: 24px;
                border-radius: 16px;
                .top{
                    padding: 32px;border-bottom: 1px solid #666;
                    span{font-size: 24px;color:#DADADA;}
                    .result{
                        span{
                            &:nth-child(1){flex-shrink: 0;}
                            &:nth-child(2){flex-shrink: 0;}
                            &:nth-child(3){flex-shrink: 1;}
                        }
                    }
                    >div{
                        margin-bottom: 24px;&:nth-last-child(1){margin-bottom: 0; flex-wrap: wrap;}display: flex;
                    }
                    .name{
                        display: flex;align-items:center;margin-bottom: 32px;
                        >i{
                            display: inline-block;width: 6px;height: 28px;background-color: #FFCB61;margin-right: 10px;
                        }
                        label{font-size: 28px;color: #DADADA;font-weight: bold;}
                    }
                    .bet{
                        display:flex;justify-content: space-between;
                    }
                    
                }
                .bottom{
                    padding: 24px 32px;color: #757575;font-size: 20px;
                    span{
                        color: #757575;font-size: 20px;
                    }
                }
            }
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
<style>
html,body, #app{
    height: auto !important;
}
</style>