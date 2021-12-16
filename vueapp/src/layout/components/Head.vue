<template>
  <div class="head-main">
    <div class="head-top">
      <div class="head-top-left">
        <el-icon>
          <d-arrow-left />
        </el-icon>
        <el-breadcrumb
          separator-class="el-icon-arrow-right"
          style="margin-left: 16px"
        >
          <el-breadcrumb-item :to="{ path: '/' }">homepage</el-breadcrumb-item>
          <el-breadcrumb-item>promotion management</el-breadcrumb-item>
          <el-breadcrumb-item>promotion list</el-breadcrumb-item>
          <el-breadcrumb-item>promotion detail</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="head-top-right">
        <el-icon>
          <search />
        </el-icon>
        <el-icon>
          <bell />
        </el-icon>
        <el-icon>
          <full-screen />
        </el-icon>
        <el-icon>
          <setting />
        </el-icon>
        <el-icon>
          <refresh />
        </el-icon>
      </div>
    </div>
    <div class="head-bottom">
      <el-tabs
        v-model="currentTab.name"
        type="card"
        @tab-click="clickTab"
        @tab-remove="removeTab"
        style="margin-top: 10px"
      >
        <el-tab-pane
          v-for="item of tabList"
          :key="item.name"
          :closable="item.name === '主页' ? false : true"
          :label="item.name"
          :name="item.name"
        >
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
export default {
  name: "VaHead",
  setup() {
    const store = useStore(); // 获取store 实例
    const router = useRouter();
    const tabList = computed(() => store.state.tabList);
    const currentTab = computed(() => store.state.currentTab);
    const clickTab = (event) => {
      for (let item of tabList.value) {
        if (item.name === event.props.name) {
          router.push({ path: item.path });
          break;
        }
      }
    };

    /**
     * 删除 tab
     */
    const removeTab = (name) => {
      if (currentTab.value.name === name) {
        // 如果删掉的 tab 是当前正在看的 tab，则切换到前一个 tab
        const index = tabList.value.findIndex((item) => {
          return item.name === name;
        });
        router.push({ path: tabList.value[index - 1].path });
      }
      store.dispatch("deleteTabList", { name });
    };

    return {
      tabList,
      currentTab,
      removeTab,
      clickTab,
    };
  },
};
</script>

<style lang="scss">
.head-main {
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  background: white;
  .head-top {
    height: 60px;
    display: flex;
    padding: 0 20px;
    justify-content: space-between;
    .head-top-left {
      display: flex;
      align-items: center;
    }
    .head-top-right {
      display: flex;
      align-items: center;
      i {
        font-size: 16px;
        margin-left: 30px;
      }
    }
  }
  .head-bottom {
    border-top: 1px solid #f6f6f6;
    height: 50px;
    padding: 0px 15px;
  }
}
</style>