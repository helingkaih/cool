<template>
  <el-row>
    <el-col :span="3">
      <el-affix position="top">
        <VaLeft></VaLeft>
      </el-affix>
    </el-col>
    <el-col :span="21">
      <el-affix position="top">
        <VaHead></VaHead>
      </el-affix>
      <VaMain></VaMain>
    </el-col>
  </el-row>
</template>

<script>
import { VaHead, VaLeft, VaMain } from "./components";
export default {
  name: "Layout",
  components: {
    VaLeft,
    VaHead,
    VaMain,
  },
};
</script>

<style>
</style>