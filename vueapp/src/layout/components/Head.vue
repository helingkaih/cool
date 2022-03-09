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
        <el-dropdown>
          <el-icon :size="20"><user /></el-icon>
          <template #dropdown>
            <el-dropdown-menu v-if="userInfo">
              <el-dropdown-item>
                账号：{{ userInfo.account }}
              </el-dropdown-item>
              <el-dropdown-item>
                昵称：{{ userInfo.nickname || "" }}
              </el-dropdown-item>
              <el-dropdown-item
                >生日：{{ userInfo.birth || "" }}
              </el-dropdown-item>
              <el-dropdown-item
                >性别：{{ userInfo.sex || "" }}
              </el-dropdown-item>
              <el-dropdown-item divided @click="out">退出登录</el-dropdown-item>
            </el-dropdown-menu>
            <el-dropdown-menu v-if="!userInfo">
              <el-dropdown-item @click="login">登录/注册</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
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
import { useCookies } from "vue3-cookies";
export default {
  name: "VaHead",
  setup() {
    const store = useStore(); // 获取store 实例
    const router = useRouter();
    const cookies = useCookies().cookies;
    const tabList = computed(() => store.state.tabList);
    const currentTab = computed(() => store.state.currentTab);
    const userInfo = computed(() => store.state.userInfo);
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

    /**
     * 退出登录
     */
    const out = () => {
      cookies.remove("userInfo");
      store.dispatch("changeUserInfo", null);
    };

    /**
     * 登录/注册
     */
    const login = () => {
      store.dispatch("changeAccount", true);
    };

    return {
      tabList,
      currentTab,
      userInfo,
      removeTab,
      clickTab,
      out,
      login,
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
        margin: 0px 15px;
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