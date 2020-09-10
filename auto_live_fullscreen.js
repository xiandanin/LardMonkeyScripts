// ==UserScript==
// @name         直播平台自动网页全屏/关闭弹幕
// @namespace    http://tampermonkey.net/
// @homeurl      https://github.com/xiandanin/LardMonkeyScripts
// @homeurl      https://greasyfork.org/zh-CN/scripts/377547
// @version      1.1
// @description  直播平台进入直播间后自动网页全屏和关闭弹幕
// @author       xiandanin
// @match        https://www.douyu.com/*
// @match        https://www.panda.tv/*
// @match        https://www.huya.com/*
// @match        https://cc.163.com/*
// @grant        none
// ==/UserScript==

(function () {
    let time = 0

    /**
     * 需要的节点加载完成的检测
     */
    function lazyLoadingDetection (selectors, callback) {
        const intervalTime = 300
        let interval = setInterval(function () {
            //检测节点已经加载完成或者超过最大检测时间 都停止
            if (document.querySelector(selectors)) {
                console.log('%dms，检测节点加载完成，可以执行操作', time)
                clearInterval(interval);
                callback()
            } else if (time >= 8000) {
                console.log('%dms，计时器超时', time)
                clearInterval(interval);
            }
            time += intervalTime;
        }, intervalTime);
    }

    function checkAndClickSwitch (delayClickTime, checkFunc, ...clickSelectors) {
        lazyLoadingDetection(clickSelectors[0], function () {
            for (let i = 0; i < clickSelectors.length; i++) {
                const clickElement = document.querySelector(clickSelectors[i]);
                // 检查当前状态是否需要点击
                if (checkFunc(clickElement)) {
                    setTimeout(function () {
                        clickElement.click()
                    }, delayClickTime)
                }
            }
        })
    }

    const host = window.location.host
    if (host.indexOf("douyu.com") !== -1) {
        //斗鱼
        checkAndClickSwitch(0, clickElement => {
            // 检测是开关状态
            return !clickElement.classList.contains("removed-9d4c42")
            //网页全屏 弹幕
        }, ".wfs-2a8e83", '.showdanmu-42b0ac')
    } else if (host.indexOf("huya.com") !== -1) {
        //虎牙
        checkAndClickSwitch(0, clickElement => {
            return clickElement.className === 'player-fullpage-btn' || clickElement.className === 'danmu-show-btn'
        }, "#player-fullpage-btn", '#player-danmu-btn')
    } else if (host.indexOf("cc.163.com") !== -1) {
        //cc 点击事件延迟1秒
        checkAndClickSwitch(1000, clickElement => {
            return !clickElement.classList.contains("theater") || !clickElement.classList.contains("on") || !clickElement.classList.contains("selected")
            //CC需要先检测其它开关
        }, '.ban-effect-list > li:nth-child(3)', '.ban-effect-list > li:nth-child(4)', '.ban-effect-list > li:nth-child(5)', ".video-player-theater-control", '.video-player-comment')
    }


})();
