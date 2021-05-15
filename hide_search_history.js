// ==UserScript==
// @name         隐藏搜索历史
// @namespace    http://tampermonkey.net/
// @version      0.4
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

    const deleteCache = []

    function deleteFunc () {
        // 删除按钮的元素
        let elements = document.querySelectorAll(".sbai");
        let deleteElements = []
        let deleteParentElement = []
        elements.forEach(function (element) {
            // 没隐藏的说明可以删除
            if (element.parentElement.style.display !== 'none') {
                let parentElement = element.parentElement.parentElement;
                let textElement = parentElement.querySelector('div > div:nth-child(2) > div:nth-child(1)');
                let textContent = textElement.textContent;
                if (textElement && textContent && deleteCache.indexOf(textContent) === -1) {
                    deleteElements.push(element)
                    deleteParentElement.push(parentElement)

                    deleteCache.push(textContent)
                }
            }
        })
        console.info("可删除元素%d个", deleteElements.length)
        for (let i = 0; i < deleteElements.length; i++) {
            deleteParentElement[i].style.display = 'none'
            deleteElements[i].click()
            setTimeout(function () {
                deleteParentElement[i].style.display = ''
            }, 1000)
            console.info("删除搜索记录", deleteParentElement[i], deleteParentElement[i].textContent)
        }
    }

    let inputElements = document.getElementsByName("q")
    for (let i = 0; i < inputElements.length; i++) {
        inputElements[i].oninput = function () {
            setTimeout(deleteFunc, 150)
        }
    }

    let target = document.querySelector(".UUbT9")
    if (target != null) {
        let observer = new MutationObserver(function (mutations, observer) {
            deleteFunc()
        })
        observer.observe(target, {
            characterData: true,
            childList: true,
            subtree: true
        })
    }

})()
