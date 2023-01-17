<template>
    <div class="homeView" >
        <section class="page_header" :class="{page_header_en: lang == 'en', page_header_pc: isPc}">
            <img class="icon" @click="gotoTop" :src="logoUrl">
            <!-- <img class="icon" src="@/assets/image/k8_hash2x.png" @click="gotoTop" v-else> -->
            <!-- <img class="xin_icon" src="@/assets/image/new_era@2x.png" @click="gotoTop" v-else> -->
            <div class="right">
                <!-- <a class="process" @click="anchorPoint('#progress')">
                    <i></i>{{$t('参考流程')}}
                </a> -->
                <!-- @click="anchorPoint('#common_question')" -->
                <a class="question" @click="download">
                    <i></i>{{$t('下载APP')}}
                </a>
                <div class="popdown_panel" >
                    <div class="select" @click="isDown = !isDown">
                        <i :class="lang+'_flag'" class="flag"></i>
                        <span class="angle" :class="{upAngle: isDown, downAngle: !isDown}"></span>
                    </div>
                    <div class="down" v-show="isDown">
                        <div class="item" @click="langChange(item.icon)" v-for="(item, i) in langItem" :key="i">
                            <i class="flag" :class="item.icon+'_flag'"></i><label>{{ item.name }}</label>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <section>
            <van-swipe class="my-swipe" :autoplay="5000" indicator-color="white">
                <template v-if="carouse_list.length">
                    <van-swipe-item v-for="(item,i) in carouse_list" :key="i">
                        <img :src="item.url" >
                    </van-swipe-item>
                </template>
                <template v-else>
                    <van-swipe-item>
                        <img :src="require(`@/assets/image/${lang=='cn'?'cn':'en'}/_adv1@3x.png`)" >
                    </van-swipe-item>
                    <!-- <van-swipe-item>
                        <img :src="require(`@/assets/image/${lang}/_adv2@3x.png`)" >
                    </van-swipe-item>
                    <van-swipe-item>
                        <img :src="require(`@/assets/image/${lang}/_adv3@3x.png`)" >
                    </van-swipe-item> -->
                </template>
            </van-swipe>
        </section>
        <NoticeComponent></NoticeComponent>
        <section class="lottery_guide" >
            <svg-icon icon-class="peoples"  class-name="card-panel-icon"/>
            <div class="tip_ct  animate__animated" data-ani="animate__bounceIn" data-delay="100">
                <img :src="require(`@/assets/image/${lang}/_secret_coin_tip@2x.png`)" >
            </div>
            <div class="secret_coin_tabs animate__animated"  data-ani="animate__fadeInLeft" data-delay="100">
                <template v-if="gameList.length == 1">
                    <div class="gameListItem1" @click="currTabSwitch(gameList[0])">
                        {{$t(getGameName(gameList[0].gid))}}
                    </div>
                </template>
                <template v-if="gameList.length == 2">
                    <div class="gameListItem2" :class="{active: currTab.gid == gameList[0].gid, ['secret_coin_tab_'+lang]: true}" @click="currTabSwitch(gameList[0])">
                        {{$t(getGameName(gameList[0].gid))}}
                    </div>
                    <div class="gameListItem2" :class="{active: currTab.gid == gameList[1].gid, ['secret_coin_tab_'+lang]: true}" @click="currTabSwitch(gameList[1])">
                        {{$t(getGameName(gameList[1].gid))}}
                    </div>
                    <i class="angle_left"></i>
                    <i class="angle_right"></i>
                </template>
                <template v-if="gameList.length == 3">
                    <div class="gameListItem3" v-for="(item, i) in gameList" :key="i" :class="{active: currTab.gid == item.gid}" @click="currTabSwitch(item)">
                        <div v-html="$t(getGameName(item.gid))"></div>
                    </div>
                </template>
                <!-- <template v-if="gameList.length >= 4">
                    <div class="gameListItem4" v-for="(item, i) in gameList" :key="i" :class="{active: currTab.gid == item.gid}" @click="over4Click(item, i)">
                        <div v-html="$t(getGameName(item.gid))"></div>
                    </div>
                </template> -->
                <TabComponent v-if="gameList.length >= 4" :tabList="gameList" @itemClick="currTabSwitch"></TabComponent>
			</div>
            <!-- 幸运hash -->
            <div class="hash_lucky_block" v-if="currTab.gid == 1001">
                <div class="address_info  animate__animated"  data-ani="animate__fadeInLeft" data-delay="100">
                    <div class="addr">
                        <p>{{$t('官方投注地址')}}：</p>
                        <p>
                            <textarea style="text-align:left;" readonly="readonly" :value="currTab.game_address" id="copy1" />
                        </p>
                    </div>
                    <div class="copy_btn" @click="copyHandle('#copy1')">{{$t('一键复制')}}</div>
                </div>
                <div class="guide">
                    <!-- <div class="guide_tip  animate__animated"  data-ani="animate__bounceIn" data-delay="100">
                        <img :src="require(`@/assets/image/${lang}/_lottery4@2x.png`)" >
                    </div> -->
                    <div class="title_name  animate__animated"  data-ani="animate__fadeInRight" data-delay="100">
                        <img class="guide_name" :src="require(`@/assets/image/${lang}/guide_name@2x.png`)" >
                    </div>
                    <div class="txt  animate__animated"  data-ani="animate__fadeInRight" data-delay="100">
                        <p v-html="$t('1.向游戏地址投注资金10-50000USDT', {min: currTab.bet_min, max: currTab.bet_max})"></p>
                        <p>{{$t('2.获取您转账的Block Hash作为判定依据')}}</p>
                        <p>{{$t('3.Block Hash最后两位分别为数字和字母为赢')}}</p>
                        <p>{{$t('4.我们将及时返奖2.00倍USDT到您钱包')}}</p>
                        <!-- <p v-html="$t('5. 低于最低金额和高于最高金额（无效投注）')"></p> -->
                        <p v-html="$t('5.低于最低投注金额,视为无效金额,平台不给予返还')"></p>
                        <p v-html="$t('6.高于最高限额的投注。视为无效金额,平台抽取千一手续费，给予返还')"></p>
                        <p>{{$t('7.仅支持整数币参与抽奖，小数部分将自动忽略')}}</p>
                    </div>
                    <div class="title_name  animate__animated"  data-ani="animate__lightSpeedInLeft" data-delay="100">
                        <img class="lottery_name" :src="require(`@/assets/image/${lang}/lottery_name@2x.png`)">
                    </div>
                    <van-swipe class="my-swipe animate__animated"  data-ani="animate__lightSpeedInLeft" :autoplay="5000" indicator-color="white">
                        <van-swipe-item style="margin-right:2px;">
                            <div class="txt2"> 
                                <div>
                                    <p>{{$t('您的转账金额为')}}：<em>1001</em></p>
                                    <p>{{$t('该笔转账的区块哈希为')}}：000*****9e<em>3a</em></p>
                                    <p>{{$t('区块哈希值最后两位3a为“数字+字母”组合')}}</p>
                                    <p><span v-html="$t('结果中奖系统汇款金额为')"></span>：1001*2.00=2002.00</p>
                                </div>
                            </div>
                        </van-swipe-item>
                        <van-swipe-item style="margin-right:2px;">
                            <div class="txt2"> 
                                <div>
                                    <p>{{$t('您的转账金额为')}}：<em>2800.03</em></p>
                                    <p>{{$t('该笔转账的区块哈希为')}}：000*****9e<em>c4</em></p>
                                    <p>{{$t('区块哈希值最后两位c4为“字母+数字”组合')}}</p>
                                    <p>{{$t('结果')}}<em>{{$t('中奖')}}</em>{{$t('系统汇款金额为')}}：2800*2.00=5600.00</p>
                                </div>
                            </div>
                        </van-swipe-item>
                        <van-swipe-item>
                            <div class="txt2"> 
                                <div>
                                    <p>{{$t('您的转账金额为')}}：<em>1051</em></p>
                                    <p>{{$t('该笔转账的区块哈希为')}}：000*****9e<em>ad</em></p>
                                    <p>{{$t('区块哈希值最后两位ad为“字母+字母”组合')}}</p>
                                    <p>{{$t('结果')}}<em class="no">{{$t('未中奖')}}</em>{{$t('不返还数字币')}}</p>
                                </div>
                            </div>
                        </van-swipe-item>
                        <van-swipe-item>
                            <div class="txt2"> 
                                <div>
                                    <p>{{$t('您的转账金额为')}}：<em>2224.31</em></p>
                                    <p>{{$t('该笔转账的区块哈希为')}}：000*****9e<em>71</em></p>
                                    <p>{{$t('区块哈希值最后两位71为“数字+数字”组合')}}</p>
                                    <p>{{$t('结果')}}<em class="no">{{$t('未中奖')}}</em>{{$t('不返还数字币')}}</p>
                                </div>
                            </div>
                        </van-swipe-item>
                    </van-swipe>
                </div>
            </div>
            <!-- hash牛牛 -->
            <div class="hash_niuniu_block" v-if="currTab.gid == 1002">
                <div class="address_info  animate__animated"  data-ani="animate__fadeInLeft" data-delay="100">
                    <div class="addr">
                        <p>{{$t('官方投注地址')}}：</p>
                        <p>
                            <textarea style="text-align:left;" readonly="readonly" :value="currTab.game_address" id="copy2"/>
                        </p>
                    </div>
                    <div class="copy_btn" @click="copyHandle('#copy2')">{{$t('一键复制')}}</div>
                </div>

                <div class="guide">
                    <!-- <div class="guide_tip  animate__animated"  data-ani="animate__bounceIn" data-delay="100">
                        <img :src="require(`@/assets/image/${lang}/_lottery4@2x.png`)" >
                    </div> -->
                    <div class="title_name animate__animated"  data-ani="animate__fadeInRight" data-delay="100">
                        <img class="guide_name" :src="require(`@/assets/image/${lang}/guide_name@2x.png`)">
                    </div>
                    <div class="txt animate__animated"  data-ani="animate__fadeInRight" data-delay="100">
                        <p v-html="$t('1.向游戏地址投注资金10-50000USDT。', {min: currTab.bet_min, max: currTab.bet_max})"></p>
                        <p>{{$t('2.投注金额是转账金额的十分之一。')}}</p>
                        <p>{{$t('3.如押注10USDT，则需要转账100USDT。')}}</p>
                        <p>{{$t('4.转账后区块哈希值(Block hash)最后的5位作为牌面，如：（000***57aba）为牌面。')}}</p>
                        <p>{{$t('5.57aba字母为10，相加出得点个位数比较.')}}</p>
                        <p>{{$t('6.庄家开奖号码：57a，5+7+10=22 牛二')}}</p>
                        <p>{{$t('7.闲家开奖号码是：aba，10+10+10=30 牛牛')}}</p>
                        <p>{{$t('8.1∽2点同点庄赢，其他同点扣千分之一手续费退还本金')}}</p>
                        <!-- <p v-html="$t('9.低于最低金额和高于最高金额（无效投注）')"></p> -->
                        <p v-html="$t('9.低于最低投注金额,视为无效金额,平台不给予返还')"></p>
                        <p v-html="$t('10.高于最高限额的投注。视为无效金额,平台抽取千一手续费，给予返还')"></p>
                        <p>{{$t('11.仅支持整数币参与抽奖，小数部分将自动忽略。')}}</p>
                    </div>
                    <div class="title_name animate__animated"  data-ani="animate__lightSpeedInLeft" data-delay="100">
                        <img class="lottery_name" :src="require(`@/assets/image/${lang}/lottery_name@2x.png`)">
                    </div>

                    <van-swipe class="my-swipe animate__animated"  data-ani="animate__lightSpeedInLeft" :autoplay="5000" indicator-color="white">
                        <van-swipe-item style="margin-right:2px;">
                            <div class="txt2"> 
                                <div>
                                    <p>{{$t('您的转账金额为')}}：<em>1000</em></p>
                                    <p>{{$t('该笔转账的区块哈希为')}}：000*****57<em>aba</em></p>
                                    <p>{{$t('庄家开奖号码：57a，5+7+10=22 牛二')}}</p>
                                    <p>{{$t('闲家开奖号码是：aba，10+10+10=30 牛牛')}}</p>
                                    <p>{{$t('结果中奖系统回款金额为')}}：</p>
                                    <p>{{$t('闲家投注100牛牛，赢10倍1000')}}</p>
                                    <p>{{$t('闲赢抽百分5，盈1000抽50')}}</p>
                                    <p><em>{{$t('连本带利')}}</em>1000+1000-50=1950</p>
                                </div>
                            </div>
                        </van-swipe-item>
                        <van-swipe-item style="margin-right:2px;">
                            <div class="txt2"> 
                                <div>
                                    <p>{{$t('您的转账金额为')}}：<em>2800.03</em></p>
                                    <p>{{$t('该笔转账的区块哈希为')}}：000*****89<em>ec7</em></p>
                                    <p>{{$t('庄家开奖号码：89e，8+9+10=27 牛七')}}</p>
                                    <p>{{$t('闲家开奖号码是：ec7，10+10+7=27 牛七')}}</p>
                                    <p>{{$t('结果未中奖系统回款金额为')}}：</p>
                                    <p>{{$t('因为1∽2点同点庄赢，其他同点扣千分之一手续费退还本金回款2800-2800*1‰=2797.2')}}</p>
                                </div>
                            </div>
                        </van-swipe-item>
                        <van-swipe-item>
                            <div class="txt2"> 
                                <div>
                                    <p>{{$t('您的转账金额为')}}：<em>2224.03</em></p>
                                    <p>{{$t('该笔转账的区块哈希为')}}：000*****c1<em>e1f</em></p>
                                    <!-- <p>{{$t('庄家开奖号码：c5e，10+5+10=25 牛五')}}</p> -->
                                    <p>{{$t('庄家开奖号码：c1e，10+1+10=1 牛一')}}</p>
                                    <!-- <p>{{$t('闲家开奖号码是：e69，10+6+9=25 牛五')}}</p> -->
                                    <p>{{$t('闲家开奖号码是：e1f，10+1+10=1 牛一')}}</p>
                                    <p>{{$t('结果未中奖系统回款金额为')}}：</p>
                                    <p>{{$t('因为1∽2点同点庄赢')}}</p>
                                    <!-- <p>{{$t('闲家投注222.4牛五，输5倍1112')}}</p> -->
                                    <p>{{$t('闲家投注222.4牛一，输1倍222.4')}}</p>
                                    <!-- <p>{{$t('回款2224-1112=1112')}}</p> -->
                                    <p>{{$t('回款2224-222.4=2001.6')}}</p>
                                </div>
                            </div>
                        </van-swipe-item>
                        <van-swipe-item>
                            <div class="txt2"> 
                                <div>
                                    <p>{{$t('您的转账金额为')}}：<em>1051</em></p>
                                    <p>{{$t('该笔转账的区块哈希为')}}：000*****c5<em>e29</em></p>
                                    <p>{{$t('庄家开奖号码：c5e，10+5+10=25 牛五')}}</p>
                                    <p>{{$t('闲家开奖号码是：e29，10+2+9=21 牛一')}}</p>
                                    <p>{{$t('结果未中奖系统回款金额为')}}：</p>
                                    <p>{{$t('闲家投注105.1牛一，输5倍525.5')}}</p>
                                    <p>{{$t('回款1051-525.5=525.5')}}</p>
                                </div>
                            </div>
                        </van-swipe-item>
                    </van-swipe>
                </div>
            </div>
            <!-- 哈希数字 -->
            <div class="hash_niuniu_block" v-if="currTab.gid == 1003">
                <div class="address_info  animate__animated"  data-ani="animate__fadeInLeft" data-delay="100">
                    <div class="addr">
                        <p>{{$t('官方投注地址')}}：</p>
                        <p>
                            <textarea style="text-align:left;" readonly="readonly" :value="currTab.game_address" id="copy3"/>
                        </p>
                    </div>
                    <div class="copy_btn" @click="copyHandle('#copy3')">{{$t('一键复制')}}</div>
                </div>
                <div class="guide">
                    <!-- <div class="guide_tip  animate__animated"  data-ani="animate__bounceIn" data-delay="100">
                        <img :src="require(`@/assets/image/${lang}/_lottery4@2x.png`)" >
                    </div> -->
                    <div class="title_name animate__animated"  data-ani="animate__fadeInRight" data-delay="100">
                        <img class="guide_name" :src="require(`@/assets/image/${lang}/guide_name@2x.png`)">
                    </div>
                    <div class="txt animate__animated"  data-ani="animate__fadeInRight" data-delay="100">
                        <p v-html="$t('1.向游戏地址投注资金10-50000USDT', {min: currTab.bet_min, max: currTab.bet_max})"></p>
                        <p>{{$t('2.获取您转账的Block hash作为判定依据')}}</p>
                        <p>{{$t('3.Block hash最后一位数字作为开奖结果')}}</p>
                        <p class="dot">{{$t('0，1，2，3，4识别为小')}}</p>
                        <p class="dot">{{$t('5，6，7，8，9识别为大')}}</p>
                        <p class="dot">{{$t('1，3，5，7，9识别为单')}}</p>
                        <p class="dot">{{$t('0，2，4，6，8识别为双')}}</p>
                        <p>{{$t('4.根据押注的个位数来判定下注类型')}}</p>
                        <p class="dot">{{$t('下注1000USDT个位数为0识别为押小')}}</p>
                        <p class="dot">{{$t('下注1009USDT个位数为9识别为押大')}}</p>
                        <p class="dot">{{$t('下注1001USDT个位数为1识别为押单')}}</p>
                        <p class="dot">{{$t('下注1008USDT个位数为8识别为押双')}}</p>
                        <p>{{$t('5.赔率：1.95倍')}}</p>
                        <p>{{$t('6.个位数为其他数字，识别为无效押注，扣除千分之一手续费后原路退回')}}</p>
                        <p>{{$t('7.低于最低投注金额，视为无效金额，平台不给予返还')}}</p>
                        <p>{{$t('8.高于最高限额的投注。视为无效金额，平台抽取千一手续费，给予返还')}}</p>
                        <p>{{$t('9.仅支持整数币参与抽奖，小数部分将自动忽略')}}</p>
                        <p>10.{{$t('此游戏投注不返佣金')}}</p>
                    </div>
                    <div class="title_name animate__animated"  data-ani="animate__lightSpeedInLeft" data-delay="100">
                        <img class="lottery_name" :src="require(`@/assets/image/${lang}/lottery_name@2x.png`)">
                    </div>
                    <van-swipe class="my-swipe animate__animated"  data-ani="animate__lightSpeedInLeft" :autoplay="5000" indicator-color="white">
                        <van-swipe-item style="margin-right:2px;">
                            <div class="txt2"> 
                                <div>
                                    <p>{{$t('您的转账金额为')}}：<em>1000</em></p>
                                    <p>{{$t('识别为押小')}}</p>
                                    <p>{{$t('该笔转账的Block hash为：')}}<em>000*****1</em></p>
                                    <p>{{$t('Block hash最后一位数字为“1”识别为小')}}</p>
                                    <p>{{$t('结果中奖系统回款金额为：')}}：</p>
                                    <p>{{$t('1000*1.95=1950')}}</p>
                                </div>
                            </div>
                        </van-swipe-item>
                        <van-swipe-item style="margin-right:2px;">
                            <div class="txt2"> 
                                <div>
                                    <p>{{$t('您的转账金额为')}}：<em>2309.23</em></p>
                                    <p>{{$t('识别为押大')}}</p>
                                    <p>{{$t('该笔转账的Block hash为')}}：000*****<em>3a</em></p>
                                    <p>{{$t('Block hash最后一位数字为“3”识别为小')}}</p>
                                    <p>{{$t('结果未中奖不返还数字币')}}</p>
                                </div>
                            </div>
                        </van-swipe-item>
                        <van-swipe-item>
                            <div class="txt2"> 
                                <div>
                                    <p>{{$t('您的转账金额为')}}：<em>4213.23</em></p>
                                    <p>{{$t('个位数为其他数字，识别为无效投注')}}</p>
                                    <p>{{$t('扣除千分之一手续费后原路退回')}}</p>
                                </div>
                            </div>
                        </van-swipe-item>
                        <van-swipe-item>
                            <div class="txt2"> 
                                <div>
                                    <p>{{$t('您的转账金额为')}}：<em>151.23</em></p>
                                    <p>{{$t('识别为押单')}}</p>
                                    <p>{{$t('该笔转账的Block hash为')}}：000*****7ba</p>
                                    <p>{{$t('Block hash最后一位数字为“7”识别为单')}}</p>
                                    <p>{{$t('结果中奖系统回款金额为')}}：</p>
                                    <p>151*1.95=294.45</p>
                                </div>
                            </div>
                        </van-swipe-item>
                    </van-swipe>
                </div>
            </div>

            <!-- 哈希百家乐 -->
            <div class="hash_niuniu_block" v-if="currTab.gid == 1004">
                <div class="address_info  animate__animated"  data-ani="animate__fadeInLeft" data-delay="100">
                    <div class="addr">
                        <p>{{$t('官方投注地址')}}：</p>
                        <p>
                            <textarea style="text-align:left;" readonly="readonly" :value="currTab.game_address" id="copy4"/>
                        </p>
                    </div>
                    <div class="copy_btn" @click="copyHandle('#copy4')">{{$t('一键复制')}}</div>
                </div>
                <div class="guide">
                    <!-- <div class="guide_tip  animate__animated"  data-ani="animate__bounceIn" data-delay="100">
                        <img :src="require(`@/assets/image/${lang}/_lottery4@2x.png`)" >
                    </div> -->
                    <div class="title_name animate__animated"  data-ani="animate__fadeInRight" data-delay="100">
                        <img class="guide_name" :src="require(`@/assets/image/${lang}/guide_name@2x.png`)">
                    </div>
                    <div class="txt animate__animated"  data-ani="animate__fadeInRight" data-delay="100">
                        <p v-html="$t('1.向游戏地址投注资金10-50000USDT', {min: currTab.bet_min, max: currTab.bet_max})"></p>
                        <p>{{$t('2.获取您转账的Block hash作为判定依据')}}</p>
                        <p>{{$t('3.Block hash最后五位字符作为开奖结果')}}</p>
                        <p class="dot">{{$t('0点最小')}}</p>
                        <p class="dot">{{$t('9点最大')}}</p>
                        <p class="dot">{{$t('字母识别为0')}}</p>
                        <p class="dot">{{$t('例如Block hash为000*****a3B45')}}</p>
                        <p class="dot">{{$t('a、3代表 庄的点数')}}</p>
                        <p class="dot">{{$t('4、5代表 闲的点数')}}</p>
                        <p>{{$t('4.根据押注的个位数来判定下注类型')}}</p>
                        <p class="dot">{{$t('下注1001USDT个位数为1识别为押庄赢')}}</p>
                        <p class="dot">{{$t('下注1002USDT个位数为2识别为押闲赢')}}</p>
                        <p class="dot">{{$t('下注1003USDT个位数为3识别为押和赢')}}</p>
                        <p>{{$t('5.赔率')}}：</p>
                        <p class="dot">{{$t('押注庄赢，比较点数后，庄赢则赔1.95倍')}}</p>
                        <p class="dot">{{$t('押注闲赢，比较点数后，闲赢则赔1.95倍')}}</p>
                        <p class="dot">{{$t('押注和赢，比较点数后，和赢则赔8倍')}}</p>
                        <p>{{$t('6.个位数为其他数字，识别为无效押注，扣除千分之一手续费后原路退回')}}</p>
                        <p>{{$t('7.押注庄或闲，开和，扣除千分之一手续费后原路返回')}}</p>
                        <p>{{$t('8.低于最低投注金额，视为无效金额，平台不给予返还')}}</p>
                        <p>{{$t('9.高于最高限额的投注。视为无效金额，平台抽取千一手续费，给予返还')}}</p>
                        <p>{{$t('10.仅支持整数币参与抽奖，小数部分将自动忽略')}}</p>
                        <p>11.{{$t('此游戏投注不返佣金')}}</p>
                    </div>
                    <div class="title_name animate__animated"  data-ani="animate__lightSpeedInLeft" data-delay="100">
                        <img class="lottery_name" :src="require(`@/assets/image/${lang}/lottery_name@2x.png`)">
                    </div>
                    <van-swipe class="my-swipe animate__animated"  data-ani="animate__lightSpeedInLeft" :autoplay="5000" indicator-color="white">
                        <van-swipe-item style="margin-right:2px;">
                            <div class="txt2"> 
                                <div>
                                    <p>{{$t('您的转账金额为')}}：<em>1001</em></p>
                                    <p>{{$t('识别为押庄赢')}}</p>
                                    <p>{{$t('该笔转账的Block hash为：')}}<em>000*****a7B41</em></p>
                                    <p>{{$t('a、7代表 庄的点数为7点')}}</p>
                                    <p>{{$t('4、1代表 闲的点数为5点')}}</p>
                                    <p>{{$t('开奖为庄赢')}}：</p>
                                    <p>{{$t('结果中奖系统回款金额为')}}:</p>
                                    <p>1001*1.95=1951.95</p>
                                </div>
                            </div>
                        </van-swipe-item>
                        <van-swipe-item style="margin-right:2px;">
                            <div class="txt2"> 
                                <div>
                                    <p>{{$t('您的转账金额为')}}：<em>3223</em></p>
                                    <p>{{$t('识别为押和赢')}}</p>
                                    <p>{{$t('该笔转账的Block hash为')}}：000*****<em>a7B43</em></p>
                                    <p>{{$t('a、7代表 庄的点数为7点')}}</p>
                                    <p>{{$t('4、3代表 闲的点数为7点')}}</p>
                                    <p>{{$t('开奖为和赢')}}</p>
                                    <p>{{$t('结果中奖系统回款金额为')}}:</p>
                                    <p>3223*8=25784</p>
                                </div>
                            </div>
                        </van-swipe-item>
                        <van-swipe-item>
                            <div class="txt2"> 
                                <div>
                                    <p>{{$t('您的转账金额为')}}：<em>1002.23</em></p>
                                    <p>{{$t('识别为押闲赢')}}</p>
                                    <p>{{$t('该笔转账的Block hash为')}}:000*****<em>a7B43</em></p>
                                    <p>{{$t('a、7代表 庄的点数为7点')}}</p>
                                    <p>{{$t('4、3代表 闲的点数为7点')}}</p>
                                    <p>{{$t('开奖为和赢')}}</p>
                                    <p>{{$t('扣除千分之一手续费后原路退回')}}</p>
                                </div>
                            </div>
                        </van-swipe-item>
                        <van-swipe-item>
                            <div class="txt2"> 
                                <div>
                                    <p>{{$t('您的转账金额为')}}：<em>2003</em></p>
                                    <p>{{$t('识别为押和赢')}}</p>
                                    <p>{{$t('该笔转账的Block hash为')}}：000*****a7Bad</p>
                                    <p>{{$t('a、7代表 庄的点数为7点')}}</p>
                                    <p>{{$t('a、d代表 闲的点数为0点')}}</p>
                                    <p>{{$t('开奖为庄赢')}}</p>
                                    <p>{{$t('结果未中奖不返还数字币')}}</p>
                                </div>
                            </div>
                        </van-swipe-item>
                    </van-swipe>
                </div>
            </div>

        </section>

        <section class="progress" id="progress">
            <div class="tip_ct animate__animated"  data-ani="animate__bounceIn" data-delay="100">
                <img :src="require(`@/assets/image/${lang}/progress_title_img@2x.png`)" >
            </div>
            <div class="info">
                <div class="item animate__animated"  data-ani="animate__fadeInUpBig" data-delay="100" 
                    :class="{active: infoSwitch_v == 1}" @click="infoSwitchClick(1)">
                    <span class="circle">1</span>
                    <p>{{$t('注册钱包')}}</p>
                </div>
                <div class="item animate__animated"  data-ani="animate__fadeInUpBig" data-delay="500" 
                    :class="{active: infoSwitch_v == 2}"  @click="infoSwitchClick(2)">
                    <span class="circle">2</span>
                    <p>{{$t('购买虚拟币')}}</p>
                </div>
                <div class="item animate__animated"  data-ani="animate__fadeInUpBig" data-delay="900" 
                    :class="{active: infoSwitch_v == 3}"  @click="infoSwitchClick(3)">
                    <span class="circle">3</span>
                    <p>{{$t('转账抽奖')}}</p>
                </div>
                <div class="item animate__animated"  data-ani="animate__fadeInUpBig" data-delay="1300" 
                    :class="{active: infoSwitch_v == 4}"  @click="infoSwitchClick(4)">
                    <span class="circle">4</span>
                    <p>{{$t('中奖回款')}}</p>
                </div>
            </div>
            <div class="infoSwitch_v_1 animate__animated"  data-ani="animate__bounceInLeft" data-ani2="animate__bounceOutRight" data-delay="100" v-show="infoSwitch_v == 1">
                <div class="title_img">
                    <img :src="require(`@/assets/image/${lang}/_title_img@2x.png`)">
                </div>
                <div class="platform">
                    <div class="head">
                        <div>{{$t('平台')}}</div><div>{{$t('网址')}}</div><div>{{$t('教程')}}</div>
                    </div>
                    <div class="item" v-for="(item, i) in platformList" :key="i">
                        <div>
                            <!-- <img class="plate_img" :src="item.imgLink"> -->
                            <img class="plate_img" src="@/assets/image/token_im.png" v-if="i == 0">
                            <img class="plate_img" src="@/assets/image/ownbit_io.png" v-if="i == 2">
                            <img class="plate_img" src="@/assets/image/trustwallet_com.png" v-if="i == 1">
                            <img class="plate_img" src="@/assets/image/trolink_org.png" v-if="i == 3">
                            <img class="plate_img" src="@/assets/image/bitpie_com.png" v-if="i == 4">
                            <img class="plate_img" src="@/assets/image/360usdt_com.png" v-if="i == 5">
                        </div>
                        <div>{{item.text}}</div>
                        <div @click="gotopage(item)"><a>{{$t('查看教程')}}</a></div>
                    </div>
                </div>
            </div>
            <div class="infoSwitch_v_2 animate__animated"  data-ani="animate__bounceInLeft" data-ani2="animate__bounceOutRight" data-delay="100" v-show="infoSwitch_v == 2">
                <div class="title_img">
                    <img :src="require(`@/assets/image/${lang}/buy_coin@2x.png`)">
                </div>
                <div class="platform">
                    <div class="head">
                        <div>{{$t('平台')}}</div><div>{{$t('网址')}}</div><div>{{$t('教程')}}</div>
                    </div>
                    <div class="item" v-for="(item, i) in platformList2" :key="i">
                        <div>
                            <!-- <img class="plate_img" :src="item.imgLink"> -->
                            <img class="plate_img" src="@/assets/image/gate_io@2x.png" v-if="i == 0">
                            <img class="plate_img" src="@/assets/image/huobi_com@2x.png" v-if="i == 1">
                            <img class="plate_img" src="@/assets/image/binance_com@2x.png" v-if="i == 2">
                            <img class="plate_img" src="@/assets/image/okex_com@2x.png" v-if="i == 3">
                            <img class="plate_img" src="@/assets/image/zb_com@2x.png" v-if="i == 4">
                            <img class="plate_img" src="@/assets/image/360usdt_com.png" v-if="i == 5">
                        </div>
                        <div>{{item.text}}</div>
                        <div @click="gotopage(item)"><a>{{$t('查看教程')}}</a></div>
                    </div>
                </div>
            </div>
            <div class="infoSwitch_v_3 animate__animated"  data-ani="animate__bounceInLeft" data-ani2="animate__bounceOutRight"  data-delay="100" v-show="infoSwitch_v == 3">
                <div class="title_img">
                    <img :src="require(`@/assets/image/${lang}/lottery@2x.png`)">
                </div>
                <div class="content">
                    <div class="tip_mark">{{$t('向下方地址按规定金额转账后即成功参与抽奖')}}</div>
                    <div class="infoSwitch_tabs">
                        <span v-for="(item, i) in gameList" :key="i" 
                            :class="{active: infoSwitch_tab == i}" @click="currTabSwitchSub(item, i)">
                            <span v-html="$t(getGameName(item.gid))"></span>
                        </span>
                    </div>
                    <div class="infoSwitch_item">
                        <p>{{$t('官方投注地址')}}</p>
                        <p>
                            <textarea readonly="readonly" :value="currTabSub.game_address" id="infoSwitch_tab"/>
                        </p>
                        <div class="copy_btn"  @click="copyHandle('#infoSwitch_tab' )">{{$t('一键复制')}}</div>
                    </div>
                </div>
            </div>
            <div class="infoSwitch_v_4 animate__animated"  data-ani="animate__bounceInLeft" data-ani2="animate__bounceOutRight"  data-delay="100" v-show="infoSwitch_v == 4">
                <div class="title_img">
                    <img :src="require(`@/assets/image/${lang}/huikuan@2x.png`)">
                </div>
                <div class="content">
                    <div class="tip_mark">{{$t('中奖后系统10秒内自动反奖')}}</div>
                    <div class="icon_ct">
                        <img src="@/assets/image/ring@2x.png">
                    </div>
                </div>
            </div>
        </section>

        <section class="common_question" id="common_question">
            <div class="tip_ct animate__animated"  data-ani="animate__rubberBand"  data-delay="100">
                <img :src="require(`@/assets/image/${lang}/_common_question@2x.png`)">
            </div>
            <div class="question_item " v-for="(item, j) in questionList" :key="j" >
                <div class="animate__animated"  :data-ani="j%2==0?'animate__rotateInDownLeft':'animate__rotateInUpRight'" data-delay="100" >
                    <p class="header">{{$t(item.header)}}</p>
                    <!-- <p class="content" v-if="item.type == 'html'" v-html="item.content"></p> -->
                    <p class="content" >{{$t(item.content)}}</p>
                    <p class="link"><a>{{item.linkTxt}}</a></p>
                </div>
            </div>
        </section>

        <section class="partner">
            <div class="img_ct animate__animated"  data-ani="animate__bounceIn" data-delay="100">
                <img :src="require(`@/assets/image/${lang}/partner@2x.png`)">
            </div>
            <div class="item_ct">
                <div class="row">
                    <img  @click="gotopage({name2: 'token_im'})" src="@/assets/image/logo/token_im.png" class="aab animate__animated"  data-ani="animate__flipInY" data-delay="300">
                    <img  @click="gotopage({name2: 'ownbit_io'})" src="@/assets/image/logo/ownbit_io.png" class="aa animate__animated"  data-ani="animate__flipInY" data-delay="500">
                    <img  @click="gotopage({name2: 'trustwallet_com'})" src="@/assets/image/logo/trustwallet_com.png" class="aa animate__animated"  data-ani="animate__flipInY" data-delay="700">
                </div>
                <div class="row">
                    <img  @click="gotopage({name2: 'trolink_org'})" src="@/assets/image/logo/trolink_org.png" class="aa animate__animated"  data-ani="animate__flipInY" data-delay="700">
                    <img  @click="gotopage({name2: 'bitpie_com'})" src="@/assets/image/logo/bitpie_com.png" class="aa animate__animated"  data-ani="animate__flipInY" data-delay="900">
                </div>
                <div class="row">
                    <img  @click="gotopage({name2: 'huobi_com'})" src="@/assets/image/logo/huobi_com.png" class="aa animate__animated"  data-ani="animate__flipInY" data-delay="1000">
                </div>
            </div>
            <!-- <img src="@/assets/image/partner_detail@2x.png"> -->
        </section>

        <van-popup v-model:show="panelShow2" ref="panelRef" class="animate__animated animate__bounceIn">
            <div class="panel_ct">
				<div class="p_title">
					<!-- {{$t('新用户注册两重豪礼')}} -->
                    {{pop_tip_list.title}}
                    <div class="close" @click="closePanel"><i></i></div>
				</div>
                <div class="content">
                    <div class="img_ct">
                        <img src="@/assets/image/page/loginr/gift@2x.png">
                    </div>
                    <!-- <p>{{$t('立即开通0.5%流水返利')}}</p>
                    <p>{{$t('立即开通最高1%的代理佣金返利')}}</p>
                    <p>{{$t('实时查看投注返奖记录')}}</p> -->
                    <!-- <p>{{$t('新玩家5把竞猜包赔体验')}}</p>
                    <p>{{$t('全网最高竞猜流水反佣')}}</p> -->
                    <p v-for="(item, i) in pop_tip_list.list" :key="i">
                        {{item}}
                    </p>
                </div>
                <div class="btn" @click="$router.push('/register')">{{$t('立即注册')}}</div>
            </div>
        </van-popup>
    </div>
