// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import App from './App'
import router from './router'
import store from './store'
import iView from 'iview'
import i18n from '@/locale'
import config from '@/config'
import importDirective from '@/directive'
import { directive as clickOutside } from 'v-click-outside-x'
import installPlugin from '@/plugin'
import './index.less'
import '@/assets/icons/iconfont.css'
import TreeTable from 'tree-table-vue'
import VOrgTree from 'v-org-tree'
import 'v-org-tree/dist/v-org-tree.css'

import CryptoJS from 'crypto-js'
import VueVideoPlayer from 'vue-video-player'
import 'video.js/dist/video-js.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './config/rem'
import global_ from './Global'
Vue.use(ElementUI)
Vue.use(VueVideoPlayer)

// 实际打包时应该不引入mock
/* eslint-disable */
// if (process.env.NODE_ENV !== 'production') require('@/mock')

Vue.use(iView, {
  i18n: (key, value) => i18n.t(key, value)
})

Vue.use(VueAxios, axios)
Vue.use(TreeTable)
Vue.use(VOrgTree)
/**
 * @description 注册admin内置插件
 */
installPlugin(Vue)
/**
 * @description 生产环境关掉提示
 */
Vue.config.productionTip = false
/**
 * @description 全局注册应用配置
 */
Vue.prototype.$axios = axios
Vue.prototype.$config = config
Vue.prototype.GLOBAL = global_;
axios.defaults.baseURL=global_.BASE_URL;
/**
 * 注册指令
 */
importDirective(Vue)
Vue.directive('clickOutside', clickOutside)


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  CryptoJS,
  i18n,
  store,
  render: h => h(App)
})

import Print from 'vue-iframe-print'

Vue.use(Print);
