<template>
	<div class="imgPage">
		<!-- <img :src="require(`@/assets/link_page/${lang}/token_im.jpg`)" v-if="src == 'token_im'" />
		<img :src="require(`@/assets/link_page/${lang}/trustwallet_com.jpg`)" v-if="src == 'trustwallet_com'" />
		<img :src="require(`@/assets/link_page/${lang}/ownbit_io.jpg`)" v-if="src == 'ownbit_io'" />
		<img :src="require(`@/assets/link_page/${lang}/trolink_org.jpg`)" v-if="src == 'trolink_org'" />
		<img :src="require(`@/assets/link_page/${lang}/bitpie_com.jpg`)" v-if="src == 'bitpie_com'" />
		<img :src="require(`@/assets/link_page/${lang}/360usdt_com.jpg`)" v-if="src == '360usdt_com'" />
		<img :src="require(`@/assets/link_page/${lang}/huobi_com.jpg`)"   v-if="src == 'huobi_com'">
        <img :src="require(`@/assets/link_page/${lang}/gate_io.jpg`)"   v-if="src == 'gate_io'"> -->
		<img :src="require(`@/assets/link_page/${lang}/${src}.jpg`)">
	</div>
</template>
<script>
import { useRoute } from 'vue-router';
import { onBeforeMount, ref, reactive, toRefs } from 'vue';
export default {
	setup() {
		const route = useRoute();

		const src = ref('');
		const state = reactive({
			lang: route.query.lang || localStorage.getItem('lang') || 'cn',
		})

		if(state.lang == 'vi' || state.lang == 'th' || state.lang == 'ko' || state.lang == 'ja'){
			state.lang = 'en'
		}

		onBeforeMount(() => {
			src.value = /*'../assets/link_page' +*/ route.query.name; /*+ '.jpg'*/
		})

		return {
			...toRefs(state),
			src,
		};
	},
};
</script>
<style lang="less" scoped>
.imgPage {
	img {
		width: 100%;
		height: auto;
	}
}
</style>