</template>
<script>
import { reactive, toRefs, ref, onMounted, nextTick, computed, inject } from 'vue'
import { useRouter } from 'vue-router'
import { Toast } from 'vant'
import { useI18n } from "vue-i18n";
import {vantLocales, i18n} from '@/assets/lang'
import {requestTwoMoblieConfig} from '@/net/index'
import helper from '@/utils/helper'
import store from '@/vuex'
import NoticeComponent from './componets/NoticeComponent.vue'
import TabComponent from './componets/TabComponent.vue'
export default {
    components:{ 
        NoticeComponent,
        TabComponent
    },
    setup( ) {
        const { t } = useI18n();
        // const { proxy } = getCurrentInstance()
        let _gameList
        try{
            _gameList = JSON.parse(window.decodeURIComponent(window.gameList))
        }catch(e){
            _gameList = []
        }
        // _gameList = _gameList.concat( _gameList )

        const state = reactive({
            platformList: [
                {imgLink: '@/assets/image/token_im.png', text: 'token.im', name: 'token_im'},
                {imgLink: '@/assets/image/trustwallet_com.png', text: 'trustwallet.com', name: 'trustwallet_com'},
                {imgLink: '@/assets/image/ownbit_io.png', text: 'ownbit.io', name: 'ownbit_io'},
                {imgLink: '@/assets/image/trolink_org.png', text: 'trolink.org', name: 'trolink_org'},
                {imgLink: '@/assets/image/bitpie_com.png', text: 'bitpie.com', name: 'bitpie_com'},
                // {imgLink: '@/assets/image/360usdt_com.png', text: '360usdt.com', name: '360usdt_com'},
            ],
            platformList2: [
                {imgLink: '@/assets/image/gate_io.png', text: 'gate.io', name: 'gate_io', link: 'https://www.gate.io/cn/help/guide'},
                {imgLink: '@/assets/image/huobi_com.png', text: 'huobi.com', name: 'huobi_com', link: 'https://www.huobi.com/support/zh-cn/list/360000010372'},
                {imgLink: '@/assets/image/binance_com.png', text: 'binance.com', name: 'binance_com', link: 'https://academy.binance.com/zh/articles/binance-beginner-s-guide'},
                {imgLink: '@/assets/image/okex_com.png', text: 'okex.com', name: 'okex_com', link: 'https://www.okex.com/support/hc/zh-cn/sections/360000033031-新手必读'},
                {imgLink: '@/assets/image/zb_com.png', text: 'zb.com', name: 'zb_com', link: 'https://www.zb.com/help/guides/1'},
                // {imgLink: '@/assets/image/360usdt_com.png', text: '360usdt.com', name: '360usdt_com'},
            ],
            questionList: [
                {header: ('Q1：什么是区块哈希值(Block hash)？'), content: ('区块哈希值是一段数据的DNA，每个区块哈希值都是唯一的、随机的且不可破解的。'),
                    linkTxt: ''},
                 {header: ('Q2：什么是区块链？'), content: ('区块链从本质上讲，它是一个共享数据库，存储于其中的数据或信息。具有不可伪造、全程留痕、可以追溯、公开透明、集体维护等特征。'),
                    linkTxt: ''},
                 {header: ('Q3：中心化钱包？去中心化钱包？为什么中心化钱包无法查询转账？'), content: ('举一个例子：您自己的钱包地址是A，您给地址E转入10个USDT，但您用交易哈希值去查询，只能查询到服务商随机某个账本地址B（或C或D等等）与E的转账。 同理E也无法得知这10个USDT是否是您转出的，因为E只能看见是账本地址B给他转入10个USDT。这就是为什么中心化钱包无法在区块链上查询真实转账信息。'),
                    linkTxt: ''},
                 {header: ('Q4：为什么我会连续中奖或不中奖？'), content: ('首先连续多次不中奖的是小概率事件（小概率事件定义），其次中奖与不中奖是随机事件，随机事件的发生的频率会趋于一个稳定值。 在非迭代的情况下，事物出现的概率对每个人来讲是相等的，这个情况下，每个人都是公平的。 同时随机事件会遵大数定律（在试验不变的条件下，重复试验多次，随机事件的频率近似于它的概率大数定律定义），在转账频次不断增加的情况下，中奖与不中奖的概率会趋于一个稳定值。 所以请您继续转账，随着转账频次增加则中奖总概率会提升。'),
                    linkTxt: ''},
                 {header: ('Q5：为什么会延迟到帐？'), content: ('全球有许多知名公链（点击查看全球知名公链）都支持进行USDT转账，而我们平台是基于波场TRC20技术。 所以我们平台的转账地址是属于USDT-TRC20， 您应该选择USDT-TRC20； 如果您选择了其他类型，幸运哈希则无法收到您的USDT，这会造成您和幸运哈希双方的损失。'),
                    linkTxt: '', type: 'html'}
            ],

            langItem: [
                {icon: 'cn', name: '中文简体'}, 
                {icon: 'cn_tw', name: '中文繁體'}, 
                {icon: 'en', name: 'English'}, 
                {icon: 'ja', name: '日本'}, 
                {icon: 'ko', name: '한국인'}, 
                {icon: 'th', name: 'ไทย'}, 
                {icon: 'vi', name: 'Tiếng Việt'}, 
            ],

            panelShow: !localStorage.getItem('token'),
            infoSwitch_v: 1,
            infoSwitch_tab: 0,

            oldEnter: 0,
            lang: i18n.global.locale,
            isDown: false,


            // logoUrl: window.logo_url,
            ios_key: window.ios_key,

            gameList:  _gameList,

            currTab: _gameList[0] || {},
            currTabSub: _gameList[0] || {},
        })

        const carouse_list = computed(() => store.state.activity.carouse_list || [])
        const pop_tip_list = computed(() => {
            return store.state.activity.pop_tip_list
        })
        console.log('_gameList', JSON.stringify(_gameList), state.currTab.game_address)
        const panelShow2 = computed(() => {
            console.log('store.state.activity.pop_tip_list1', store.state.activity.pop_tip_list)
            const b =state.panelShow && store.state.activity.pop_tip_list && store.state.activity.pop_tip_list.list && store.state.activity.pop_tip_list.list.length
            return b
        })
        
        const general_id = computed(() => {
            return store.state.user.userInfo.general_id || window.general_id
        })
        const logoUrl = computed(() => {
            return store.state.activity.logo_url || window.logo_url
        })


        const infoSwitchClick = (val) => {
            state.infoSwitch_v = val
            // let enter = val || 1
            // if(state.oldEnter){
            //     let leaveDom = document.querySelector('infoSwitch_v'+state.oldEnter)
            //     leaveDom.addEventListener('animationend', () => {
            //         dom.addEventListener('animationend', () => {
            //             state.infoSwitch_v = val
            //         })
            //         let dom = document.querySelector('infoSwitch_v'+enter)
            //         dom.classList.add(dom.dataset.ani)
            //     })
            //     leaveDom.classList.remove(leaveDom.dataset.ani1).add(leaveDom.dataset.ani2)
            // }else{
            //     let dom = document.querySelector('infoSwitch_v'+enter)
            //     dom.addEventListener('animationend', () => {
            //             state.infoSwitch_v = val
            //         })
            //     dom.classList.add(dom.dataset.ani)
            // }
            // state.oldEnter = enter
        }

        const currTabSwitch = (val) => {
            nextTick(() => {
                // document.documentElement.scrollTop += 1
                if(isPc){
                    const top = document.querySelector('.homeView').scrollTop
                    document.querySelector('.homeView').scrollTop = top + ((Math.random() > 0.5?1:-1))
                }else {
                    const top = pageXOffset || document.documentElement.scrollTop || document.body.scrollTop
                    window.scrollTo(0, top + ((Math.random() > 0.5?1:-1)) )
                }
                
                handleAnimate()
            })
            state.currTab = val
        }

        const currTabSwitchSub = (val,i) => {
            // currTabSwitch(val)
            state.currTabSub = val
            state.infoSwitch_tab = i
        }

        const gotoTop = () => {
            // document.documentElement.scrollTop = 0
            window.scrollTo(0, 0)
        }

        const cache = {}
        const handleAnimate = () => {
            let top = pageXOffset || document.documentElement.scrollTop || document.body.scrollTop  /*document.querySelector('.homeView').scrollTop */
            let vh = document.documentElement.clientHeight
            let dom = document.querySelectorAll(".animate__animated")
            console.log('.aab offsetTop', document.querySelector('.aab').getBoundingClientRect().top, top )

            Array.prototype.slice.call(dom).forEach((v, i) => {
                // if(top + vh > v.offsetTop){
                if(v.getBoundingClientRect().top < vh){
                    let delay = v.dataset.delay
                    if(delay){
                        cache[i] = setTimeout(() => {
                            v.style.opacity = 1
                            v.classList.add(v.dataset.ani)
                        }, delay)
                    } else {
                        v.style.opacity = 1
                        v.classList.add(v.dataset.ani)
                    }
                }else{
                    cache[i] && window.clearInterval(cache[i])
                    v.classList.remove(v.dataset.ani)
                    v.style.opacity = 0
                }
            })
        }

        const router = useRouter()
        const gotopage = (item) => {
            if(item.name2){
                let link = ''
                switch(item.name2){
                    case 'token_im':
                        link = 'https://token.im/'
                        break
                    case 'trustwallet_com':
                        link = 'https://trustwallet.com/'
                        break
                    case 'ownbit_io':
                        link = 'https://ownbit.io/'
                        break
                    case 'trolink_org':
                        link = 'https://trolink.org/'
                        break
                    case 'bitpie_com':
                        link = 'https://bitpie.com/'
                        break
                    case 'huobi_com':
                        link = 'https://www.huobiwallet.com/'
                        break
                }
                return helper.toOutLink(link)
            }
            if(state.lang == 'en' && (item.name == 'gate_io' || item.name == 'huobi_com')){
                // const { href } = 
                router.push({path: '/imgPage', query: {name: item.name, lang: state.lang}})
                // window.open(href, '_blank')
                return
            }
            if(item.link){
                let link = ''
                if(item.name == 'gate_io'){
                    if(state.lang == 'cn'){
                        link = 'https://www.gate.io/cn/help/guide'
                    }else if(state.lang == 'cn_tw'){
                        link = 'https://www.gate.io/tw/help/guide'
                    }else {
                        link = 'https://www.gate.io/help/guide'
                    }
                } else if(item.name == 'huobi_com'){
                    if(state.lang == 'cn'){
                        link = 'https://www.huobi.com/support/zh-cn/list/360000010372'
                    }else if(state.lang == 'cn_tw'){
                        link = 'https://www.huobi.com/support/zh-hk/list/360000010372'
                    }else {
                        link = 'https://www.huobi.com/support/en-us/list/360000010372'
                    }
                } else if(item.name == 'binance_com'){
                    if(state.lang == 'cn'){
                        link = 'https://academy.binance.com/zh/articles/binance-beginner-s-guide'
                    }else if(state.lang == 'cn_tw'){
                        link = 'https://academy.binance.com/zt/articles/binance-beginner-s-guide'
                    }else {
                        link = 'https://academy.binance.com/en/articles/binance-beginner-s-guide'
                    }
                } else if(item.name == 'okex_com'){
                    if(state.lang == 'cn'){
                        link = 'https://www.okex.com/support/hc/zh-cn/sections/360000033031-新手必读'
                    }else if(state.lang == 'cn_tw'){
                        link = 'https://www.okex.com/support/hc/zh-tw/sections/360000033031-%E6%96%B0%E6%89%8B%E5%BF%85%E8%AF%BB'
                    }else {
                        link = 'https://www.okex.com/support/hc/en-us/sections/360000033031-Getting-Started'
                    }
                } else if(item.name == 'zb_com'){
                    if(state.lang == 'cn'){
                        link = 'https://m.zb.com/cn/index/'
                    }else if(state.lang == 'cn_tw'){
                        link = 'https://m.zb.com/cn/index/'
                    }else {
                        link = 'https://m.zb.com/en/index/?setting=1'
                    }
                }
                // const sub = window.open('', '_blank')
                // sub.location.href = link
                helper.toOutLink(link)
            }else {
                router.push({path: '/imgPage', query: {name: item.name, lang: state.lang}})
            }
        }
         //apppid        newaree（998866）,k8hash（888666111）
        //url   https://webclip.bnd6.com
        
        const anchorPoint = (selector) => {
            document.querySelector(selector).scrollIntoView(true)
        }

        const download = () => {
            if(!localStorage.getItem('token')){
                router.push('/login')
                return
            }
            const isIOS = window.navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
            if(isIOS) {
                requestTwoMoblieConfig('https://webclip.bnd6.com/', state.ios_key, general_id.value)
            }else {
                const url = window['downloadAndroid']
                const newWindow = window.open('', '_blank')
                setTimeout(() => {
                    newWindow.location.href = url
                }, 100)
            }
        }

        function copyHandle(val){
            const NumClip=document.querySelector(val);
            // const NumClip = document.createElement('input');
            // NumClip.style="position:absolute;left:9999px;top:-9999px;"
            const NValue=NumClip.value //= val;
            const valueLength = NValue.length;
            selectText(NumClip, 0, valueLength);
            if(document.execCommand('copy', false, null)){
                document.execCommand('copy', false, null)// 执行浏览器复制命令
                console.log("已复制,赶紧分享给朋友吧");
            }else{
                console.log("不兼容");
            }
            Toast.success(t('复制成功'))
        }
        // input自带的select()方法在苹果端无法进行选择，所以需要自己去写一个类似的方法
	    // 选择文本。createTextRange(setSelectionRange)是input方法
	    function selectText(textbox, startIndex, stopIndex) {
            if(textbox.createTextRange) {//ie
                const range = textbox.createTextRange();
                range.collapse(true);
                range.moveStart('character', startIndex);//起始光标
                range.moveEnd('character', stopIndex - startIndex);//结束光标
                range.select();//不兼容苹果
            }else{//firefox/chrome
                textbox.setSelectionRange(startIndex, stopIndex);
                textbox.focus();
            }
	    }


        const langChange = (lang) => {
            state.lang = lang
            vantLocales(lang)
            state.isDown = false
        }

        const panelRef = ref(null)
        const closePanel = () => {
            const dom = document.querySelector('.van-popup')
            // dom.style.left='10%'
            // dom.style.top ="20%"
            // dom.classList.add('animate__bounceIn')
            // dom.classList.add('animate__bounceOut')
            // window.setTimeout(() => 
            dom.parentElement.removeChild(dom)
            state.panelShow = false
            // , 1000)
        }

        const nameMap = {1001: '幸运哈希', 1002: '哈希牛牛', 1003: '哈希数字', 1004: '哈希百家乐'}
        const getGameName = (id) => {
            return nameMap[id]
        }

        const isPc = inject('isPc')
        onMounted(() => {
            setTimeout(() => {
                const dom = (isPc?document.querySelector('.homeView') : window)
                handleAnimate()
                dom.addEventListener('scroll', handleAnimate)
            }, 10)
        })

        return {
            ...toRefs(state),
            panelRef,
            closePanel,
            infoSwitchClick,
            gotoTop,
            gotopage,
            currTabSwitch,
            anchorPoint,
            copyHandle,
            langChange,
            download,
            requestTwoMoblieConfig,

            currTabSwitchSub,
            carouse_list,
            pop_tip_list,
            panelShow2,
            logoUrl,
            getGameName,
            isPc
        }
    }
}
</script>
<style lang="less" scoped>
// .animate__animated{transition: all 1000;}
.animate__animated{opacity: 0;}
.homeView{
    background-color: #0F0E0F;padding-bottom: 114px;padding-top: 88px;
    transition: all 500;color:#DADADA;-webkit-overflow-scrolling:touch;position:relative;
    // height: calc(100vh + 4px);
    overflow-y: scroll;overflow-x:hidden;
    .page_header{
        background-color: #000;
        height: 88px;position:fixed;top:0;width: 100%;
        left:50%;transform: translateX(-50%);
        padding-left: 32px;padding-right: 32px;
        display: flex;justify-content: space-between;align-items: center;z-index: 20;
        .icon{
            width: 145px;height: 37px;
        }
        .xin_icon{width: 131px;height: 37px;}
        .right{
            display: flex;align-items:center;justify-content:flex-end;flex:1;
            i{display: inline-block;width: 28px;height: 28px;margin-right: 8px;}
            a{
                font-size: 24px;color: #917B4C;display: flex;align-items: center;text-decoration: none;
                white-space: nowrap;
            }
        }
        .process{
            // width: 132px;white-space: pre-wrap;
            i{background:url("@/assets/image/_liucheng@2x.png") left top no-repeat;background-size: contain;flex-shrink: 0;}
        }
        .question{
            margin-left: 30px;
            // i{background:url("@/assets/image/_commonQ@2x.png") left top no-repeat;background-size: contain;flex-shrink: 0;}
            i{background:url("@/assets/image/download_icon@2x.png") left top no-repeat;background-size: contain;flex-shrink: 0;}
        }
        .popdown_panel{
            position: relative;margin-left: 30px;
            .select{
                width: 88px;height: 46px;display: flex;align-items: center;justify-content: center;
                border-radius: 27px;background-color: #222122;
            }
            .flag{
                display: inline-block;width: 28px;height: 20px;margin-right: 6px;
            }
            label{font-size: 20px;color:#917B4C}
            .select{
                label{margin-right: 6px;}
                .angle{
                    display: inline-block;
                }
                .upAngle{
                    width: 0;height: 0;border-top: 12px solid #917B4C;border-left: 8px solid transparent;border-right: 8px solid transparent;
                }
                .downAngle{
                    width: 0;height: 0;border-bottom: 12px solid #917B4C;border-left: 8px solid transparent;border-right: 8px solid transparent;
                }
            } 
            .down{
                width: 188px;padding: 24px 22px 4px 22px;border-radius: 27px;background-color: #222122;
                position: absolute;z-index: 10;left: -70px;top: 56px;
                .item{
                    display: flex;align-items: center;margin-bottom: 24px;
                }
            }
            .cn_flag{
                background: url('@/assets/image/cn_flag.png') no-repeat;background-size: contain;
            }.en_flag{
                background: url('@/assets/image/en_flag.png') no-repeat;background-size: contain;
            }
            .cn_tw_flag{
                background: url('@/assets/image/cn_tw_flag.png') no-repeat;background-size: contain;
            }
            .ja_flag{
                background: url('@/assets/image/ja_flag.png') no-repeat;background-size: contain;
            }
            .ko_flag{
                background: url('@/assets/image/ko_flag.png') no-repeat;background-size: contain;
            }
            .th_flag{
                background: url('@/assets/image/th_flag.png') no-repeat;background-size: contain;
            }
            .vi_flag{
                background: url('@/assets/image/vi_flag.png') no-repeat;background-size: contain;
            }
        }
    }
    .page_header_pc{
        max-width: 1000px;
    }
    .page_header_en{
        padding-right: 20px;
        .question{margin-left: 12px;}
        .popdown_panel{margin-left: 12px;}
    }
    .lottery_guide{
        padding-top: 64px;
        .tip_ct{
            text-align: center;margin-bottom:30px;
            img {
                max-height: 150px;
            }
        }
        .secret_coin_tabs{
            position: relative;display: flex;margin-bottom: 64px;transition:left .8s;left:0%;
            .gameListItem1{width: 100%;justify-content: center;background-color: #222122;color: #E1B85D;}
            .gameListItem2{
                width: 50%;background-color: #222122;text-align: center;justify-content: center;
                // &:nth-child(1){
                //     text-align: right;padding-right: 55px;justify-content: flex-end;
                // }
                // &:nth-child(2){
                //     padding-left: 55px;
                // }
            }
            .gameListItem3{width: 33.33%;justify-content: center;background-color: #222122;flex-shrink: 0;line-height: 0.9}
            .gameListItem4{width: 30%;justify-content: center;background-color: #222122;flex-shrink: 0;}
            >div{
                display: flex;align-items:center;height: 88px;font-size: 36px;color: #7A663E;text-align: center;
                background-color: #222122;font-family: yiixnchongfenghao;font-weight: bold;line-height: 1;cursor: pointer;
            }
            .active{
                color: #E1B85D;background-color: #AB6D06;
            }
           .angle_left{
                position: absolute;left:50%;top: 0;width: 0;height: 0;border-color: transparent #AB6D06;
                border-width: 0 0 87px 20px;border-style: solid;
            }
            .angle_right{
                position: absolute;left:calc(50% - 20px);top: 0;width: 0;height: 0;border-color: transparent #AB6D06;
                border-width: 87px 20px 0 0 ;border-style: solid;
            }
            .hash_lucky{
                display: inline-block;background: url("@/assets/image/_hash_lucky2@2x.png") no-repeat;background-size: contain;
                width: 200px;height: 40px;
            }
            .hash_niuniu{
                display: inline-block;background: url("@/assets/image/_hash_niuniu2@2x.png") no-repeat;background-size: contain;
                width: 200px;height: 40px;
            }
            .secret_coin_tab_cn{
                .hash_lucky{background-image: url("@/assets/image/cn/_hash_lucky2@2x.png")}
                .hash_niuniu{background-image: url("@/assets/image/cn/_hash_niuniu2@2x.png")}
            }
            .secret_coin_tab_en{
                .hash_lucky{background-image: url("@/assets/image/en/_hash_lucky2@2x.png")}
                .hash_niuniu{background-image: url("@/assets/image/en/_hash_niuniu2@2x.png")}
            }
            .secret_coin_tab_cn_tw{
                .hash_lucky{background-image: url("@/assets/image/cn_tw/_hash_lucky2@2x.png")}
                .hash_niuniu{background-image: url("@/assets/image/cn_tw/_hash_niuniu2@2x.png")}
            }
            .secret_coin_tab_cn.active{
                background-color: #AB6D06;
                .hash_lucky{
                    background-image: url("@/assets/image/cn/_hash_lucky@2x.png");
                }
                .hash_niuniu{
                    background-image: url("@/assets/image/cn/_hash_niuniu@2x.png");
                }
            }
            .secret_coin_tab_en.active{
                background-color: #AB6D06;
                .hash_lucky{
                    background-image: url("@/assets/image/en/_hash_lucky@2x.png");
                }
                .hash_niuniu{
                    background-image: url("@/assets/image/en/_hash_niuniu@2x.png");
                }
            }
            .secret_coin_tab_cn_tw.active{
                background-color: #AB6D06;
                .hash_lucky{
                    background-image: url("@/assets/image/cn_tw/_hash_lucky@2x.png");
                }
                .hash_niuniu{
                    background-image: url("@/assets/image/cn_tw/_hash_niuniu@2x.png");
                }
            }
        }
        .address_info{
            width: 686px;
            height: 126px;
            background: #151516;
            border-radius: 63px;display: flex;align-items: center;justify-content: space-between;
            padding-left: 47px;padding-right: 10px;margin:0 auto 66px auto;
            .addr{
                margin-right: 18px;flex-shrink:0;flex-grow: 1;
                p{
                    font-size: 28px;color: #DADADA;max-width:405px;white-space:pre-wrap;word-break:break-all;
                    &:nth-child(1){
                        margin-bottom: 16px;
                    }
                }
            }
            .copy_btn{
                width: 206px;
                height: 106px;
                background: linear-gradient(180deg, #A86800 0%, #EFCA72 100%);
                border-radius: 53px;
                font-size: 28px;color: #000;font-weight: 600;
                display: flex;align-items: center;justify-content: center;flex-shrink: 0;
                padding: 0 12px;line-height: 0.9;text-align: center;
            }
        }
        .guide_tip{
            text-align: center;margin-bottom: 68px;
            img{/*width: 442px;*/max-height: 56px;}
        }
        .guide{
            padding: 0 32px;
            .title_name{
                color:#EFCA72;font-size: 28px;display:flex;
            }
            .guide_name, .lottery_name{/*width: 217px;*/height: 75px;}
            .txt{
                color:#DADADA;;font-size: 28px;line-height: 40px;
                margin-bottom: 40px;
                background-color: #151516;padding: 28px 32px;
            }
            .txt2{
                color: #DADADA;font-size: 28px;line-height: 40px;
                display: flex;justify-content: space-between;padding: 28px;
                background-color: #151516;width: 100%;
                .left, .right{
                    // margin-right: 20px;
                    padding: 26px 9px 26px 20px;width: 50%;
                }
                p{color:#dadada}
                em{color: rgba(255, 203, 97, 1);font-style: normal;}
                .no{color: #999}
            }
            .dot{padding-left: 42px;}
        }
    }
    .progress{
        padding-top: 105px;
        .tip_ct{
            margin-bottom: 32px;text-align:center;
            img{
                /*width:240px;*/max-height: 138px;
            }
        }
        .info{
            display: flex;justify-content: space-between; align-items: flex-start;margin-bottom: 39px;margin: 0 70px 40px;
            .circle{
                width: 56px;height: 56px;border-radius: 50%;background-color: #393223;
                font-size: 36px;color:#151516;margin-bottom: 13px;display: block;text-align: center;line-height: 56px;
            }
            p{font-size: 24px;color:#796742;}
            .item{
                display: flex;justify-content: center;align-items: center;flex-direction: column;text-align: center;
                width: 25%;
            }
            .active{
                .circle{background: #818181 linear-gradient(180deg, #A86800 0%, #EFCA72 100%);color:#5F3627;scale: 1.5;}
                p{color:#E0B55A;}
            }
        }
        .infoSwitch_v_1, .infoSwitch_v_2{
            background-color: #0F0E0F;position: relative;z-index: 1;
            .title_img{
                margin-left: 32px;margin-bottom: 30px;width: 491px;height: 76px;
            }
            .platform{
                padding: 0 32px;
                .head{background-color: #0B0B0B;color:#DADADA;font-size: 24px;font-weight: bold;}
                .item{background-color: #151516;color:#DADADA;font-size: 24px;
                    .plate_img{max-width: 124px;max-height: 40px;}
                }
                .head, .item{
                    display: flex;height: 72px;align-items:center;
                    >div{
                        text-align: center;color:#DADADA;
                        a{color: #FFCB61;font-size: 24px;text-decoration:underline;}
                        &:nth-child(1){
                            width: 30%;
                        }
                        &:nth-child(2){
                            width: 40%;
                        }
                        &:nth-child(3){
                            width: 30%;
                        }
                    }
                }
            }
        }
    }
    .common_question{
        padding-top: 44px;
        .tip_ct{
            padding: 64px 0 37px 0;text-align: center;
            img{/*width: 240px;*/max-height: 138px;}
        }
        .question_item{
            background-color: #1A1A1A;
            padding: 24px 24px 50px;margin: 0 32px 24px;
            border-radius: 12px;
            .header{           
                font-size: 28px;color: #DADADA;font-weight: 500;text-align: justify;margin-bottom: 26px;line-height: 40px;
            }
            .content{
                font-size: 28px;color: #DADADA;margin-bottom: 26px;line-height: 40px;
                em{font-style: normal;color: #FFCB61;}
            }
            .link{
                font-size: 24px;color: #FFCB61;
            }
        }
    }
    .footer{
        position: fixed;bottom: 0;height: 144px;background-color: #fff;padding: 0 24px;
        display: flex;align-items: center;justify-content: space-between;z-index: 20;
        >div{
            width: 341px;height: 88px;display: flex;align-items: center;justify-content: center;border-radius: 44px;font-size: 28px;font-weight: 600;
        }
        .customer_btn{
            background-color: #0F0E0F;margin-right: 20px;color:#E5BC62;
            i{
                margin-right: 11px;display: inline-block;width:48px;height: 48px;background: url("@/assets/image/_constract.png");background-size: contain;
            }
        }
        .constract_btn{
            background-color: #A67A29;color: #FFFFFF;
            i{margin-right: 23px;display: inline-block;width:40px;height: 47px;background: url("@/assets/image/_customer.png");background-size: contain;}
        }
    }
    .panel_ct{
        padding: 64px 40px 48px;position: relative;
        .p_title{
           color:#000000;text-align: center;margin-bottom: 44px;font-size: 36px;font-weight: bold;
        }
        .close{
            i{
                width: 30px;height: 30px;background: url("@/assets/image/_close@2x.png") center center no-repeat;background-size: contain;
            }
            display: inline-block;width: 90px;height: 90px;display: flex;justify-content: center;align-items: center;
            position: absolute;top: 0px;right: 0px;background-color:rgba(0,0,0,0);
        }
        .content{
            margin-bottom: 44px;text-align: center;
            .img_ct{
                margin-bottom: 32px;
                img{width: 128px;}
            }
            p{
                font-size: 28px;color:#000;line-height: 1;margin-bottom: 40px;
                &:last-child(1){margin-bottom: 0;}
            }
        }
        .btn{
            width: 480px;
            height: 84px;
            background: #AB6D06;margin: auto;
            border-radius: 42px;font-size: 32px;color:#fff;display: flex;align-items: center;justify-content: center;
            padding: 0 15px;line-height: 0.9;text-align: center;
        }
    }
    .infoSwitch_v_3{
        text-align: center; background-color: #0F0E0F;
        .title_img{text-align: left;margin-bottom: 0;margin-left: 32px;width: 491px;height: 76px;}
        .content{
            padding-top: 102px;padding-bottom:97px;margin: 0 32px;background-color: #151516;
        }
        .tip_mark{color: #DADADA;font-size: 24px;margin-bottom: 45px;}
        .infoSwitch_tabs{
            margin-bottom: 40px;display:flex;justify-content:center;
            span{
                color: #7A663E;font-size: 32px;margin-right: 32px;
                &:nth-last-child(1){margin-right: 0px;}
            }
            .active{color: #FFCB61; padding-bottom: 10px;border-bottom: 6px solid #E5BC62;border-radius: 4px;
            span{color:#FFCB61}}
        }
        .infoSwitch_item{
            display: flex;flex-direction:column;
            p{color: #dadada;font-size: 24px;
                &:nth-child(1){margin-bottom: 10px;}
                &:nth-child(2){margin-bottom: 28px;}
            }
            .copy_btn{
                width: 178px;height: 64px;text-align: center;
                background: linear-gradient(180deg, #A86800 0%, #EFCA72 100%);
                border-radius: 53px;margin: auto;
                color: #000000;font-size: 24px;display: flex;align-items: center;justify-content: center;
                padding: 0 12px;line-height: 0.9;text-align: center;
            }
        }
    }
    .infoSwitch_v_4{
        text-align: center; background-color: #0F0E0F;
        .title_img{
            text-align: left;margin-bottom: 0;margin-left: 32px;width: 491px;height: 76px;
        }
        .content{
            padding-top: 121px;padding-bottom:97px;margin: 0 32px;background-color: #151516;
        }
        .tip_mark{
            font-size: 24px;color:#796742;margin-bottom: 64px;
        }
        .icon_ct{
            text-align: center;
            img{
                width: 232px;height: 220px;
            }
        }
    }
    textarea{
        background: rgba(0,0,0,0);
        border: transparent;
        color: #dadada;
        width: 100%;
        white-space: pre-wrap;
        text-align: center;
    }
    .partner{
        padding-top: 64px;padding-bottom: 58px;
        margin: 0 32px;
        .img_ct{
            text-align:center;margin-bottom:  48px;
            img{
                height: 138px;
            }
        }
        .item_ct{
            position: relative;height: 458px;
            .row{
                position: absolute;
                width: 100%;left: 50%;transform: translateX(-50%);
                display: flex; 
                align-items: center;justify-content:center;
                img{
                    width: 224px;height: 224px;margin-right: 8px;
                    &:nth-last-child(1){
                        margin-right: 0;
                    }
                }
                &:nth-child(1){
                    top: 0;
                }
                &:nth-child(2){
                    top: 120px;
                }
                 &:nth-child(3){
                    top: 240px;
                }
            }
        }
        >img{
            width: 100%;
        }
    }
    
    :deep{
        .van-popup{
            border-radius: 24px;
        }
        .van-swipe__indicators{display: none;}
        .xxx{
            color: #EFCA72;
        }
        .yyy{color: #ff0000;}
        .van-popup {
            width: 80%;
            top: 25%;
            left: 10%;
            transform: translate(-50%,-50%);
        }
        .van-swipe-item img{width: 100% !important;height: auto !important;object-fit: contain;}
        .van-swipe-item{display:flex;align-items: flex-start;}
        .van-swipe, .van-swipe__track, .van-swipe-item{height: auto !important;}
    }

    .card-panel-icon{
        float: left;
        font-size: 48px;
    }
}
</style>
