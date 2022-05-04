const IS_LOGIN = 'user-login'

export default {
  setIsLogin: payload => {
    window.localStorage.setItem(IS_LOGIN, payload)
  },
  getIsLogin: () => {
    return window.localStorage.getItem(IS_LOGIN) === 'true'
  },
  rmIsLogin: () => {
    window.localStorage.removeItem(IS_LOGIN)
  },
}
