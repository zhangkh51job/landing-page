export const parseParam = () => {
    let str = window.location.href.split('?')[1]
    if(!str) return {}
    const arr = str.split('#')
    const result = {}
    arr.forEach((item) => {
        if(item.includes('/')) return
        const arrSub = item.split('&')
        arrSub.forEach((item2) => {
            const arr2 = item2.split('=')
            if(arr2[0])
                result[arr2[0]] = arr2[1]
        })
    })
    return result
}

export const getQrcodeUrl = (data) => {
    const obj = parseParam()
    let str = ''
    for(let key in obj){
        if(key == 'id' || key == 'ic' || key == 'packType') continue
        str = key+'='+obj[key]+'&'
    }
    str = str + 'ic=' + data.uid+'&id=' + data.general_id + '&ch=' + data.pack_no

    str = (window.shareWeb?window.shareWeb:window.location.href.split('#')[0].split('?')[0]) + '?' +str

    return str
}


const numAdjust = (num) => {
    if(num < 10) return '0'+num
    return num
}
export const timeHandle = (num, fullyear = true, reverse = false) => {
    num = num + ''
    if(num.length < 13) num = Number(num) * 1000
    num = Number(num)
    const date = new Date(num)
    if(reverse){
        return numAdjust(date.getMonth() + 1) +'-' + numAdjust(date.getDate()) +'-'+ date.getFullYear()
    }
    if(fullyear){
        return date.getFullYear() + '/' + numAdjust(date.getMonth() + 1)+'/'+numAdjust(date.getDate()) + ' ' + numAdjust(date.getHours())+':'+numAdjust(date.getMinutes())
    }else {
        return date.getFullYear() + '/' + numAdjust(date.getMonth() + 1)+'/'+numAdjust(date.getDate())
    }
    
}

import {i18n} from '@/assets/lang'
import html2canvas from "html2canvas"
export const photoDom = (dom , callback) => {
    html2canvas(dom,{
        logging: false,
        allowTaint: true,
        scale: window.devicePixelRatio,
        // width: shareContent.clientWidth, //dom 原始宽度
        // height: shareContent.clientHeight,
        scrollY: 0,
        scrollX: 0,
        useCORS: true,
        backgroundColor: '#ffffff',
    }).then(function(canvas){
        // console.log(canvas);
        let imgUrl = canvas.toDataURL( "image/png" );
        var tempLink = document.createElement('a');
        tempLink.style.display = 'none';
        tempLink.href = imgUrl;
        tempLink.setAttribute('download', i18n.global.t('二维码分享'));
        if (typeof tempLink.download === 'undefined') {
            tempLink.setAttribute('target', '_blank');
        }
        document.body.appendChild(tempLink);
        tempLink.click();
        document.body.removeChild(tempLink);
        window.URL.revokeObjectURL(imgUrl);
        
        callback && callback.call()
});
}



