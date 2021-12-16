<template>
  <div style="height: 100vh; width: 100vw">
    <iframe
      src="sakura.html"
      height="100%"
      width="100%"
      id="frame_full"
      frameborder="0"
      scrolling="auto"
    ></iframe>
    <i class="el-icon-s-tools center" @click="changeShow"></i>
    <div class="center doc-box" v-show="show">
      <transition name="el-zoom-in-center">
        <div v-show="show" class="transition-box">
          <p class="title-1">微前端</p>
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="架构图" name="framework">
              <div>balalalalla</div>
              <pre v-highlight class="highlight">
                    <code class="javascript">1111 </code>
                </pre>
            </el-tab-pane>

            <el-tab-pane label="主应用配置" name="mainset">
              <p class="title-2">
                全局注册
                <span style="font-size: 16px; color: gray"
                  >( 基本配置可以前往
                  <a href="https://qiankun.umijs.org/zh" target="view_window"
                    >qiankun</a
                  >官网查看，这里只说明一些重要配置、特殊修改、服务器部署相关配置，之后的说明也是如此
                  )</span
                >
              </p>
              <p class="text-normal">
                本项目的主应用是 Vue2，在安装完 qiankun 之后，需要在主应用
                main.js 文件中注册子应用信息。
              </p>
              <pre v-highlight class="highlight">
                    <code class="javascript">{{mainRegister}}</code>
                </pre>
              <p class="title-2">路由配置与接收</p>
              <p class="text-normal">
                子应用渲染不走 router-view
                只需要准备好对应的着陆点就行，子应用的路由需要注意，在之后的子应用中需要处理
                baseurl。
              </p>
              <pre v-highlight class="highlight">
                    <code class="javascript">{{mainRouter}}</code>
                </pre>
            </el-tab-pane>
            <el-tab-pane label="Vue子应用配置" name="vuechild">
              <p class="title-2">资源获取配置</p>
              <ul class="normal-ul">
                <li>
                  由于子应用是放在服务器二级目录下的，但是获取资源的时候会默认拿根目录下的，所以需要改一些配置。
                </li>
                <li>主应用获取子应用时会有个基础路由，需要处理该基础路由。</li>
              </ul>
              <p class="text-normal">vue.config.js</p>
              <pre v-highlight class="highlight">
                    <code class="javascript">{{vueConfig}}</code>
                </pre>
              <p class="text-normal">route.js</p>
              <pre v-highlight class="highlight">
                    <code class="javascript">{{vueRoute}}</code>
                </pre>
            </el-tab-pane>
            <el-tab-pane label="Angular子应用配置" name="angularchild">
              <p class="title-2">资源获取配置</p>
              <ul class="normal-ul">
                <li>
                  由于子应用是放在服务器二级目录下的，但是获取资源的时候会默认拿根目录下的，所以需要改一些配置。
                </li>
                <li>主应用获取子应用时会有个基础路由，需要处理该基础路由。</li>
                <li>
                  由于 angular
                  框架本身的特性(打包，路由)，本地调试与部署服务器的配置差距会比较大
                </li>
              </ul>
              <p class="text-normal">app.component.ts</p>
              <pre v-highlight class="highlight">
                    <code class="javascript">{{ngAppcom}}</code>
                </pre>
              <p class="text-normal">public-path.js</p>
              <pre v-highlight class="highlight">
                    <code class="javascript">{{ngPublicPath}}</code>
                </pre>
              <p class="text-normal">app-routing.module.ts</p>
              <pre v-highlight class="highlight">
                    <code class="javascript">{{ngApproute}}</code>
                </pre>
              <p class="text-normal">package.json</p>
              <pre v-highlight class="highlight">
                    <code class="javascript">{{ngPackage}}</code>
                </pre>
            </el-tab-pane>
            <el-tab-pane label="React子应用配置" name="reactchild">
              <p class="title-2">资源获取配置</p>
              <p class="text-normal">
                React
                子应用是最容易配置的，只需要添加一条针对服务器部署的配置就行。
              </p>
              <p class="text-normal">public-path.js</p>
              <pre v-highlight class="highlight">
                    <code class="javascript">{{reactroute}}</code>
                </pre>
            </el-tab-pane>
          </el-tabs>
        </div>
      </transition>
    </div>
  </div>
