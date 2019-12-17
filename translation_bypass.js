// ==UserScript==
// @name         谷歌翻译绕过代码块
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  让谷歌翻译插件翻译网页的时候，绕过代码块和一些无需翻译的元素
// @author       xiandan
// @homeurl      https://github.com/xiandanin/LardMonkeyScripts
// @homeurl      https://greasyfork.org/zh-CN/scripts/392357
// @match        https://github.com/*
// @match        https://npmjs.com/*
// @match        https://stackoverflow.com/*
// @match        https://*.google.com/*
// @license      MIT
// @grant        none
// ==/UserScript==
/*jshint esversion: 6 */
(function () {
    'use strict'

    const bypassSelectorArray = [
        'pre'
    ]
    if (window.location.hostname.indexOf("github")!==-1) {
        // 如果是github 还需要处理一些别的元素
        const githubSelector = ['.pagehead', '.octotree-sidebar', '.repository-topics-container', '.file-navigation', '.Box-title', '.content']
        bypassSelectorArray.push.apply(bypassSelectorArray, githubSelector)
    }

    bypassSelectorArray.forEach((name) => {
        [...document.querySelectorAll(name)].forEach(node => {
            if (node.className.indexOf('notranslate') === -1) {
                node.classList.add('notranslate')
            }
        })
    })
})()
