import 'zone.js/dist/zone';
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { registerMicroApps, start } from 'qiankun';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'element-ui/lib/theme-chalk/base.css';
import 'highlight.js/styles/vs2015.css'
import directive from './directive/highlight';
import './assets/main.scss';
Vue.config.productionTip = false
Vue.directive('highlight', directive)
Vue.use(ElementUI);
let dev; // 是否是开发环境
if (process.env.NODE_ENV === "development") {
    dev = true;
} else {
    dev = false;
}
const apps = [
    {
        name: 'angularapp',
        entry: dev ? '//localhost:8082' : '/angularapp',
        container: '#angular',
        activeRule: '/angular',
        props: { a: 1 }
    },
    {
        name: 'vueapp',
        entry: dev ? '//localhost:8083' : '/vueapp',
        container: '#vue',
        activeRule: '/vue',
        props: { a: 1 }
    },
    {
        name: 'reactapp',
        entry: dev ? '//localhost:8084' : '/reactapp',
        container: '#react',
        activeRule: '/react',
    }

]
registerMicroApps(apps);
start({ prefetch: false, sandbox: { experimentalStyleIsolation: true } })
new Vue({
    router,
    render: h => h(App),
}).$mount('#app-base')
