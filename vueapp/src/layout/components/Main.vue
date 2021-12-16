<template>
  <div style="height: 100%; background: #f6f8f9; padding: 20px">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in" appear>
        <keep-alive>
          <component :is="Component"></component>
        </keep-alive>
      </transition>
    </router-view>
  </div>
</template>

<script>
export default {
  name: "VaMain",
  components: {},
  computed: {
    key() {
      console.log(this.$route.path);
      return this.$route.path;
    },
  },
};
</script>

<style lang="scss">
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-leave-from,
.fade-enter-to {
  opacity: 1;
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.1s;
}
</style>