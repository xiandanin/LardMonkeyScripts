// ==UserScript==
// @name         隐藏搜索历史
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  隐藏搜索引擎下拉框的历史记录，目前仅适配Google
// @homeurl      https://github.com/dengyuhan/LardMonkeyScripts
// @homeurl      https://greasyfork.org/zh-CN/scripts/392368
// @author       xiandanin
// @include      *://encrypted.google.*/search*
// @include      *://*.google*/
// @include      *://*.google*/search*
// @include      *://*.google*/webhp*
// @exclude      *://*.google*/sorry*
// @grant        none
// ==/UserScript==
(function () {
    'use strict'

    function findTagByParent (element, tagName) {
        let currentElement = element
        while (currentElement.tagName.toLowerCase() !== tagName.toLowerCase() && currentElement !== document.body) {
            currentElement = currentElement.parentNode
        }
        return currentElement !== element ? currentElement : null
    }

    function deleteFunc () {
        let deleteElements = Array.from(document.getElementsByClassName("sbai sbdb"))
        deleteElements.filter(element => {
            return element.style.display !== 'none'
        }).flatMap(element => {
            return findTagByParent(element, 'li')
        }).forEach(element => {
            console.info("删除搜索记录", element.querySelector("span").innerText)
            element.remove()
        })
    }

    let inputElements = document.getElementsByName("q")
    for (let i = 0; i < inputElements.length; i++) {
        inputElements[i].oninput = function () {
            setTimeout(deleteFunc, 150)
        }
    }

    let target = document.getElementsByClassName("UUbT9")[0]
    let observer = new MutationObserver(function (mutations, observer) {
        deleteFunc()
    })
    observer.observe(target, {
        characterData: true,
        childList: true,
        subtree: true
    })

})()
