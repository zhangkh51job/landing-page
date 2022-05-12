import { createStore } from 'vuex'
import user from './user'
import record from './record'
import activity from './activity'
// 创建一个新的 store 实例
const store = createStore({
    state () {
    },
    mutations: {
    },
    modules:{
        user,
        record,
        activity
    }
})

export default store