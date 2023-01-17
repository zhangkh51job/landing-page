<template>
    <div class="homeView">
        <div class="head">
            <img src="@/assets/others/lg_main@2x.png">
        </div>
        <div class="item-ct">
            <div class="item" v-for="(item, i) in itemList" :key="i">
                <div class="detail">
                    <div class="left">
                        <div class="title">
                            ID: {{item.ID}}
                        </div>
                        <div>昵称：{{item.nickname}}</div>
                        <div>类型：{{item.type}}</div>
                        <div>所在地区：{{item.location}}</div>
                        <div>服务项目：{{item.service}}</div>
                    </div>
                    <div class="right">
                        <img :src="require(item.head)"> 
                    </div>
                </div>
                <div class="data-ct">
                    <div>
                        <van-icon name="eye-o" /><span>{{item.watchNum}}</span>
                    </div>
                    <div>
                        <van-icon name="good-job-o" /><span>{{item.likeNum}}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {  reactive, ref, toRefs } from '@vue/reactivity'
export default {
    setup() {
        const state = reactive({
            itemList: [
                {
                    ID: '901**', nickname: '新鲜', type: '小清新/大学生/大长腿', location: '海南', service: '激活可见',
                    watchNum: Math.random() * 1000 << 0, likeNum: Math.random() * 1000 << 0, head: '@/assets/others/head/benifit_1.png'
                },
                {
                    ID: '901**', nickname: '新鲜', type: '小清新/大学生/大长腿', location: '海南', service: '激活可见',
                    watchNum: Math.random() * 1000 << 0, likeNum: Math.random() * 1000 << 0, head: '@/assets/others/head/benifit_1.png'
                },
                {
                    ID: '901**', nickname: '新鲜', type: '小清新/大学生/大长腿', location: '海南', service: '激活可见',
                    watchNum: Math.random() * 1000 << 0, likeNum: Math.random() * 1000 << 0, head: '@/assets/others/head/benifit_1.png'
                },
                {
                    ID: '901**', nickname: '新鲜', type: '小清新/大学生/大长腿', location: '海南', service: '激活可见',
                    watchNum: Math.random() * 1000 << 0, likeNum: Math.random() * 1000 << 0, head: '@/assets/others/head/benifit_1.png'
                },
                {
                    ID: '901**', nickname: '新鲜', type: '小清新/大学生/大长腿', location: '海南', service: '激活可见',
                    watchNum: Math.random() * 1000 << 0, likeNum: Math.random() * 1000 << 0, head: '@/assets/others/head/benifit_1.png'
                },
            ]
        })


        return {
            ...toRefs(state)
        }
    },
}
</script>