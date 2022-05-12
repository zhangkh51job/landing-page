<template>
    <div class="discountDetail">
        <div class="head">
            <div class="name">
                    {{item.title}}
                    <span class="new" v-if="item.alert == 2">{{$t('新增')}}</span>
                    <span class="hot" v-if="item.alert == 1">{{$t('热门')}}</span>
            </div>
            <p class="time">
                {{$t('活动时间:')}}
                <template v-if="item.start && item.end && item.start < item.end">
                    {{timeHandle(item.start, false, true)}} {{$t('至')}} {{timeHandle(item.end, false, true)}}
                </template>
                <template v-else>
                    {{$t('长期有效')}}
                </template>
            </p>
        </div>
        <div class="content">
            <img :src="item.details">
            <p v-html="item.content"></p>
        </div>
    </div>
</template>
<script>
import { reactive, toRefs } from '@vue/reactivity'
import { useRoute } from 'vue-router'
import {timeHandle} from '@/utils'

export default {
    setup() {
        const route = useRoute()
        const item = route.query
        const state = reactive({
            item: item
        })

        return {
            ...toRefs(state),
            timeHandle
        }
    },
}
</script>
<style lang="less" scoped>
.discountDetail{
    padding: 24px;background-color: #0F0E0F;
    >.head{
        padding: 32px 30px;margin-bottom: 20px;
        background-color: #222122;border-radius: 12px;
        .name{
            color:#E0B55A;font-size: 30px;margin-bottom: 24px;
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
        .time{
            color: #838383;font-size: 24px;
        }
    }
    >.content{
        padding: 30px;background-color: #222122;border-radius: 12px;
        p{
            color: #fff;font-size: 24px;line-height: 1.8;
        }
    }
}
</style>