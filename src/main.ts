import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 将所有common文件中导出的方法挂载到全局中
import func from '@/utils/common/common'
import '@/utils/rem.js'
const app = createApp(App)
app.config.globalProperties.$func = func

app.use(store).use(router).mount('#app')