</template>
<script>
export default {
  name: "home",
  data() {
    return {
      show: false,
      activeName: "framework",
      mainRegister: `
import { registerMicroApps, start } from 'qiankun';
const apps = [
    {
        name: 'angularapp',
        entry: '//localhost:8082',// 获取子应用资源的路径，本地调试和服务器获取有点不同，此项目服务器获取地址是 /angularapp 
        container: '#angular', // 将获取到的子应用资源渲染到该节点上
        activeRule: '/angular', // 进入该路由时打开子应用
        props: { a: 1 } // 给子应用传参
    }
]
registerMicroApps(apps); // 注册子应用
start({ prefetch: false }); // 启用qiankun
      `,
      mainRouter: `
    <el-menu>
      <!--基座中可以放自己的路由-->
      <el-menu-item index="/">Home</el-menu-item>
      <!--引用其他子应用-->
      <el-menu-item index="/angular">Angular</el-menu-item>
      <el-menu-item index="/vue">Vue</el-menu-item>
      <el-menu-item index="/react">React</el-menu-item>
    </el-menu>
    <router-view></router-view>
    <div id="vue"></div>
    <div id="angular"></div>
    <div id="react"></div>
      `,
      ngAppcom: `
      // 更改 icon 加载路径, ant icon 会默认拿根目录下的资源
        // http://127.0.0.1:8082 /angularapp
        if ((window as any).__POWERED_BY_QIANKUN__) {
            if (environment.production) {
                // 生产环境
                this.iconService.changeAssetsSource('/angularapp')
            } else {
                // 开发环境
                this.iconService.changeAssetsSource('http://127.0.0.1:8082/angularapp')
            }
        } else {
            if (environment.production) {
                // 生产环境
                this.iconService.changeAssetsSource('/angularapp')
            } else {
                // 开发环境
                this.iconService.changeAssetsSource('http://127.0.0.1:8082')
            }
        }
      `,
      ngPublicPath: `
    import { environment } from 'src/environments/environment';
        if (window.__POWERED_BY_QIANKUN__) {
        // eslint-disable-next-line no-undef
        // 必须，服务器开启微应用时会用到,更改请求资源的路径
        if (environment.production) {
            // 服务器上需要再加路径
            __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ + '/angularapp/';
        } else {
            __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
        }
    }
    `,
      ngApproute: `
    @NgModule({
        imports: [RouterModule.forRoot(routes)],
        exports: [RouterModule],
        providers: [{ provide: APP_BASE_HREF, useValue: (window as any).__POWERED_BY_QIANKUN__ ? '/angular/' : (environment.production ? '/angularapp/' : '/') }] // 处理主应用的基础路由
    })
    `,
      ngPackage: `
    "build": "ng build --prod --progress --deploy-url /angularapp/" // 将 angular 应用部署到该 url 下，对应服务器部署的位置,
    `,
      vueConfig: `
    module.exports = {
        xxx
        xxx
        ......
        assetsDir: 'vueapp' // 必须，将资源打到指定包中，与服务器部署路径相同
    }
    `,
      vueRoute: `
    const router = createRouter({
        // hash模式：createWebHashHistory，
        // history模式：createWebHistory
        history: createWebHistory(window.__POWERED_BY_QIANKUN__ ? '/vue/' : (process.env.NODE_ENV === "development" ? '/' : 'vueapp')), // 处理主应用的基础路由
        // history:createWebHashHistory(),
        routes,
    });
    `,
      reactroute: `
        "homepage": "reactapp"
        `,
    };
  },
  methods: {
    /**
     * 改变文档说明展示状态
     */
    changeShow() {
      this.show = !this.show;
    },

    handleClick(tab) {
      console.log("tab", tab);
    },
  },
};
</script>

<style>
.transition-box {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  background-color: white;
  padding: 20px 40px;
  box-sizing: border-box;
  overflow: auto;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
}
.doc-box {
  top: 60px;
  width: 85%;
  height: 86%;
}
.el-zoom-in-center-enter-active,
.el-zoom-in-center-leave-active {
  transition: all 1s cubic-bezier(0.55, 0, 0.1, 1) !important;
}
.el-zoom-in-center-enter,
.el-zoom-in-center-leave-active {
  opacity: 0;
  transform: scaleX(0);
}
.el-tab-pane {
  overflow: auto;
}
</style>
