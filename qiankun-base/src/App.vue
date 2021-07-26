<template>
  <div id="app-base">
    <el-menu default-active="/" :router="true" mode="horizontal">
      <!--基座中可以放自己的路由-->
      <el-menu-item index="/">Home</el-menu-item>
      <!--引用其他子应用-->
      <el-menu-item index="/angular">Angular</el-menu-item>
      <el-menu-item index="/vue">Vue</el-menu-item>
    </el-menu>
    <router-view></router-view>
    <div id="vue"></div>
    <div id="angular"></div>
  </div>
</template>

<script>
export default {
  name: "Main",
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
