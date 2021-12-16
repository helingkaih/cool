<template>
  <el-affix :offset="120" class="anchor-box">
    <ul class="anchor">
      <li v-for="a of anchorData" :key="a.id">
        <!-- :href="'#' + a.id" -->
        <a @click="jump(a.id)">{{ a.title }}</a>
      </li>
      <div id="toc-marker" class="toc-marker"></div>
    </ul>
  </el-affix>
</template>

<script>
import { onMounted } from "@vue/runtime-core";
export default {
  name: "anchor",
  props: ["anchorData"],
  components: {},
  setup(props) {
    const KEY_MAP = {}; // id 和 index 的map
    const BASE_DISTANCE = 26; // 左侧蓝色小方块移动距离的最小单位
    const SHOW_MAP = []; // 当前页面可视的 dom 集合
    let MARKER; // 左侧蓝色小方块
    onMounted(() => {
      MARKER = document.getElementById("toc-marker"); // 左侧蓝色小方块
      const obs = new IntersectionObserver((entries) => {
        for (let item of entries) {
          SHOW_MAP[KEY_MAP[item.target.id]] = item["isIntersecting"];
        }
        moveMarker();
      });
      for (let index in props.anchorData) {
        const dom = document.getElementById(props.anchorData[index].id);
        KEY_MAP[props.anchorData[index].id] = +index;
        SHOW_MAP.push(false);
        if (dom && dom instanceof HTMLElement) {
          obs.observe(dom);
        }
      }
    });
    const jump = (id) => {
      window.scrollTo({
        top: document.getElementById(id).offsetTop - 150,
        behavior: "smooth",
      });
    };
    const moveMarker = () => {
      for (let index in SHOW_MAP) {
        if (SHOW_MAP[index]) {
          const move = (+index + 1) * BASE_DISTANCE + "px";
          MARKER.style.top = move;
          return;
        }
      }
    };
    return {
      jump,
    };
  },
};
</script>

<style lang="scss">
.anchor-box {
  flex-grow: 1;
}
.anchor {
  position: relative;
  padding: 20px 15px;
  li {
    line-height: 25px;
    list-style: none;
  }
  a {
    text-decoration: unset;
    font-size: 14px;
    color: #909399;
    cursor: pointer;
  }
  .toc-marker {
    opacity: 1;
    position: absolute;
    background-color: #409eff;
    border-radius: 4px;
    width: 4px;
    height: 14px;
    top: 26px;
    left: 0;
    z-index: 0;
    transition: top 0.25s cubic-bezier(0, 1, 0.5, 1), opacity 0.25s,
      background-color 0.5s;
  }
}
</style>