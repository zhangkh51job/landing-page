<template>
    <div class="notice" v-show="notice.length">
        <i></i>
        <div class="content">
            <div class="cont">
                <span v-for="(item, i) in notice" :key="i">{{item}}</span>
            </div>
        </div>
    </div>
</template>
<script>
import store from '@/vuex'
import { computed, onMounted, onUnmounted, watch } from '@vue/runtime-core'

export default {
    setup() {
        const adjustNum =(num) => {
            if(num < 10) return '0'+num
            return num
        }
        console.log( 'new Date().getTimezoneOffset()', new Date().getTimezoneOffset()/60)
        const notice = computed(() => {
            const b = store.state.activity.marquee_list

            const result = []
            const time = new Date().getTime()
            const sjc = (new Date().getTimezoneOffset() + 8 * 60) * 60 * 1000
            const currTime = new Date(time - sjc)
            const currHm = adjustNum(currTime.getHours()) + ':' + adjustNum(currTime.getMinutes())

            b && b.forEach && b.forEach(element => {
                if(currHm >= element.day_start && currHm <= element.day_end){
                    result.push( element.content)
                }
            })

            return result
        })

        watch(notice, () => {
            setTimeout(() => startScroll(), 10)
        })


        console.log('compare', '08:79' > '08:00')
        let scrollId = null
        const startScroll = () => {
            if(!notice.value.length) {
                scrollId && window.clearInterval(scrollId)
                return
            }

            const ct = document.querySelector('.notice .content')
            const sn = document.querySelector('.notice .content>.cont')

            const ct_w = parseFloat(window.getComputedStyle(ct, null)['width'])
            const sn_w = parseFloat(window.getComputedStyle(sn, null)['width'])

            scrollId && window.clearInterval(scrollId)
            // if(sn_w > ct_w){
                sn.style['left'] = ct_w+'px'
                let total = 1
                scrollId = window.setInterval(() => {
                    if(ct_w - total < -sn_w){
                        sn.style['left'] = ct_w+'px'
                        total = 1
                    } else {
                        sn.style.left = (ct_w - total) + 'px'
                        total++
                    }
                }, 25)
            // }else {
            //     sn.style['left'] = '0px'
            // }
        }

        onUnmounted(() =>{
            scrollId && window.clearInterval(scrollId)
        })

        onMounted(() => {
            setTimeout(() => startScroll(), 10)
        })

        return {
            notice
        }
    },
}
</script>
<style lang="less" scoped>
.notice{
    display: flex;align-items: center;justify-content: space-between;
    background-color: #222122;height: 64px;padding: 0 20px;
    >i{
        display: inline-block;flex-shrink: 0;margin-right: 20px;
        width: 32px;height: 32px;
        background: url('@/assets/image/notice@2x.png') center center no-repeat;background-size: contain;
    }
    .content{
        position: relative;flex-grow: 1; height: 100%;
        display: flex;align-items: center; overflow: hidden;
        .cont{
            display: flex;position:absolute;
            span{
                color: #DADADA;font-size: 24px;display: block;white-space: nowrap;margin-right: 16px;
            }
        }
    }
}
</style>