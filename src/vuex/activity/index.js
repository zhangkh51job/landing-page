import request from '@/net/request'

export default {
    namespaced: true,
    state: {
        marquee_list: {},
        carouse_list: {}, // 公告图
        pop_tip_list: {}, // 注册弹窗
        logo_url: '',
    },
    mutations:{
        setNotice(state, marquee_list){
            state.marquee_list = marquee_list
        },
        set_carouse_list(state, carouse_list){
            carouse_list && carouse_list.sort((item1, item2)=>{
                return item1.sort - item2.sort
            })
            state.carouse_list = carouse_list
        },
        set_pop_tip_list(state, pop_tip_list){
            const obj = {}
            pop_tip_list = pop_tip_list[0] || pop_tip_list
            obj.title = pop_tip_list.title
            obj.list = pop_tip_list.content.split('\n')
            console.log('store.state.activity.pop_tip_list0', obj.title)
            state.pop_tip_list = obj
        },
        set_logo_url(state, logo_url){
            state.logo_url = logo_url
        },
        
    },
    actions:{
        getActivity(ctx, params){
            const data = {
                url: '/api/activity',
                params: {
                    ...params
                },
            }
            return request(data)
        },
        getSetting(ctx, params){
            const data = {
                url: '/api/getsetting',
                params: {
                    ...params
                },
                callback: (res) => {
                    ctx.commit('setNotice',         res.marquee_list)
                    ctx.commit('set_carouse_list',  res.carouse_list)
                    ctx.commit('set_pop_tip_list',  res.pop_tip_list)
                    ctx.commit('set_logo_url',      res.logo_url)
                }
            }
            return request(data)
        }
    }
}