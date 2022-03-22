import { createApp } from 'vue'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
// import './scss/variable.less'
import App from './App'

import svgIcon from '@/components/svg/SvgIcon.vue'


import router from '@/router'
import { store } from '@/store'
import '@/scss/common.scss'
import '@/scss/index.scss'

createApp(App).use(router).use(store).use(Antd).component('SvgIcon', svgIcon).mount('#app')
