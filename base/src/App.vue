<template>
  <div class="main-menu">
    <el-dropdown
      style="
        position: absolute;
        z-index: 10;
        top: -8px;
        left: 50%;
        transform: translate(-50%, 0);
      "
      placement="bottom"
      @command="menuClick"
    >
      <span class="el-dropdown-link">
        <i class="el-icon-arrow-down" style="font-size: 30px"></i>
      </span>
      <el-dropdown-menu slot="dropdown" split-button="true">
        <el-dropdown-item command="/">Home</el-dropdown-item>
        <el-dropdown-item command="/angular">Angular</el-dropdown-item>
        <el-dropdown-item command="/vue">Vue</el-dropdown-item>
        <el-dropdown-item command="/react">React</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-menu
      v-if="main"
      default-active="/"
      :router="true"
      mode="horizontal"
      text-color="#fff"
      active-text-color="#c3e525"
      style="position: absolute; z-index: 10; background-color: unset"
    >
      <!--基座中可以放自己的路由-->
      <el-menu-item index="/">Home</el-menu-item>
      <!--引用其他子应用-->
      <el-menu-item index="/angular">Angular</el-menu-item>
      <el-menu-item index="/vue">Vue</el-menu-item>
      <el-menu-item index="/react">React</el-menu-item>
    </el-menu>
    <router-view class="main-style"></router-view>
    <div id="vue"></div>
    <div id="angular"></div>
    <div id="react"></div>
  </div>
</template>

<script>
export default {
  name: "Main",
  watch: {
    $route(to) {
      this.main = to.fullPath === "/";
    },
  },
  data() {
    return {
      main: true,
    };
  },
  methods: {
    menuClick(item) {
      this.$router.push({ path: item });
    },
  },
};
</script>
<style lang="scss" scoped>
.main-menu {
  position: relative;
  .el-menu.el-menu--horizontal {
    border-bottom: unset;
  }
  .el-menu-item:hover {
    background-color: unset !important;
  }
}
</style>
