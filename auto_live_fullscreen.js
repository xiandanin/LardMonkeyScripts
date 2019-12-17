// ==UserScript==
// @name         直播平台自动网页全屏
// @namespace    http://tampermonkey.net/
// @homeurl      https://github.com/xiandanin/LardMonkeyScripts
// @homeurl      https://greasyfork.org/zh-CN/scripts/377547
// @version      0.7
// @description  直播平台进入直播间后自动网页全屏; 熊猫TV需要切换成H5播放器
// @author       xiandan
// @match        https://www.douyu.com/*
// @match        https://www.panda.tv/*
// @match        https://www.huya.com/*
// @grant        none
// ==/UserScript==

(function () {
    var intervalTime = 500;
    var fullscreenComplete = false;
    var executeTime = 0;
    var interval;

    let url = window.location.host
    if (url.indexOf("douyu.com") !== -1) {
        //斗鱼延迟执行才有效
        setTimeout(function(){clickLivePlatform(true, "showdanmu-42b0ac", "wfs-2a8e83")}, 6000)
    } else {
        interval = setInterval(applyLivePlatform, intervalTime);
    }

    function clickLivePlatform(isClassName, danmu, fullscreen) {
        console.log("已经执行" + executeTime + "ms，网页全屏：" + fullscreenComplete + "，任务已清除")
        if (isClassName) {
            if (document.getElementsByClassName(danmu).length > 0) {
                document.getElementsByClassName(danmu)[0].click();
            }
            if (document.getElementsByClassName(fullscreen).length > 0) {
                document.getElementsByClassName(fullscreen)[0].click();
                fullscreenComplete = true
            }
        } else {
            if (document.getElementById(danmu) != null) {
                document.getElementById(danmu).click();
            }
            if (document.getElementById(fullscreen) != null) {
                document.getElementById(fullscreen).click();
                fullscreenComplete = true
            }
        }
    }

    function applyLivePlatform() {
        executeTime += 500;
        if (executeTime >= 5000 || fullscreenComplete) {
            clearInterval(interval);
            console.log("已经执行" + executeTime + "ms，网页全屏：" + fullscreenComplete + "，任务已清除")
            return
        } else {
            console.log("已经执行" + executeTime + "ms，网页全屏：" + fullscreenComplete + "，任务已清除")
        }

        if (url.indexOf("huya.com") != -1 && document.getElementById("player-video") != null) {
            document.styleSheets[document.styleSheets.length-1].insertRule('.chat-room__list .name { max-width: 100%; }')
            document.styleSheets[document.styleSheets.length-1].insertRule('.week-rank__bd .week-rank-name { max-width: 100%; }')
            clickLivePlatform(false, "player-danmu-btn", "player-fullpage-btn")
        } else if (url.indexOf("panda.tv") != -1 && document.getElementsByClassName("h5player-player-core-container").length > 0) {
            clickLivePlatform(true, "h5player-control-circlebar-btn h5player-control-circlebar-danmu  open-switch", "h5player-control-bar-btn h5player-control-bar-fullscreen")
        } else {
            fullscreenComplete = true
        }
    }

})();
