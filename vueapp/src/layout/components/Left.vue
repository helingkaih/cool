<template>
  <div class="menu-main">
    <div style="display: flex">
      <div
        style="
          width: 63px;
          background: #282c34;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 10px 0px;
        "
      >
        <el-icon :size="40" color="white">
          <list />
        </el-icon>
      </div>
      <div style="text-align: center; flex-grow: 1">
        <p style="font-size: 20px; color: #5a516e">vue element plus</p>
      </div>
    </div>
    <!-- </div> -->
    <el-tabs
      :tab-position="'left'"
      class="menu-tabs"
      type="border-card"
      v-model="activeTop"
      @tab-click="tabClick"
    >
      <el-tab-pane
        v-for="item of tabPages"
        :label="item.label"
        :key="item.name"
        :name="item.name"
      >
        <template #label>
          <el-icon style="display: block; margin-left: 13px; font-size: 20px">
            <component :is="item.icon" />
          </el-icon>
          <span style="line-height: 26px">{{ item.name }}</span>
        </template>
        <el-menu
          :default-active="activePath"
          active-text-color="#1890ff"
          text-color="black"
          :default-openeds="['0']"
          class="el-menu-vertical-demo"
          :router="true"
        >
          <template v-for="(mItem, index) of item.menu">
            <el-sub-menu
              v-if="mItem.child"
              :key="mItem.name"
              :index="index + ''"
            >
              <template #title>
                <i :class="mItem.icon"></i>
                <span> {{ mItem.name }}</span>
              </template>
              <el-menu-item-group>
                <el-menu-item
                  v-for="mItemc of mItem.child"
                  :index="item.path + mItemc.path"
                  :key="mItemc.name"
                >
                  <template #title>
                    <!-- <i :class="mItemc.icon"></i> -->
                    <span> {{ mItemc.name }}</span>
                  </template>
                </el-menu-item>
              </el-menu-item-group>
            </el-sub-menu>
            <el-menu-item
              v-else
              :index="item.path + mItem.path"
              :key="mItem.name"
            >
              <template #title>
                <i :class="mItem.icon"></i>
                <span> {{ mItem.name }}</span>
              </template>
            </el-menu-item>
          </template>
        </el-menu>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: "VaLeft",
  components: {},
  computed: {
    tabPages() {
      // 获取路由配置
      return this.$store.state.tabPages;
    },
    activePath() {
      // 获取当前激活的路由
      return this.$store.state.currentTab["path"];
    },
    activeTop() {
      // 获取当前激活的路由的主模块
      let name;
      if (this.$store.state.currentTab["path"]) {
        for (let item of this.$store.state.tabPages) {
          if (this.$store.state.currentTab["path"].indexOf(item.path) !== -1) {
            name = item.name;
            break;
          }
        }
      }
      return name;
    },
  },
  data() {
    return {};
  },
  methods: {
    /**
     * 点击页面最左侧竖向列表
     */
    tabClick(event) {
      // 默认会打开该模块中的第一个最小模块
      for (let item of this.$store.state.tabPages) {
        if (event.props.label === item.label) {
          if (item.menu[0].child) {
            const child = item.menu[0].child[0];
            this.$router.push({ path: item.path + child.path });
          } else {
            this.$router.push({ path: item.path + item.menu[0].path });
          }
          break;
        }
      }
    },
  },
};
</script>

<style lang="scss">
.menu-main {
  height: 100vh;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  .el-tabs--border-card {
    background: unset;
    box-shadow: unset;
    .el-tabs__content {
      padding: unset;
    }
  }
  .menu-tabs {
    height: 100%;
    border: unset;
    .el-tabs__header {
      background: #282c34;
    }
    .el-tabs__item {
      height: 54px;
      width: 54px;
      text-align: center !important;
      border: unset !important;
      font-size: 14px;
      font-weight: bold;
      color: white !important;
      margin: 5px !important;
      line-height: unset;
      border-radius: 8px;
      padding: 4px;
      &.is-active {
        background: #1890ff !important;
      }
    }
    .el-icon-date {
      display: block;
    }
    .el-tab-pane {
      overflow-x: hidden;
    }
  }
  .el-menu {
    border: unset;
  }
}
</style>