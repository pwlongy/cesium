import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 将所有common文件中导出的方法挂载到全局中
import func from '@/utils/common/common'
import '@/utils/rem.js'

const app = createApp(App)
app.config.globalProperties.$func = func



// 外部引入资源
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
app.use(ElementPlus)

app.use(store).use(router).mount('#app')
