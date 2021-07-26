import 'zone.js/dist/zone';
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { registerMicroApps, start } from 'qiankun';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.config.productionTip = false
Vue.use(ElementUI);
const apps = [
    {
        name: 'vueApp',
        entry: '//localhost:8081',
        container: '#vue',
        activeRule: '/vue',
        props: { a: 1 }
    },
    {
        name: 'angularApp',
        entry: '//localhost:8082',
        container: '#angular',
        activeRule: '/angular',
        props: { a: 1 }
    }
]
registerMicroApps(apps);
start({ prefetch: false })
new Vue({
    router,
    render: h => h(App),
}).$mount('#app-base')
