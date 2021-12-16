import { createApp } from 'vue';
import App from './App.vue';
import router from './route';
import ElementPlus from 'element-plus';
import './public-path';
import 'element-plus/dist/index.css';
import './assets/global.scss';
import * as icons from '@element-plus/icons';
import 'highlight.js/styles/vs2015.css'
import * as directive from './directive';
import store from './store/shared';
let vue = createApp(App);

// 导入 icon 
for (let key in icons) {
  vue.component(key, icons[key])
}
// 导入指令
for (let item in directive.default) {
  vue.directive(item, directive.default[item]);
};

function render(props) {
  const { container } = props;
  vue.use(router).use(ElementPlus).use(store).mount(container ? container.querySelector("#app") : '#app');
  // 这里是挂载到自己的html中  基座会拿到这个挂载后的html 将其插入进去
}

if (!window.__POWERED_BY_QIANKUN__) { // 默认独立运行
  render({});
}

// 父应用加载子应用，子应用必须暴露三个接口：bootstrap、mount、unmount
// 子组件的协议就ok了
export async function bootstrap(props) {
}

export async function mount(props) {
  render(props)
}

export async function unmount(props) {
  vue.unmount();
}
