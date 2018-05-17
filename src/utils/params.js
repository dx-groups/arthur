export default {
  json2url(json) {
    let url = ''
    let arr = []
    for (let i in json) {
      if (json[i]) {
        arr.push(i + '=' + json[i])
      }
    }
    url = arr.join('&')
    return url
  },
  url2json(url) {
    const oSearch = decodeURI(url.search).substring(1)
    const json = {}
    oSearch.split('&').forEach((m, i) => {
      json[m.split('=')[0]] = m.split('=')[1]
    })
    return json
  },
  urlConvertJson(url) {
    let urlArg = url.split('?')
    return urlArg
  },
  /** *
   * 解析地址栏 params
   * @param name
   * @returns {value}
 */
  getUrlParam (name) {
    let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)') // 构造一个含有目标参数的正则表达式对象
    let r = window.location.search.substr(1).match(reg) // 匹配目标参数
    if (r != null) return unescape(r[2])
    return null // 返回参数值
  },
  parseUrlParam (url, name) {
    let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)') // 构造一个含有目标参数的正则表达式对象
    let r = url.match(reg) // 匹配目标参数
    if (r != null) return unescape(r[2])
    return null // 返回参数值
  }
}
