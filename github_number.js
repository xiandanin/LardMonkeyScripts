// ==UserScript==
// @name         Github显示具体Star数字
// @namespace    http://tampermonkey.net/
// @homeurl      https://github.com/xiandanin/LardMonkeyScripts
// @homeurl      https://greasyfork.org/zh-CN/scripts/391285
// @version      0.5
// @description  让Star/Fork等显示完整的数字
// @author       xiandan
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

    function applyNodeNumber () {
        // 过滤出需要设置 并且有详细数字的节点
        const socialCountNodes = document.querySelectorAll(".social-count")
        if (socialCountNodes && socialCountNodes.length > 0) {
            for (let i = 0; i < socialCountNodes.length; i++) {
                const node = socialCountNodes[i]
                let countStr = node.getAttribute("aria-label")
                if (countStr) {
                    if (/^\d+$/.test(node.innerText)) {
                        // 如果已经是纯数字
                    } else {
                        const countStr = node.getAttribute("aria-label")
                        node.innerText = formatNumber(extractNumber(countStr))
                    }
                }
            }
        }
    }


    const main = document.querySelector('main')
    if (main != null) {
        const observer = new MutationObserver(function (mutations, observer) {
            applyNodeNumber()
        })
        observer.observe(main, {
            childList: true
        })
        applyNodeNumber()
    }

})()
