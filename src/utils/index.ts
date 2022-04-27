export const throttle = (cd, time = 3000) => {
  var t = null
  return function () {
    if (t) return
    t = setTimeout(() => {
      cd.call(this)
      t = null
    }, time)
  }
}
