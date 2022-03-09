<template>
  <div style="height: 100vh">
    <router-view />
  </div>
</template>

<script>
import Layout from "./layout";
import { useCookies } from "vue3-cookies";
import { Base64 } from "js-base64";
import { useStore } from "vuex";
import req from "@/request";
export default {
  name: "App",
  components: {
    Layout,
  },
  watch: {
    $route(to, from) {
      // to 目标路由地址 from 原来的路由地址
      for (let topUrl of this.$store.state.tabPages) {
        for (let item of topUrl.menu) {
          if (item.child) {
            for (let child of item.child) {
              if (to.path === topUrl.path + child.path) {
                this.$store.dispatch("addTabList", {
                  name: child.name,
                  path: to.path,
                });
                break;
              }
            }
          } else {
            if (to.path === topUrl.path + item.path) {
              this.$store.dispatch("addTabList", {
                name: item.name,
                path: to.path,
              });
              break;
            }
          }
        }
      }
    },
  },
  setup() {
    const store = useStore(); // 获取store 实例
    // 检测 cookie 中是否有已经登录过的信息，有的话直接使用
    const cookies = useCookies().cookies;
    const cookieInfo = cookies.get("userInfo");
    if (cookieInfo) {
      const param = JSON.parse(Base64.decode(cookieInfo));
      req("checkUser", param, "POST").then((data) => {
        if (data.code === 1) {
          store.dispatch("changeUserInfo", param);
        }
      });
    }
  },
};
</script>

<style>
body {
  margin: 0px;
  font-family: PingFang SC, Arial, Microsoft YaHei, sans-serif;
}
p {
  margin: 0;
  line-height: 1em;
}
</style>