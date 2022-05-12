<template>
    <div class="tab_comp" ref="cont">
        <div v-for="(item, i) in tabList" :key="i" class="gameListItem4" :class="{active: currActive == i}" @click="over4Click(item, i)">
            <div v-html="$t(getGameName(item.gid))"></div>
        </div>
    </div>
</template>
<script>
import { reactive, ref, toRefs } from '@vue/reactivity'
import { onMounted } from '@vue/runtime-core'
export default {
    props: {
	    tabList: Array // vue3中props的值必须声明才能使用
	},
    setup(props, {emit}) {
        const state = reactive({
            currActive: 0,
        })
        const cont = ref(null)


        console.log('tabList', props.tabList)
        const nameMap = {1001: '幸运哈希', 1002: '哈希牛牛', 1003: '哈希数字', 1004: '哈希百家乐'}
        const getGameName = (id) => {
            return nameMap[id]
        }

        const over4Click = (item, i) => {
            const dom = cont.value

            // currTabSwitch(item)
            state.currActive = i

            if(i + 1 == props.tabList.length) {
                i = i -1
            }
            let offset = (i+1) - 2
            offset = offset < 0?  0:offset
            
            if(offset >= 1){
                dom.style.left = -(1 * 20 + (offset - 1)* 30 ) + '%'
            }else {
                dom.style.left = '0%'
            }
            emit('itemClick', item)
        }


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
            

            const startFn = function (e) {
                // e.stopImmediatePropagation && e.stopImmediatePropagation()
                // e.stopPropagation && e.stopPropagation()
                // e.preventDefault()
                dragable = true;
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
                // e.stopImmediatePropagation && e.stopImmediatePropagation()
                // e.stopPropagation && e.stopPropagation()
                console.log('moveFn')
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
                dragable = false

                if(e.type == 'mouseup'){
                    const currL = getCss(drag, 'left')
                    console.log('mouseup', currL, domW)
                    drag.classList.add('customer_m')
                    setTimeout(() => {
                        if(currL > -(domW*0.37)){
                            drag.style.left = '-1.54667rem'
                        }else{
                            drag.style.left = '-13.216rem'
                        }
                        
                        setTimeout(() => {
                            drag.classList.remove('customer_m')
                        }, 1000)
                    }, 1)
                }
                
            }

            let moveNowY, moveNowX
            drag.addEventListener("touchstart", startFn)
            document.addEventListener("touchmove", moveFn)
            drag.addEventListener("touchend", endFn)

            drag.addEventListener("mousedown", startFn)
            document.addEventListener("mousemove", moveFn)
            document.addEventListener("mouseup", endFn)

        }

        onMounted(() => {
            false && dragBox(cont.value, cont.value.parentElement)
        })

        return {
            ...toRefs(state),
            // ...toRefs(props),
            cont,

            over4Click,
            getGameName
        }
    },
}
</script>
<style lang="less" scoped>
.tab_comp{
    position: relative;display: flex;transition:left .8s;left:0%;
    width: 100%;
    >div{
        display: flex;align-items:center;height: 88px;font-size: 36px;color: #7A663E;text-align: center;
        background-color: #222122;font-family: yiixnchongfenghao;font-weight: bold;line-height: 1;cursor: pointer;
    }
    .gameListItem4{width: 30%;justify-content: center;background-color: #222122;flex-shrink: 0;}
            
    .active{
        color: #E1B85D;background-color: #AB6D06;
    }
}
</style>