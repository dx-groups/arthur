const DefaultCookieExpire = 7

export default {
  getCookie(cookieName) {
    if (document.cookie.length > 0) {
      let startIndex = document.cookie.indexOf(cookieName + '=')
      if (startIndex !== -1) {
        startIndex += cookieName.length + 1
        let endIndex = document.cookie.indexOf(';', startIndex)
        if (endIndex === -1) endIndex = document.cookie.length
        return unescape(document.cookie.substring(startIndex, endIndex))
      }
    }
    return ''
  },

  setCookie(cookieName, value, expiredays = DefaultCookieExpire) {
    const expireDate = new Date()
    expireDate.setDate(expireDate.getDate() + expiredays)
    document.cookie = cookieName + '=' + escape(value) +
      ((expiredays === null) ? '' : ';expires=' + expireDate.toGMTString())
  },

  checkCookie(cookieName, expiredays) {
    const cookie = this.getCookie(cookieName)
    if (cookie) {
      this.setCookie(cookieName, cookie, expiredays)
      return true
    }

    return false
  }
}
