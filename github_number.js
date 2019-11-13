// ==UserScript==
// @name         Github显示具体Star数字
// @namespace    http://tampermonkey.net/
// @homeurl      https://github.com/dengyuhan/LardMonkeyScripts
// @homeurl      https://greasyfork.org/zh-CN/scripts/391285
// @version      0.2
// @description  让Star/Fork等显示完整的数字
// @author       denghaha
// @match        https://github.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict'

    function extractNumber (str) {
        let reg = /\d+/
        let match = reg.exec(str)
        return parseInt(match ? match[0] : str)
    }

    function formatNumber (num) {
        return num.toString().replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,")
    }

    let pageheadActions = document.getElementsByClassName("pagehead-actions")
    if (pageheadActions && pageheadActions.length > 0) {
        let socialCountNode = pageheadActions[0].getElementsByClassName("social-count")
        if (socialCountNode) {
            for (let i = 0; i < socialCountNode.length; i++) {
                let countStr = socialCountNode[i].getAttribute("aria-label")
                if (countStr) {
                    socialCountNode[i].innerText = formatNumber(extractNumber(countStr))
                }
            }
        }
    }
})()
