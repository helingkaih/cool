<template>
  <div style="background: white; padding: 20px; border-radius: 4px">
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
          style="height: 120px; text-align: center"
          body-style="{padding:10px}"
        >
          <el-icon
            style="
              font-size: 36px;
              margin-bottom: 5px;
              display: inline-block;
              margin-top: 20px;
            "
          >
            <component :is="item" />
          </el-icon>
          <span style="font-size: 14px; word-break: break-all; display: block">
            {{ item }}
          </span>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { onUnmounted, ref } from "vue";
export default {
  name: "IconPlus",
  components: {},
  data() {
    return {
      cardList: [
        "aim",
        "AddLocation",
        "Apple",
        "AlarmClock",
        "ArrowDown",
        "ArrowDownBold",
        "ArrowLeft",
        "ArrowLeftBold",
        "ArrowRightBold",
        "ArrowUp",
        "Back",
        "Bell",
        "Baseball",
      ],
    };
  },
  setup() {
    onUnmounted(() => {});
    return {
      input: ref(""),
    };
  },
};
</script>

<style>
.el-card__body {
  padding: 10px;
}
</style>