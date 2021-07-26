import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

let instance = null
function render() {
 instance = new Vue({
   render: h => h(App)
 }).$mount('#app'); // 这里是挂载到自己的html中  基座会拿到这个挂载后的html 将其插入进去
}

if (window.__POWERED_BY_QIANKUN__) { // 动态添加publicPath
 let __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
 console.log(__webpack_public_path__)
}
if (!window.__POWERED_BY_QIANKUN__) { // 默认独立运行
 render();
}

// 父应用加载子应用，子应用必须暴露三个接口：bootstrap、mount、unmount
// 子组件的协议就ok了
export async function bootstrap(props) {
  console.log('vue1',props)
}

export async function mount(props) {
  console.log('vue2',props)
 render(props)
}

export async function unmount(props) {
  console.log('vue3',props)
 instance.$destroy();
}
