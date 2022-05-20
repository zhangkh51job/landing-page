import request from '@/net/request'

export default {
    namespaced: true,
    state: {
        userInfo: {},
    },
    mutations:{
        userInfo(state, data){
            state.userInfo = Object.assign(state.userInfo, data)
        }
    },
    actions:{
        getLotteryMapData(ctx, params){
            const data = {
                url: '/zh/api/bet',
                params: {
                    ...params
                },
            }
            return request(data)
        },
        
    }
}