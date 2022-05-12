<template>
    <div class="pendant" @touch.stop @mousemove.stop>
            <div class="item customer">
                <i></i>
                <!-- <p>{{$t('客服')}}</p> -->
            </div>
        </div>
</template>
<script>
import { onMounted, ref } from '@vue/runtime-core'
import { useRouter } from 'vue-router'

export default {
    setup() {

        const isActive = ref(false)
        const router = useRouter()

        const dragBox = function (drag, wrap) {
            function getCss(ele, prop) {
                    return parseFloat(window.getComputedStyle(ele)[prop]);
            }

            let initY, 
                startTop,
                initX,
                startLeft,
                dragable = false,
                dragH = getCss(drag, 'height'),
                wrapHeight = getCss(wrap, "height");

            let domW = getCss(document.querySelector('#app'), 'width')
            
            let downTime;

            const startFn = function (e) {
                e.stopImmediatePropagation && e.stopImmediatePropagation()
                e.stopPropagation && e.stopPropagation()
                e.preventDefault()
                isActive.value = true
                dragable = true;
                downTime = new Date().getTime()
                if(e.type == 'touchstart'){
                    initY = e.changedTouches[0].clientY;
                    initX = e.changedTouches[0].clientX
                } else {
                    initY = e.clientY
                    initX = e.clientX
                }

                startTop = getCss(drag, 'top')
                startLeft = getCss(drag, 'left')

                console.log('start', initY)
            }
            const moveFn = function (e) {
                e.stopImmediatePropagation && e.stopImmediatePropagation()
                e.stopPropagation && e.stopPropagation()

                    if (dragable === true ) {
                        if(e.type == 'touchmove'){
                            moveNowY = e.changedTouches[0].clientY
                            moveNowX = e.changedTouches[0].clientX
                        } else {
                            moveNowY = e.clientY
                            moveNowX = e.clientX
                        }

                        let disY = moveNowY - initY
                        console.log('disY', disY)
                        let nowY = startTop + disY 

                        if(nowY > wrapHeight - dragH && e.type == 'touchmove') nowY = wrapHeight - dragH
                        if(nowY < 0) nowY = 0
                        
                        drag.style.top = nowY + "px";
                        if(e.type == 'mousemove'){
                            let disX = moveNowX - initX
                            let nowX = startLeft + disX 
                            
                            drag.style.left = nowX+'px'
                        }
                    }
            }
            const endFn = function (e) {
                e.stopImmediatePropagation && e.stopImmediatePropagation()
                e.stopPropagation && e.stopPropagation()
                e.preventDefault()
                isActive.value = false
                dragable = false

                if(e.type == 'mouseup'){
                    const currL = getCss(drag, 'left')
                    console.log('mouseup', currL, domW)
                    drag.classList.add('customer_m')
                    setTimeout(() => {
                        // if(currL > -(domW*0.37)){
                            drag.style.left = '-2.70667rem'
                        // }else{
                        //     drag.style.left = '-0.216rem'
                        // }
                        
                        setTimeout(() => {
                            drag.classList.remove('customer_m')
                        }, 1000)
                    }, 1)
                }

                if(new Date().getTime() - downTime < 400){
                    router.push('/pageCustomer')
                }
            }

            let moveNowY, moveNowX
            drag.addEventListener("touchstart", startFn, false)
            document.addEventListener("touchmove", moveFn)
            drag.addEventListener("touchend", endFn, false)

            drag.addEventListener("mousedown", startFn, false)
            document.addEventListener("mousemove", moveFn)
            document.addEventListener("mouseup", endFn, false)

        }
        
        onMounted(() => {
            dragBox(document.querySelector('.pendant .customer'), document.querySelector('.pendant'))
        })

        return {
            isActive
        }
    },
}
</script>
<style lang="less" scoped>
.pendant{
    position: fixed;z-index: 10;
    width: 0px;height: calc(100vh - 206px);top: 88px;right:0;background-color:rgba(0,0,0,0);
    width: 0px;background-color: #ff0000;
    .item{
        cursor: pointer;
    }
    .customer{
        position: absolute;bottom: 118px;left: -200px;
            width: 189px;height:106px;
            // background-color: #AB6D06;border-radius: 50%;
            display:flex;align-items: center;justify-content: center;flex-direction: column;
            i{
                display:inline-block;width: 189px;height: 104px;background: url("@/assets/image/chat@2x.png") center center no-repeat;
                background-size: contain;
            }
            p{
                font-size:24px;color: #F9D88E; white-space: nowrap;
            }
    }
    .customer_m{
        transition: all .85s;
    }
}
.isActive{
    width: 110px;background-color:#ff0000;
}
</style>