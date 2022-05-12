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
        rebetRecord(ctx, params){ // 流水记录
            const data = {
                url: '/api/record',
                params: {
                    ...params
                },
            }
            return request(data)
        },

        commiRecord(ctx, params){ // 代理佣金记录
            const data = {
                url: '/api/commi_list',
                params: {
                    ...params
                },
            }
            return request(data)
        },

        commiInfo(ctx, params){ // 代理佣金信息
            const data = {
                url: '/api/commi_info',
                params: {
                    ...params
                },
            }
            return request(data)
        },

        doSettle(ctx, params){ // 结算代理佣金
            const data = {
                url: '/api/do_settle',
                params: {
                    ...params
                },
            }
            return request(data)
        },

        flowInfo(ctx, params){ // 结算代理佣金
            const data = {
                url: '/api/flow_info',
                params: {
                    ...params
                },
            }
            return request(data)
        },

        do_settle_flow(ctx, params){ // 结算流水返利
            const data = {
                url: '/api/do_settle_flow',
                params: {
                    ...params
                },
            }
            return request(data)
        },

        flow_list(ctx, params){ // 结算流水返利
            const data = {
                url: '/api/flow_list',
                params: {
                    ...params
                },
            }
            return request(data)
        },

        GameRecordHis(ctx, params){ // 录单图走势图记录
            const data = {
                url: '/api/game_record_his',
                params: {
                    ...params
                },
            }
            return request(data)
        }
    }
}