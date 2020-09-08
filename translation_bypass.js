// ==UserScript==
// @name         谷歌翻译绕过代码块
// @namespace    http://tampermonkey.net/
// @version      0.3
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

    function noTranslate (array) {
        array.forEach((name) => {
            [...document.querySelectorAll(name)].forEach(node => {
                if (node.className.indexOf('notranslate') === -1) {
                    node.classList.add('notranslate')
                }
            })
        })
    }

    const bypassSelectorArray = [
        'pre'
    ]
    if (window.location.hostname.indexOf("github") !== -1) {
        // 如果是github 还需要处理一些别的元素
        const githubSelector = [
            '.bg-gray-light.pt-3.hide-full-screen.mb-5',
            'summary.btn.css-truncate',
            '.commit-author',
            '.js-navigation-open.link-gray-dark',
            '.Box-title',
            '.BorderGrid-cell > div.mt-3 > a.muted-link',
            '.BorderGrid-cell > ul.list-style-none'
        ]
        bypassSelectorArray.push.apply(bypassSelectorArray, githubSelector)

        //如果还有github的插件 还需要延迟追加一些
        setTimeout(function () {
            const githubPluginSelector = [
                '.github-repo-size-div',
                '.octotree-tree-view'
            ]
            noTranslate(githubPluginSelector)
        }, 3000)
    }
    noTranslate(bypassSelectorArray)
})()
