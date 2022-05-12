import {createI18n} from 'vue-i18n'
import { Locale  } from 'vant'
import cn from './language/zh-CN'
import en from './language/en-US'
import cn_tw from './language/zh-HK'
import ja from './language/ja-JP'
import ko from './language/ko-KR'
import th from './language/th-TH'
import vi from './language/vi-VN'

// Vue.use(VueI18n)
import enUS from 'vant/es/locale/lang/en-US';
import zhCN from 'vant/es/locale/lang/zh-CN';
import zhHK from 'vant/es/locale/lang/zh-HK';
import jaJP from 'vant/es/locale/lang/ja-JP';
import koKR from 'vant/es/locale/lang/ko-KR';
import thTH from 'vant/es/locale/lang/th-TH';
import viVN from 'vant/es/locale/lang/vi-VN';

const messages = {
	en: {
		...en.homeView
	},
	cn: {
		...cn.homeView
	},
	cn_tw: {
		...cn_tw.homeView
	},
	ja: {
		...ja.homeView
	},
	ko: {
		...ko.homeView
	},
	th: {
		...th.homeView
	},
	vi: {
		...vi.homeView
	}
}

let lang = localStorage.getItem('lang')
if(!lang){
	const ll = navigator.language
	lang = /en/.test(ll) ? 'en': /(zh-Hant|zh-TW|zh-HK|zh-MO)/.test(ll) ? 'cn_tw': /th/.test(ll)?'th': /ja/.test(ll)?'ja': /ko/.test(ll)?'ko':/vi/.test(ll)?'vi':'cn'
	localStorage.setItem('lang', lang)
}


// alert(/en-/.test(navigator.language) +'_' + lang)

const i18n = createI18n({
	locale: lang, // 设置默认语言
	messages // 设置资源文件对象
})
// 更新vant组件库本身的语言变化，支持国际化
function vantLocales(lang) {
	switch(lang){
		case 'en':
			Locale.use('en-US', enUS);
			break;
		case 'cn':
			Locale.use('zh-CN', zhCN);
			break;
		case 'cn_tw':
			Locale.use('zh-HK', zhHK);
			break;
		case 'ja':
			Locale.use('ja-JP', jaJP);
			break;
		case 'ko':
			Locale.use('ko-KR', koKR);
			break;
		case 'th':
			Locale.use('th-TH', thTH);
			break;
		case 'vi':
			Locale.use('vi-VN', viVN);
			break;
		default:
			Locale.use('en-US', enUS);
			break
	}
	i18n.global.locale = lang
	localStorage.setItem('lang', lang)
}
vantLocales(lang)

export {
	i18n,
	messages,
	vantLocales
}