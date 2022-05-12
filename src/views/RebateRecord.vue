<template>
    <div class="rebate">
        <ul>
            <li class="head">
                <span>申请时间</span>
                <span>计算金额</span>
                <span>计算状态</span>
            </li>
            <li v-for="(item, i) in rebateList" :key="i">
                <div class="top">
                    <span>{{item.time}}</span>
                    <span>{{item.amount}}</span>
                    <span :style="{color:item.type == 1?'#11D97C':'#f00' }">{{ item.type == 1?'结算成功' : '结算失败' }}</span>
                </div>
                <div class="bottom"></div>
            </li>
        </ul>
    </div>
</template>
<script>
import { reactive, toRefs } from '@vue/reactivity'
export default {
    setup() {
        const state = reactive({
            rebateList: [
                {time: '00:15:14', amount: 7632.56, type: 1},
                {time: '00:15:14', amount: 7632.56, type: 1},
                {time: '00:15:14', amount: 7632.56, type: 2},
                {time: '00:15:14', amount: 7632.56, type: 2},
            ]
        })

        return {
            ...toRefs(state)
        }
    },
}
</script>
<style lang="less" scoped>
.rebate{
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
}
</style>