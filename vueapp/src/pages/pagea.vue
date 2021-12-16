<template>
  <div>pagea</div>
</template>

<script>
import { onUnmounted } from "vue";
export default {
  name: "pagea",
  components: {},
  setup() {
    console.log("pagea初始化");
    onUnmounted(() => {
      console.log("pagea被销毁");
    });
  },
};
</script>

<style>
</style>