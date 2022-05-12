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
        userLogin(ctx, params){
            const data = {
                url: '/api/login',
                params: {
                    ...params
                },
                callback:(res) => {
                    ctx.commit('userInfo', res);
                    localStorage.setItem('token', res.token)
                    localStorage.setItem('uid', res.uid)
                }
            }
            return request(data)
        },
        userRegister(ctx, params){
            const data = {
                url: '/api/register',
                params: {
                    ...params
                },
                callback:(res) => {
                    ctx.commit('userInfo', res);
                    localStorage.setItem('token', res.token)
                    localStorage.setItem('uid', res.uid)
                }
            }
            return request(data)
        },
        userInfo(ctx){
            const data = {
                url: '/api/userInfo',
                callback: (res) => {
                    ctx.commit('userInfo', res);
                }
            }
            return request(data)
        }
    }
}