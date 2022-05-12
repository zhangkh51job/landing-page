<template>
    <div class="betMap">
        <div class="tabs">
            <div class="tab" v-for="(item,i) in tabList" :key="i" @click="switchItem(item)" :class="{active: currTab && currTab.gid == item.gid}">
                <span>{{$t(item.name)}}</span>
                <span class="bottom" :style="{visibility: currTab && currTab.gid == item.gid?'visible': 'hidden'}"></span>
            </div>
        </div>
        <!-- 幸运Hash -->
        <div class="block" v-if="currTab.gid == 1001">
            <div class="head">
                <div>
                    <label>{{$t('输')}}：</label><i class="lose"></i>
                </div>
                <div>
                    <label>{{$t('赢')}}：</label><i class="win"></i>
                </div>
            </div>
            <div class="content">
                <div v-for="(item, i) in luckHash" :key="i" class="col">
                    <div v-for="j in maxRow"           :key="j" class="row_item">
                        <i class="item2" :class="item && item[j-1].status == 1?'win':'lose'" v-if="item && item[j-1]" :data-ctime="item[j-1].ctime">
                            <!-- {{item[j-1].status}} -->
                        </i>
                    </div>
                </div>
            </div>
        </div>

        <!-- 哈希牛牛 -->
        <div class="block" v-if="currTab.gid == 1002">
            <div class="head">
                <div>
                    <label>{{$t('输')}}：</label><i class="lose"></i>
                </div>
                <div>
                    <label>{{$t('赢')}}：</label><i class="win"></i>
                </div>
            </div>
            <div class="content">
                <div v-for="(item, i) in hashNiu" :key="i" class="col">
                    <div v-for="j in maxRow"           :key="j" class="row_item">
                        <i class="item2" :class="item && item[j-1].status == 1?'win':'lose'" v-if="item && item[j-1]">
                            <!-- {{item[j-1].status}} -->
                        </i>
                    </div>
                </div>
            </div>
        </div>

        <!-- 哈希数字 -->
        <div class="block" v-if="currTab.gid == 1003">
            <div class="head head3">
                <div class="top">
                    <span :class="{active: curr3Sub == 0}" @click="curr3Sub = 0">{{$t('单双')}}</span>
                    <span :class="{active: curr3Sub == 1}" @click="curr3Sub = 1">{{$t('大小')}}</span>
                </div>
                <div class="bottom">
                    <div>
                        <label>{{ $t(curr3Sub == 0?'单':'大') }}：</label><i class="lose"></i>
                    </div>
                    <div>
                        <label>{{ $t(curr3Sub == 0?'双':'小') }}：</label><i class="win"></i>
                    </div>
                </div>
            </div>
            <div class="content">
                <div v-for="(item, i) in (curr3Sub == 0? hashNumberDX: hashNumberDS )" :key="i" class="col">
                    <div v-for="j in maxRow"           :key="j" class="row_item">
                        <i class="item2" :class="item && (item[j-1].bet_type == 1 || item[j-1].bet_type == 3)?'win':'lose'" v-if="item && item[j-1]">
                            <!-- {{item[j-1].status}} -->
                        </i>
                    </div>
                </div>
            </div>
        </div>

        <!-- 幸运庄闲 -->
        <div class="block" v-if="currTab.gid == 1004">
            <div class="head">
                <div>
                    <label>{{$t('闲')}}：</label><i class="lose"></i>
                </div>
                <div>
                    <label>{{$t('和')}}：</label><i class="draw"></i>
                </div>
                <div>
                    <label>{{$t('庄')}}：</label><i class="win"></i>
                </div>
            </div>
            <div class="content_ct">
                <div class="content">
                    <div v-for="(item, i) in hashBJL" :key="i" class="col">
                        <div v-for="j in maxRow"           :key="j" class="row_item">
                            <i class="item2" :class="item && item[j-1].bet_type == 1?'win':item[j-1].bet_type == 2?'draw':item[j-1].bet_type == 3?'lose':''" v-if="item && item[j-1]">
                                <!-- {{item[j-1].bet_type}} -->
                            </i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { reactive, toRefs } from '@vue/reactivity'
