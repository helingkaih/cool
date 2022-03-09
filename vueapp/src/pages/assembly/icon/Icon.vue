<template>
  <div class="main-normal-box elIcon">
    <el-input
      v-model="input"
      placeholder="请输入图标名称过滤"
      style="width: 20%"
      suffix-icon="el-icon-search"
    />
    <el-row :gutter="20" style="margin-top: 30px">
      <el-col
        :span="2"
        v-for="item of cardList"
        :key="item"
        style="margin-bottom: 15px"
      >
        <el-card
          shadow="hover"
          style="text-align: center; height: 120px"
          body-style="{padding:10px}"
        >
          <i
            :class="item"
            style="
              display: block;
              font-size: 36px;
              margin-top: 20px;
              margin-bottom: 5px;
            "
          ></i>
          <span style="font-size: 14px; word-break: break-all">{{ item }}</span>
        </el-card>
      </el-col>
    </el-row>
    <!-- <textarea
      name=""
      id=""
      cols="30"
      rows="10"
      style="max-width: 50%"
    ></textarea> -->
  </div>
</template>

<script>
import { useStore } from "vuex";
import { onUnmounted, ref, getCurrentInstance } from "vue";
export default {
  name: "Icon",
  data() {
    return {
      cardList: [
        "el-icon-platform-eleme",
        "el-icon-eleme",
        "el-icon-delete-solid",
        "el-icon-delete",
        "el-icon-s-tools",
        "el-icon-setting",
        "el-icon-user-solid",
        "el-icon-user",
        "el-icon-phone",
        "el-icon-phone-outline",
        "el-icon-more",
        "el-icon-more-outline",
        "el-icon-star-on",
        "el-icon-star-off",
        "el-icon-s-goods",
        "el-icon-goods",
        "el-icon-warning",
        "el-icon-warning-outline",
        "el-icon-question",
        "el-icon-info",
        "el-icon-remove",
      ],
    };
  },
  setup(props) {
    onUnmounted(() => {});
    return {
      input: ref(""),
    };
  },
};
</script>

<style>
.elIcon .el-card__body {
  padding: 10px;
}
</style>