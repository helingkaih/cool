<template>
  <div style="height: 100vh">
    <router-view />
  </div>
</template>

<script>
import Layout from "./layout";
import { useStore } from "vuex";
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
  setup() {},
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