import store from '@/vuex'
import { watch } from '@vue/runtime-core'
export default {
    setup() {
        const state = reactive({
            tabList: [{gid:1001, name:'幸运哈希'}, {gid:1002, name:'哈希牛牛'}, {gid: 1003, name:'哈希数字'}, {gid:1004, name: '哈希百家乐'}],
            currTab: {gid:1001, name:'幸运哈希'},

            curr3Sub: 0,

            luckHash: [],
            hashNiu: [],
            hashNumberDX: [],
            hashNumberDS: [],

            hashBJL: [],
            maxRow: 6,
        })

        const testData = [{"ctime":1649915905,"bet":2000000,"hit":3900000,"status":1,"simple_hash":"00000*****1ea0e","bet_type":0,"banco_type":1,"player_type":10,"gid":1002},{"ctime":1649877450,"bet":1000000,"hit":100000,"status":2,"simple_hash":"00000*****9bee6","bet_type":0,"banco_type":9,"player_type":6,"gid":1002},{"ctime":1649874196,"bet":1000000,"hit":100000,"status":2,"simple_hash":"00000*****18f8b","bet_type":0,"banco_type":9,"player_type":8,"gid":1002},{"ctime":1649873756,"bet":3000000,"hit":3850000,"status":1,"simple_hash":"00000*****3c931","bet_type":0,"banco_type":2,"player_type":3,"gid":1002},{"ctime":1649873691,"bet":3000000,"hit":5560000,"status":1,"simple_hash":"00000*****113c6","bet_type":0,"banco_type":5,"player_type":9,"gid":1002},{"ctime":1649873576,"bet":3000000,"hit":5560000,"status":1,"simple_hash":"00000*****9a72b","bet_type":0,"banco_type":6,"player_type":9,"gid":1002},{"ctime":1649873396,"bet":3000000,"hit":300000,"status":2,"simple_hash":"00000*****d72e4","bet_type":0,"banco_type":9,"player_type":6,"gid":1002},{"ctime":1649872871,"bet":1000000,"hit":300000,"status":2,"simple_hash":"00000*****f168c","bet_type":0,"banco_type":7,"player_type":4,"gid":1002},{"ctime":1649869226,"bet":1000000,"hit":1850000,"status":1,"simple_hash":"00000*****8b81c","bet_type":0,"banco_type":6,"player_type":9,"gid":1002},{"ctime":1649857545,"bet":1000000,"hit":1660000,"status":1,"simple_hash":"00000*****3361d","bet_type":0,"banco_type":2,"player_type":7,"gid":1002},{"ctime":1649857500,"bet":1000000,"hit":0,"status":2,"simple_hash":"00000*****77","bet_type":0,"banco_type":0,"player_type":0,"gid":1001},{"ctime":1649857470,"bet":1000000,"hit":0,"status":2,"simple_hash":"00000*****16","bet_type":0,"banco_type":0,"player_type":0,"gid":1001},{"ctime":1649857445,"bet":1000000,"hit":0,"status":2,"simple_hash":"00000*****90","bet_type":0,"banco_type":0,"player_type":0,"gid":1001},{"ctime":1649856945,"bet":1000000,"hit":2000000,"status":1,"simple_hash":"00000*****c5","bet_type":0,"banco_type":4,"player_type":0,"gid":1001},{"ctime":1649856870,"bet":1000000,"hit":0,"status":2,"simple_hash":"00000*****82","bet_type":0,"banco_type":0,"player_type":0,"gid":1001},{"ctime":1649856840,"bet":1000000,"hit":0,"status":2,"simple_hash":"00000*****26","bet_type":0,"banco_type":0,"player_type":0,"gid":1001},{"ctime":1649856800,"bet":1000000,"hit":0,"status":2,"simple_hash":"00000*****81","bet_type":0,"banco_type":0,"player_type":0,"gid":1001},{"ctime":1649856775,"bet":1000000,"hit":0,"status":2,"simple_hash":"00000*****ad","bet_type":0,"banco_type":1,"player_type":0,"gid":1001},{"ctime":1649856745,"bet":1000000,"hit":0,"status":2,"simple_hash":"00000*****76","bet_type":0,"banco_type":0,"player_type":0,"gid":1001},{"ctime":1649856715,"bet":1000000,"hit":0,"status":2,"simple_hash":"00000*****64","bet_type":0,"banco_type":0,"player_type":0,"gid":1001},
        
        {"ctime":1649856670,"bet":1000000,"hit":0,"status":2,"simple_hash":"00000*****58","bet_type":0,"banco_type":0,"player_type":0,"gid":1001},{"ctime":1649848581,"bet":1000000,"hit":1950000,"status":1,"simple_hash":"00000*****9ab57","bet_type":1,"banco_type":9,"player_type":2,"gid":1004},{"ctime":1649848411,"bet":1000000,"hit":1950000,"status":1,"simple_hash":"00000*****61b96","bet_type":1,"banco_type":7,"player_type":5,"gid":1004},{"ctime":1649848281,"bet":1000000,"hit":1950000,"status":1,"simple_hash":"00000*****d7386","bet_type":1,"banco_type":7,"player_type":4,"gid":1004},{"ctime":1649848251,"bet":1000000,"hit":0,"status":2,"simple_hash":"00000*****4bd63","bet_type":1,"banco_type":4,"player_type":9,"gid":1004},{"ctime":1649848211,"bet":2000000,"hit":0,"status":2,"simple_hash":"00000*****68756","bet_type":2,"banco_type":4,"player_type":1,"gid":1004},{"ctime":1649841896,"bet":2000000,"hit":3900000,"status":1,"simple_hash":"00000*****ff462","bet_type":2,"banco_type":0,"player_type":8,"gid":1004},{"ctime":1649693585,"bet":5000000,"hit":4990000,"status":4,"simple_hash":"00000*****39741","bet_type":0,"banco_type":2,"player_type":5,"gid":1004},{"ctime":1649693570,"bet":1000000,"hit":0,"status":2,"simple_hash":"00000*****2a45f","bet_type":1,"banco_type":2,"player_type":5,"gid":1004},{"ctime":1649692918,"bet":5000000,"hit":4990000,"status":6,"simple_hash":"00000*****f98dc","bet_type":0,"banco_type":9,"player_type":0,"gid":1004},{"ctime":1649692204,"bet":5000000,"hit":4990000,"status":4,"simple_hash":"00000*****69d03","bet_type":0,"banco_type":5,"player_type":3,"gid":1004},{"ctime":1649673329,"bet":1000000,"hit":1950000,"status":1,"simple_hash":"00000*****2f21b","bet_type":1,"banco_type":2,"player_type":1,"gid":1004},{"ctime":1649667481,"bet":1000000,"hit":1950000,"status":1,"simple_hash":"00000*****9e196","bet_type":1,"banco_type":9,"player_type":5,"gid":1004},{"ctime":1649667436,"bet":1000000,"hit":1950000,"status":1,"simple_hash":"00000*****9b955","bet_type":1,"banco_type":9,"player_type":0,"gid":1004},{"ctime":1649667106,"bet":1000000,"hit":0,"status":2,"simple_hash":"00000*****ecf56","bet_type":1,"banco_type":0,"player_type":1,"gid":1004},{"ctime":1649667052,"bet":1000000,"hit":1950000,"status":1,"simple_hash":"00000*****9b26d","bet_type":1,"banco_type":9,"player_type":6,"gid":1004},{"ctime":1649667020,"bet":1000000,"hit":0,"status":2,"simple_hash":"00000*****1e170","bet_type":1,"banco_type":1,"player_type":7,"gid":1004},{"ctime":1649483648,"bet":1000000,"hit":0,"status":2,"simple_hash":"00000*****cad3d","bet_type":1,"banco_type":0,"player_type":3,"gid":1004},{"ctime":1649483607,"bet":1000000,"hit":0,"status":2,"simple_hash":"00000*****729e08","bet_type":3,"banco_type":4,"player_type":0,"gid":1003},{"ctime":1649483573,"bet":1000000,"hit":400000,"status":2,"simple_hash":"00000*****b3393","bet_type":0,"banco_type":6,"player_type":5,"gid":1002},

        {"ctime":1649253082,"bet":10000000,"hit":0,"status":2,"simple_hash":"","bet_type":0,"banco_type":0,"player_type":0,"gid":1003},{"ctime":1649253082,"bet":10000000,"hit":0,"status":2,"simple_hash":"","bet_type":0,"banco_type":0,"player_type":0,"gid":1003},{"ctime":1649253082,"bet":10000000,"hit":0,"status":2,"simple_hash":"","bet_type":0,"banco_type":0,"player_type":0,"gid":1003},{"ctime":1649253082,"bet":10000000,"hit":0,"status":2,"simple_hash":"","bet_type":0,"banco_type":0,"player_type":0,"gid":1003},{"ctime":1649253082,"bet":10000000,"hit":0,"status":2,"simple_hash":"","bet_type":0,"banco_type":0,"player_type":0,"gid":1003}
        ]
        const parseResult = () => {
            let luckHash = [], hashNiu = [], 
            hashNumberDX = [],  
            hashNumberDS = [],  
            hashBJL = [];
            testData.forEach((item) => {
                if(item.gid == 1001){
                    if(item.status == 1 || item.status == 2){
                        luckHash.push(item)
                    }
                }else if(item.gid == 1002){
                    if(item.status == 1 || item.status == 2){
                        hashNiu.push(item)
                    }
                }else if(item.gid == 1003){
                    if(item.bet_type == 1 || item.bet_type == 2){
                        hashNumberDX.push(item)
                    } else if( item.bet_type == 3 || item.bet_type == 4){
                        hashNumberDS.push(item)
                    }
                }else if(item.gid == 1004){
                    if(item.bet_type == 1 || item.bet_type == 2 || item.bet_type == 3){
                        hashBJL.push(item)
                    }
                }
            })
            parseArr(luckHash, 'status', 'luckHash')
            parseArr(hashNiu, 'status', 'hashNiu')
            parseArr(hashNumberDX, 'bet_type', 'hashNumberDX')
            parseArr(hashNumberDS, 'bet_type', 'hashNumberDS')
            parseArr(hashBJL, 'bet_type', 'hashBJL')
        }
        false && parseResult()
        // test
            // if(false && repl == 'luckHash'){
            //     arr = arr.concat( arr.slice( 5, 10))
            //     let arr2 = []
            //     for(let n = 0;n < 8;n++){
            //         arr2.push(arr[0])
            //     }
            //     for(let n = 0;n < 8;n++){
            //         arr2.push(arr[3])
            //     }
            //     for(let n = 0;n < 8;n++){
            //         arr2.push(arr[0])
            //     }
            //     for(let n = 0;n < 5;n++){
            //         arr2.push(arr[3])
            //     }
            //     arr2.push(arr[0])
            //     arr2.push(arr[3])

            //     for(let n = 0;n < 2;n++){
            //         arr2.push(arr[0])
            //     }
            //     arr2.push(arr[3])
            //     arr2.push(arr[0])
            //     arr2.push(arr[3])
            //     for(let n = 0;n < 8;n++){
            //         arr2.push(arr[0])
            //     }
            //     for(let n = 0;n < 8;n++){
            //         arr2.push(arr[3])
            //     }
            //     for(let n = 0;n < 5;n++){
            //         arr2.push(arr[0])
            //     }
            //     arr2.push(arr[3])
            //     arr2.push(arr[0])
            //     for(let n = 0;n < 8;n++){
            //         arr2.push(arr[3])
            //     }

            //     arr = arr2
            // }


        watch(() => state.currTab, (val) => {
            if(!val) return
            store.dispatch('record/GameRecordHis', 
                {page: 1, limit: state.currTab.gid == 1003 ? 200:100, gid: val.gid}).then(res => {
                    // console.log('GameRecordHis', res)
                    res.list && res.list.sort((item1, item2) => {
                        return item1.ctime - item2.ctime
                    })
                    if(val.gid == 1001){
                        const arr = res.list && res.list.filter((item) => item.status == 1 || item.status == 2) || []
                        parseArr(arr, 'status', 'luckHash')
                    } else if(val.gid == 1002){
                        const arr = res.list && res.list.filter((item) => item.status == 1 || item.status == 2) || []
                         parseArr(arr, 'status', 'hashNiu')
                    } else if(val.gid == 1003){
                        const hashNumberDX = [], hashNumberDS = []
                        res.list && res.list.forEach((item) => {
                            if(item.bet_type == 1   || item.bet_type == 2){
                                hashNumberDX.push(item)
                            } else if( item.bet_type == 3 || item.bet_type == 4){
                                hashNumberDS.push(item)
                            }
                        })
                        parseArr(hashNumberDX, 'banco_type', 'hashNumberDX')
                        parseArr(hashNumberDS, 'banco_type', 'hashNumberDS')
                    } else if(val.gid == 1004){
                        const arr = res.list && res.list.filter((item) => item.bet_type != 0) || []
                        parseArr(arr, 'bet_type', 'hashBJL')
                    }
            })
        })
        setTimeout(() => state.currTab = state.tabList[0], 1)

        const parseArr = (arr, cond, repl) => {
            let res = [], index = 0, currRow = 0, subIndex = 0, overlay = 0, isStart = true;

            for(let i =0;i< arr.length;){
                res[currRow] = res[currRow] || []
                if(!arr[i]){
                    console.log('aaa')
                }
                if( isStart || arr[i][cond] == arr[i - 1][cond] ) {

                    isStart = false

                    if(index < state.maxRow && !res[currRow][subIndex] ){
                        res[currRow][subIndex] = (arr[i])
                        index++
                        subIndex++
                    }else{
                        // currRow++
                        overlay++
                        res[currRow + overlay] = res[currRow + overlay] || []
                        
                        if( res[currRow + overlay -1][index - 1] && res[currRow + overlay -1][index - 1][cond] ==  arr[i][cond]){
                            res[currRow + overlay][index - 1] = arr[i]
                        }else{
                            index = index - 1
                            res[currRow + overlay][index - 1] = arr[i]
                        }

                        // res[currRow + overlay][index - 1] = arr[i]
                        subIndex = 0
                    }
                }else{
                    currRow++
                    overlay = 0
                    res[currRow] = res[currRow] || []
                    // subIndex = getSubIndex(res[currRow])

                    subIndex = 0 
                    index = 0
                    isStart = true
                    continue
                }
                i++;
            }
            // res = res.concat(res)
            console.log('幸运hash', res)

            res.length = res.length + 2
            if(res.length < 11){
                res.length = 11
            }

            state[repl] = res
        }
        

        const switchItem = (item) => {
            state.currTab = item
        }


        return {
            ...toRefs(state),
            switchItem,

        }
    },
}
</script>
<style lang="less" scoped>
.betMap{
    .tabs{
        height: 88px;background-color: #917B4C;padding: 0 30px;
        display: flex;align-items: center;justify-content: space-between;
        .tab{
            display: flex;flex-direction: column;align-items: center;justify-content: center;
            span{
                font-size: 24px;color: #FFFFFF;
            }
            .bottom{
                margin-top: 9px;width: 60px;height: 6px;background-color: #FFFFFF;border-radius: 3px;
                display: inline-block;
            }
        }
        .active{
            span{
                font-size: 28px;;
            }
        }
    }
    .block{
        margin: 0 20px;
        .head{
            display: flex;align-items: center;justify-content: space-around;padding: 30px 20px;
            >div{display: flex;align-items: center;}
            label{
                font-size: 28px;color: #FFFFFF;margin-right: 8px;
            }
            i{
                display: inline-block;width: 24px;height: 24px;
            }
            .lose{
                background: url('@/assets/image/lose@2x.png');background-size: contain;
            }
            .win{
                background: url('@/assets/image/win@2x.png');background-size: contain;
            }
            .draw{
                background: url('@/assets/image/draw@2x.png');background-size: contain;
            }
        }
        .head3{
            flex-direction: column;
            .top{
                width: 100%;justify-content: center;
                span{
                    color:#fff;font-size: 24px;padding-bottom: 10px;border-bottom: 6px solid transparent;
                    &:nth-child(1){margin-right: 148px;}
                }
                .active{
                    border-bottom: 6px solid #fff;font-size: 28px;font-weight: bold;
                }
            }
            .bottom{
                 display: flex;align-items: center;justify-content: space-around;padding: 30px 20px; width: 100%;
            }
        }
        .content{
            background-color: #fff;display:flex;transition: all 0.8s;
            .col{
                border: 1px solid #E5E5E5;border-right: transparent;
                &:nth-last-child(1){
                    border-right: 1px solid #E5E5E5;
                }
                .row_item{
                    border-bottom: 1px solid #E5E5E5;
                    display: flex;align-items:center;justify-content:center;
                    width: 88px;height: 88px;
                    &:nth-last-child(1){
                        border-bottom: transparent;
                    }
                }
                .item2{
                     display: inline-block;width: 40px;height: 40px;
                }
                .lose{
                    background: url('@/assets/image/lose@2x.png') no-repeat;background-size: contain;
                }
                .win{
                    background: url('@/assets/image/win@2x.png') no-repeat;background-size: contain;
                }
                .draw{
                    background: url('@/assets/image/draw@2x.png') no-repeat;background-size: contain;
                }
            }
        }

        .content {
            overflow-y: hidden;
            overflow-x: scroll;
            padding-bottom: 0.05rem;
        }
        .content::-webkit-scrollbar {
            -webkit-appearance: none;
        }
        .content::-webkit-scrollbar:vertical {
            width: 1.4rem;
        }
        .content::-webkit-scrollbar:horizontal {
            height: 0.2rem;
        }
        .content::-webkit-scrollbar-thumb {
            // border: 2px solid white; /* should match background, can't be transparent */
            background-color: #d8d8d8;
            border-radius: 0.1rem;
        }
        
    }
}
</style>