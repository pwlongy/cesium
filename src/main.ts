import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import 'cesium/Build/CesiumUnminified/Widgets/widgets.css'


createApp(App).use(store).use(router).mount('#app')
