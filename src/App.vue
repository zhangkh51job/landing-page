
<template>
  <!-- <div id="app"> -->
    <PageHeader v-if="hasHeader" :title="title"></PageHeader>
    <router-view :class="[hasHeader?'hasHeader': 'noHeader']"  v-slot="{ Component }">
      <transition :name="transitionName">
        <component :is="Component" />
      </transition>
    </router-view>
    <pendantComponent></pendantComponent>
    <PageFooter v-if="hasFooter"></PageFooter>
  <!-- </div> -->
</template>

<script>
import { reactive, toRefs, provide } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import PageHeader from '@/components/PageHeader.vue'
import PageFooter from '@/components/PageFooter.vue'
import store from '@/vuex'
import {  nextTick, onMounted, watch, watchEffect } from '@vue/runtime-core'
import { i18n } from '@/assets/lang'

import pendantComponent from '@/views/componets/PendantComponent.vue'

  export default {
    components: {
      PageHeader,
      PageFooter,
      pendantComponent
    },
    setup() {
      const router = useRouter()
      const route = useRoute()

      const state = reactive({
        transitionName: 'slide-left',
        hasHeader: route.meta.require_header,
        hasFooter: route.meta.require_footer,
        title: '',
      })

      router.beforeEach((to, from) => {
        if (to.meta.index > from.meta.index) {
          state.transitionName = 'slide-left' // 向左滑动
        } else if (to.meta.index < from.meta.index) {
          // 由次级到主级
          state.transitionName = 'slide-right'
        } else {
          state.transitionName = ''   // 同级无过渡效果
        }
        state.hasHeader = to.meta.require_header
        state.hasFooter = to.meta.require_footer
        state.title = to.meta.title || ''
      })

      watch(route, (val) => {
           if(!val.meta.no_require_auth && !store.state.user.userInfo.uid){
             store.dispatch('user/userInfo')
           }
      }, {deep: true})

      const langMap = {
        'cn': 0, 'cn_tw': 1, 'en': 2, 'ko': 3, 'ja': 4, 'th': 5, 'vi': 6
      }
      watchEffect(() => {
        store.dispatch('activity/getSetting', {
          lang: langMap[i18n.global.locale],
          general_id: Number(window.general_id)
        }).then((res) => {
          document.title = res.app_name
        })
      })

      const isPc = !window.navigator.userAgent.match(
        /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
      )
      provide('isPc', isPc)
      onMounted(() => {
        isPc && nextTick(() => {
          document.querySelector('#app').classList.add('isPc')
        })
      })

      return {
        ...toRefs(state)
      }
    }
  }
</script>
<style lang="less" scoped>
.hasHeader{
  min-height: calc(100vh - 88px);
  background-color: #0F0E0F;
}
.noHeader{
  min-height: 100vh;
  background-color: #0F0E0F;
}
.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active{
    height: 100%;
    will-change: transform;
    transition: all 500ms;
    position: absolute;
    backface-visibility: hidden;
}
.slide-right-enter{
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
}
.slide-right-leave-active{
    opacity: 0;
    transform: translate3d(100%, 0, 0);
}
.slide-left-enter{
    opacity: 0;
    transform: translate3d(100%, 0, 0);
}
.slide-left-leave-active{
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
}
</style>
<style lang="less">
.isPc{
	max-width: 1000px;
  position: relative;
  left: 50%;transform: translateX(-50%);
  // margin: auto;
	

  .noHeader{
    height: 100vh;
    overflow: scroll;
  }
  ::-webkit-scrollbar {
		display: none; /* Chrome Safari */
     width:0;
	}
	-ms-overflow-style: none; /* IE 10+ */
	scrollbar-width: none; /* Firefox */

	.van-popup, .van-overlay{
		max-width: 1000px;
		left: 50%;
		transform: translateX(-50%);
	}
	.van-popup--center{
		top: 50%;
		left: 50%;
		-webkit-transform: translate3d(-50%,-50%,0);
		transform: translate3d(-50%,-50%,0);
	}
}
</style>