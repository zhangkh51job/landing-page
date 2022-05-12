import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'amfe-flexible/index.js'
import "./utils/pcRem"
import { Dialog, Popup, Swipe, SwipeItem, Toast, Button,/*, Tab, Tabs,ActionBar, ActionBarIcon, ActionBarButton, Divider, Overlay, Loading,  ContactCard, Form, AddressEdit, AddressList, Field, CellGroup, Cell, SwipeCell, Icon, Stepper, Card, Checkbox, CheckboxGroup,  PullRefresh, List,  SubmitBar,  Skeleton, Picker, ActionSheet*/ } from 'vant'
import 'vant/lib/index.css'; // 全局引入样式
import '@/assets/global.less'
import 'animate.css'
import {i18n} from './assets/lang'
import store from './vuex'
// import theme from './assets/theme'

import Global from "./utils/Global"
window.Global = Global
Global.setup();

const app = createApp(App)
import SvgIcon from '@/components/SvgIcon'// svg component
// import { useI18n } from "vue-i18n"
// app.config.globalProperties = useI18n
window.$$i18n = i18n
console.log('i18n', i18n)
import './components/icons'

app.use(Popup)
  // .use(ActionBarButton)
  // .use(ActionBarIcon)
  // .use(ActionBar)
  // .use(Divider)
  // .use(Overlay)
  // .use(Loading)
  .use(Dialog)
  .use(Toast)
  // .use(ContactCard)
  // .use(Form)
  // .use(AddressEdit)
  // .use(AddressList)
  // .use(Field)
  // .use(CellGroup)
  // .use(Cell)
  // .use(SwipeCell)
  // .use(Icon)
  // .use(Stepper)
  // .use(Card)
  .use(Button)
  .use(Swipe)
  .use(SwipeItem)
  // .use(PullRefresh)
  // .use(List)
  // .use(Tab)
  // .use(Tabs)
  // .use(SubmitBar)
  // .use(Checkbox)
  // .use(CheckboxGroup)
  // .use(Skeleton)
  // .use(Picker)
  // .use(ActionSheet)


// register globally
app.component('svg-icon', SvgIcon)

app.use(i18n).use(store)
app.use(router).mount('#app')


