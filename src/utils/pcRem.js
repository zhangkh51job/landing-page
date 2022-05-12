
!window.navigator.userAgent.match(
    /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
) && (function (doc, win) {
    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function () {
            var clientWidth = docEl.clientWidth;
            if (!clientWidth) return;
            var fontSize = 14;
            if (clientWidth >= 640) {
                fontSize = 100
            } else {
                // docEl.style.fontSize = 100 * (clientWidth / 750) + 'px';
                fontSize = 100 * (clientWidth / 750)
                var div = document.createElement('div');
                div.style.width = '1.4rem';
                div.style.height = '0';
                document.body.appendChild(div);
                var ideal = 140 * clientWidth / 750;
                var rmd = (div.clientWidth / ideal);
                if (rmd > 1.2 || rmd < 0.8) {
                    docEl.style.fontSize = 100 * (clientWidth / 750) / rmd + 'px';
                    // fontSize = 100 * (clientWidth / 750) / rmd
                }
                document.body.removeChild(div);
            }
            if(!window.navigator.userAgent.match(
                /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
            )){
                fontSize = 40
            }
            docEl.style.fontSize = fontSize+'px';
        }
    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false)
    doc.addEventListener('DOMContentLoaded', recalc, false)
})(document, window)