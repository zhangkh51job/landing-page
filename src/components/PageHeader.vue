<template>
    <div class="page-header">
        <div class="left-arrow"  @click="clickHandle"><i></i></div>
        <h1>{{$t(title)}}</h1>
        <slot name="right"></slot>
    </div>
</template>
<script>
import router from '@/router'
import { toRefs } from '@vue/reactivity'
export default {
     props:{
        title:{
            type: String,
            default(){
                return '标题'
            }
        },
        backFn:{
            type: Function
        }
    },
    setup(props) {
        const clickHandle = () => {
            if(props.backFn){
                props.backFn.call()
            }else {
                router.go(-1)
            }
        }

        return {
            ...toRefs({}),
            clickHandle,
        }
    },
}
</script>
<style lang="less" scoped>
.page-header{
    background-color: #1F1F1F;;position:relative;height: 88px;
    display: flex;align-items:center;text-align:center;
    .left-arrow{
        position: absolute;top: 50%;transform: translateY(-50%);left: 0px;height: 88px;width: 87px;justify-content: center;
        display: flex;align-items:center;background-color: rgba(0,0,0,0);
        i{
            width: 23px;height: 40px;display: inline-block;
            background: url('@/assets/image/page/footer/left_arrow@2x.png') center center no-repeat; background-size: contain;
        }
    }
    h1{
        font-size: 32px;color:#fff;width: 100%;font-size: 32px;
    }
}
</style>