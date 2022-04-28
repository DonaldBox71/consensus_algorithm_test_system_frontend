const baseSize = 17.2
// 设置 rem 函数
function setRem () {
// 750 是设计稿的宽度
  const scale = document.documentElement.clientWidth / 864
  // 设置页面根节点字体大小
  document.documentElement.style.fontSize = (baseSize * Math.min(scale, 1.25)) + 'px'
}
// 初始化
setRem()
// 改变窗口大小时重新设置 rem
window.onresize = function () {
  setRem()
}
