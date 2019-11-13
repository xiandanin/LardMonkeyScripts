// ==UserScript==
// @name         自动采集磁力搜解析规则
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动采集磁力搜解析规则
// @homeurl      https://github.com/dengyuhan/LardMonkeyScripts
// @author       denghaha
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
  'use strict'

  // 分析出关键词
  let inputNodes = document.getElementsByTagName('input')
  let keyword
  for (let i = 0; i < inputNodes.length; i++) {
    const value = inputNodes[i].value
    if (value) {
      keyword = value
      break
    }
  }
  if (!keyword) {
    return
  }

  // 遍历所有超链接 找出第一个包含关键词的节点
  let aNode
  let aNodes = document.getElementsByTagName('a')
  for (let i = 0; i < aNodes.length; i++) {
    if (aNodes[i].innerText.indexOf(keyword) !== -1) {
      aNode = aNodes[i]
      break
    }
  }
  if (!aNode) {
    return
  }

  const dateRegx = '(\\d{4})-(\\d{1,2})-(\\d{1,2})|ago|前'
  const sizeRegx = '\\d.*(字节|bytes|KB|MB|GB|TB|PB|EB|ZB|YB)'
  const magnetRegx = '(magnet:\\?xt).*'
  const hotRegx = '^\\d+$'

  // 递归向上找出group
  function findItemGroupNode (node) {
    const parentNode = node.parentNode
    const regx = new RegExp(`(?=[\\s\\S]*${keyword})(?=[\\s\\S]*(${dateRegx}))(?=[\\s\\S]*(${sizeRegx}))^[\\s\\S]*$`, 'gi')
    if (regx.test(parentNode.innerHTML)) {
      return parentNode
    } else {
      return findItemGroupNode(parentNode.parentNode)
    }
  }

  const childNodes = []

  function findAllChildNode (node) {
    let children = node.children
    for (let i = 0; i < children.length; i++) {
      // 递归遍历
      childNodes.push(children[i])
      if (children[i].children.length > 0) {
        findAllChildNode(children[i])
      }
    }
  }

  function findItemValueNode (regx) {
    for (let i = childNodes.length - 1; i >= 0; i--) {
      // 先检查文字
      if (regx.test(childNodes[i].innerText)) {
        return {
          node: childNodes[i],
          attrPath: ''
        }
      }

      // 再检查属性
      let attributeNames = childNodes[i].getAttributeNames()
      for (let j = 0; j < attributeNames.length; j++) {
        if (regx.test(childNodes[i].getAttribute(attributeNames[j]))) {
          return {
            node: childNodes[i],
            attrPath: `/@${attributeNames[j]}`
          }
        }
      }
    }
  }

  function getRootPathTo (element) {
    let tagName = element.tagName.toLowerCase()
    if (element.id) {
      return `${tagName}[@id='${element.id}']`
    }
    if (element.className) {
      return `${tagName}[@class='${element.className}']`
    }
    let parentNode = element.parentNode
    if (parentNode.className) {
      return `${parentNode.tagName.toLowerCase()}[@class='${parentNode.className}']/${tagName}`
    }
    if (element === document.body) {
      return tagName
    }
    return getNumberPathTo(element)
  }

  function getNumberPathTo (element) {
    let tagName = element.tagName.toLowerCase()
    if (element === document.body) {
      return tagName
    }
    let ix = 0
    let siblings = element.parentNode.childNodes
    for (let i = 0; i < siblings.length; i++) {
      let sibling = siblings[i]
      if (sibling === element) {
        return `${getNumberPathTo(element.parentNode)}/${tagName}[${ix + 1}]`
      }
      if (sibling.nodeType === 1 && sibling.tagName.toLowerCase() === tagName) {
        ix++
      }
    }
  }

  function findSortPaths (rootUrl) {
    function formatPath (path) {
      return decodeURIComponent(path)
        .replace(new RegExp(`${keyword}`, 'gi'), '{k}')
        .replace(/\d+/, '{p}')
    }

    let preset = formatPath(window.location.href.replace(rootUrl, ''))
    const paths = {preset}

    const sortRegx = {
      time: /.*时间.*|.*time.*/gi,
      size: /.*大小.*|.*size.*/gi,
      hot: /..*点击.*|.*人气.*|.*次数.*|.*hot.*|.*count.*|.*click.*/gi
    }
    let aNodes = document.getElementsByTagName('a')
    for (let i = 0; i < aNodes.length; i++) {
      let linkText = aNodes[i].innerText
      let href = aNodes[i].getAttribute('href')
      for (let key in sortRegx) {
        if (href && sortRegx[key].test(linkText)) {
          const keyPath = formatPath(href)
          if (keyPath !== preset) {
            paths[key] = keyPath
          }
        }
      }
    }
    return paths
  }

  const groupNode = findItemGroupNode(aNode)
  if (!groupNode) {
    return
  }
  findAllChildNode(groupNode)
  const dateWrapper = findItemValueNode(new RegExp(dateRegx, 'gi'))
  const sizeWrapper = findItemValueNode(new RegExp(sizeRegx, 'gi'))
  const magnetWrapper = findItemValueNode(new RegExp(magnetRegx, 'gi'))
  const hotWrapper = findItemValueNode(new RegExp(hotRegx, 'gi'))

  let hostnameArray = window.location.hostname.split('.')
  const id = hostnameArray[Math.floor(hostnameArray.length / 2)]
  const url = `${window.location.protocol}//${window.location.host}`
  const title = document.title
  const paths = findSortPaths(url)

  // xpath
  const groupNumberPath = getNumberPathTo(groupNode)
  const group = `//${getRootPathTo(groupNode)}`
  const magnet = `.${getNumberPathTo(magnetWrapper.node).replace(groupNumberPath, '')}${magnetWrapper.attrPath}`
  const name = `.${getNumberPathTo(aNode).replace(groupNumberPath, '')}`
  const size = `.${getNumberPathTo(sizeWrapper.node).replace(groupNumberPath, '')}`
  const date = `.${getNumberPathTo(dateWrapper.node).replace(groupNumberPath, '')}`
  const hot = `.${getNumberPathTo(hotWrapper.node).replace(groupNumberPath, '')}`
  const xpath = {
    group, magnet, name, size, date, hot
  }
  const item = {
    id, name: title, url, paths, xpath
  }

  console.info('关键词：%s', keyword)
  console.info(groupNode)
  console.info(aNode)
  console.info(magnetWrapper.node)
  console.info(dateWrapper.node)
  console.info(sizeWrapper.node)
  console.info(hotWrapper.node)
  console.info(JSON.stringify(item, '\t', 2))
})()
